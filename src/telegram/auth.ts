import { Context } from "grammy";
import type { NextFunction } from "grammy";

export async function authMiddleware(ctx: Context, next: NextFunction) {
  if (!ctx.from) return;
  const userId = ctx.from.id.toString();

  const adminId = process.env.TELEGRAM_ALLOWED_USER_IDS;

  if (adminId && !adminId.split(',').includes(userId)) {
    console.warn(`[Telegram Auth] Acceso denegado para el ID: ${userId}. Solo se permiten administradores en Telegram.`);
    await ctx.reply(`⛔ Acceso restringido.\n\nEste bot de Telegram solo está disponible para el administrador del sistema.\n\nTu ID es: \`${userId}\``, { parse_mode: "MarkdownV2" });
    return;
  }

  await next();
}
