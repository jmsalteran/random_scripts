import OpenAI from "openai";
import { logger } from "../../shared/utils/logger";
import "dotenv/config";

export class OpenAIService {
  static async sendSingleMessageToAssistant(userMessage: string, assistantId: string): Promise<string | null> {
    try {
      logger.info(`[OpenAIService] Sending message to assistant ${assistantId}`);
      
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      const OPENAI_ORGANIZATION = process.env.OPENAI_ORGANIZATION;
      
      if (!OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY environment variable is required");
      }
      
      const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        organization: OPENAI_ORGANIZATION, 
      });

      const thread = await openai.beta.threads.create();
      logger.info(`[OpenAIService] Created thread: ${thread.id}`);
    
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: userMessage,
      });
      logger.info(`[OpenAIService] Added user message to thread`);
    
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });
      logger.info(`[OpenAIService] Created run: ${run.id}`);
    
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      logger.info(`[OpenAIService] Initial run status: ${runStatus.status}`);
      
      const maxWaitTime = 5000; // 5 seconds timeout
      const pollInterval = 1000; // 1 second between polls
      const startTime = Date.now();
      
      while (runStatus.status !== "completed" && runStatus.status !== "failed") {
        // Check for timeout
        if (Date.now() - startTime > maxWaitTime) {
          logger.error(`[OpenAIService] Assistant run timed out after ${maxWaitTime}ms for assistant ${assistantId}`);
          throw new Error(`Assistant run timed out for assistant ${assistantId}`);
        }
        
        await new Promise((r) => setTimeout(r, pollInterval));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        logger.info(`[OpenAIService] Run status: ${runStatus.status}`);
      }
    
      if (runStatus.status === "failed") {
        logger.error(`[OpenAIService] Assistant run failed for assistant ${assistantId}`);
        throw new Error(`There is an error in the assistant ${assistantId}`);
      }
    
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data.find((m: any) => m.role === "assistant");
      
      if (!lastMessage) {
        logger.warn(`[OpenAIService] No assistant message found in thread ${thread.id}`);
        return null;
      }

      const content = lastMessage.content[0];
      if (content?.type === "text") {
        logger.info(`[OpenAIService] Successfully retrieved assistant response`);
        return content.text.value || null;
      }
      
      logger.warn(`[OpenAIService] Message content is not text type`);
      return null;
    } catch (error) {
      logger.error(`[OpenAIService] Error in sendSingleMessageToAssistant: ${error instanceof Error ? error.message : String(error)}`, error);
      throw error;
    }
  }

  static async getCustomerNameType(name: string): Promise<string | null> {
    const MERU_NAME_TYPE_MANAGER = process.env.OPENAI_MERU_NAME_TYPE_MANAGER;
    
    if (!MERU_NAME_TYPE_MANAGER) {
      throw new Error("OPENAI_MERU_NAME_TYPE_MANAGER environment variable is required");
    }
    
    return this.sendSingleMessageToAssistant(name, MERU_NAME_TYPE_MANAGER);
  }
} 