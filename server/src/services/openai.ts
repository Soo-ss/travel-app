import OpenAI from "openai";
import "dotenv/config";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing. Check server/.env.");
}

const client = new OpenAI({
  apiKey,
});

export async function createChatCompletion(messages: any[]) {
  return client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.4,
  });
}
