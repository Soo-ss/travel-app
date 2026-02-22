import { Router } from "express";
import { createChatCompletion } from "../services/openai";
import { logger } from "../utils/logger";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await createChatCompletion([
      { role: "user", content: message },
    ]);

    res.json({
      answer: completion.choices[0].message.content,
    });
  } catch (error) {
    logger.error("Failed to handle /api/chat request", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Chat request failed.",
    });
  }
});

export default router;
