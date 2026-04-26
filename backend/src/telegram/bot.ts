import { Bot, InlineKeyboard } from "grammy";
import { authMiddleware } from "./auth";
import { handleTelegramMessage } from "./handlers/message";
import { handleTelegramVoice } from "./handlers/voice";
import { WhatsAppService } from "../services/whatsapp.service";
import { ReminderService } from "../services/reminder.service";
import { MassDiffusionService } from "../services/diffusion.service";
import { getSettings, updateSettings, db, listReminders, deleteReminder } from "../core/memory";

type TelegramBot = Bot & { ownerId: string };

export let bot: TelegramBot | null = null;

export function initTelegramBot(
  waService: WhatsAppService,
  reminderService: ReminderService,
  diffusionService: MassDiffusionService
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("[Telegram] TELEGRAM_BOT_TOKEN no configurado en .env. El bot de Telegram no se iniciará.");
    return;
  }

  bot = new Bot(token) as TelegramBot;
  bot.ownerId = 'admin-01';
  bot.use(authMiddleware);

  bot.api.setMyCommands([
    { command: "start", description: "Iniciar el bot" },
    { command: "dashboard", description: "Ver panel de control" },
    { command: "recordatorios", description: "Gestión de recordatorios" },
    { command: "masivo", description: "Enviar difusión masiva (/masivo 521.., 521.. | Hola)" },
    { command: "cerebro", description: "Ver configuración del bot" },
    { command: "auditoria", description: "Ver últimos 10 movimientos" },
    { command: "borrarmemorial", description: "Borrar memoria del bot" },
  ]).catch(console.error);

  bot.command("start", (ctx) => ctx.reply("Welcome to OpenGravity. I am your local AI agent. How can I help you?"));

  bot.command(["dashboard", "dashbord"], async (ctx) => {
    const { TunnelService } = await import("../core/tunnel");
    const tunnelUrl = TunnelService.getInstance().getUrl();
    const targetUrl = tunnelUrl || process.env.DASHBOARD_URL || "http://localhost:3000";
    await ctx.reply(`🌌 *OpenGravity Dashboard*\n🔗 ${targetUrl}`, { parse_mode: "Markdown" });
  });

  bot.command(["recordatorios", "recordatorio"], async (ctx) => {
    const keyboard = new InlineKeyboard()
      .text("📋 Ver Activos", "view_reminders")
      .text("➕ Crear Nuevo", "new_reminder")
      .row()
      .text("🗑️ Eliminar", "delete_reminder");
    await ctx.reply("📅 *Gestión de Recordatorios*", { reply_markup: keyboard, parse_mode: "Markdown" });
  });

  bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    const userId = ctx.from.id.toString();

    if (data === "view_reminders") {
      const reminders = await listReminders(userId) as any[];
      if (reminders.length === 0) return ctx.answerCallbackQuery({ text: "No tienes recordatorios activos.", show_alert: true });
      const text = reminders.map(r => `• ID: ${r.id} | ${r.time} | ${r.text}`).join("\n");
      await ctx.reply(`📋 *Tus recordatorios:*\n${text}`, { parse_mode: "Markdown" });
      await ctx.answerCallbackQuery();
    } else if (data === "new_reminder") {
      await ctx.reply("Para crear un recordatorio, simplemente dímelo en lenguaje natural:\nEjemplo: _'Acuérdame de comprar leche a las 5pm'_", { parse_mode: "Markdown" });
      await ctx.answerCallbackQuery();
    } else if (data === "delete_reminder") {
      await ctx.reply("Para eliminar un recordatorio, usa el comando: `/delreminder ID`", { parse_mode: "Markdown" });
      await ctx.answerCallbackQuery();
    }
  });

  bot.command("delreminder", async (ctx) => {
    const args = ctx.message?.text.split(" ").slice(1);
    if (!args || args.length === 0) return ctx.reply("⚠️ Proporciona el ID. Ejemplo: `/delreminder 5`", { parse_mode: "Markdown" });
    const id = parseInt(args[0]);
    if (isNaN(id)) return ctx.reply("⚠️ ID inválido.");
    await deleteReminder(id);
    await ctx.reply(`✅ Recordatorio ${id} eliminado.`);
  });

  bot.command("masivo", async (ctx) => {
    const text = ctx.message?.text || "";
    const payload = text.replace("/masivo", "").trim();
    if (!payload.includes("|")) {
      return ctx.reply("⚠️ Formato incorrecto.\nUso: `/masivo 521XXXXXXXX, 521YYYYYYYY | Tu mensaje aquí`", { parse_mode: "Markdown" });
    }
    const [numbersStr, ...msgParts] = payload.split("|");
    const rawMessage = msgParts.join("|").trim();
    const numbers = numbersStr.split(",").map(n => n.trim()).filter(n => n);

    if (numbers.length === 0 || !rawMessage) {
      return ctx.reply("⚠️ Faltan números o mensaje.");
    }

    const contacts = numbers.map(n => ({ number: n, name: "Usuario" }));
    await ctx.reply(`🚀 Iniciando difusión masiva para ${contacts.length} contactos...`);
    diffusionService.sendMass(contacts, rawMessage).catch(console.error);
  });

  bot.command("cerebro", async (ctx) => {
    const settings = await getSettings() as any;
    const text = `🧠 *Cerebro Actual*\n\n*Nombre:* ${settings.bot_name}\n\n*Prompt:*\n_${settings.system_prompt}_\n\n*Reglas:*\n_${settings.possible_responses}_\n\n💡 _Para editar, usa:_ \`/setname\`, \`/setprompt\`, \`/setrules\``;
    await ctx.reply(text, { parse_mode: "Markdown" });
  });

  bot.command("setname", async (ctx) => {
    const name = ctx.message?.text.replace("/setname", "").trim();
    if (!name) return ctx.reply("⚠️ Debes proporcionar un nombre. Ejemplo: `/setname GravityBot`", { parse_mode: "Markdown" });
    await updateSettings({ bot_name: name });
    await ctx.reply(`✅ Nombre actualizado a: *${name}*`, { parse_mode: "Markdown" });
  });

  bot.command("setprompt", async (ctx) => {
    const prompt = ctx.message?.text.replace("/setprompt", "").trim();
    if (!prompt) return ctx.reply("⚠️ Debes proporcionar un prompt.");
    await updateSettings({ system_prompt: prompt });
    await ctx.reply(`✅ Prompt actualizado.`);
  });

  bot.command("setrules", async (ctx) => {
    const rules = ctx.message?.text.replace("/setrules", "").trim();
    if (!rules) return ctx.reply("⚠️ Debes proporcionar las reglas.");
    await updateSettings({ possible_responses: rules });
    await ctx.reply(`✅ Reglas actualizadas.`);
  });

  bot.command("auditoria", async (ctx) => {
    try {
        const stmt = db.prepare('SELECT * FROM audits ORDER BY timestamp DESC LIMIT 10');
        const rows = stmt.all() as any[];
        if (rows.length === 0) return ctx.reply("No hay registros de auditoría.");
        const text = rows.map(r => `• [${r.timestamp}] ${r.action}: ${r.details}`).join("\n");
        await ctx.reply(`📊 *Últimas Acciones:*\n${text.substring(0, 4000)}`, { parse_mode: "Markdown" });
    } catch(e) {
        await ctx.reply("Error obteniendo auditoría.");
    }
  });

  bot.command(["reset", "reiniciabot", "borrarmemorial"], async (ctx) => {
    const userId = ctx.from?.id.toString();
    if (!userId) return;
    const { clearHistory } = await import("../core/memory");
    await clearHistory(userId);
    await ctx.reply("🧹 Memoria borrada. ¡Empecemos de nuevo!");
  });

  bot.on("message:voice", handleTelegramVoice);
  bot.on("message:text", handleTelegramMessage);

  bot.catch((err) => console.error("[Grammy Error]", err));

  bot.start({
    onStart: (botInfo) => {
      console.log(`[Telegram] Bot iniciado como @${botInfo.username}`);
    }
  });
}
