import { Context, InputFile } from "grammy";
import { runAgent } from "../../core/agent";
import { textToSpeech } from "../../core/voice";
import { bot } from "../bot";

export async function handleTelegramMessage(ctx: Context) {
  const userId = ctx.from?.id.toString();
  const text = ctx.message?.text;
  if (!userId || !text) return;

  console.log(`[Telegram] Message from ${userId}: ${text.substring(0, 50)}...`);
  await ctx.replyWithChatAction("typing");

  try {
    const agentResponse = await runAgent(userId, text, userId, undefined, true);
    const needsVoice = /voz|audio|habla|dímelo|escuchar/i.test(text);

    if (needsVoice) {
      await handleTelegramVoiceResponse(ctx, agentResponse);
    } else {
      await ctx.reply(agentResponse);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Telegram Error]", error);
    await ctx.reply(`Error processing your request: ${message}`);
  }
}

async function handleTelegramVoiceResponse(ctx: Context, text: string) {
  try {
    const voiceBuffer = await textToSpeech(text);
    if (voiceBuffer) {
      await ctx.replyWithChatAction("upload_voice");
      await ctx.replyWithVoice(new InputFile(voiceBuffer, "reply.mp3"));
    } else {
      await ctx.reply(text);
    }
  } catch (error) {
    console.error("Audio failure:", error);
    await ctx.reply(text);
  }
}
