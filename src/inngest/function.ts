import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {createOpenAI} from "@ai-sdk/openai";
import { generateText } from "ai";
import * as Sentry from "@sentry/nextjs";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");

    console.warn("something is missing");
   Sentry.logger.info("User triggered test log",{log_source :"sentry_tesr"})

    const {steps: geminiSteps} = await step.ai.wrap(
      "gemini-generate-text",generateText,
      {
      model: google("gemini-2.5-flash"),
      system: "You are a helpful assistant",
      prompt: "What is 2+2",
        experimental_telemetry: {
    isEnabled: true,
    recordInputs: true,
    recordOutputs: true,
  },
      }
    );

 const {steps: openaiSteps} = await step.ai.wrap(
      "openai-generate-text",generateText,
      {
      model: openai("gpt-4"),
      system: "You are a helpful assistant",
      prompt: "What is 2+2?",
        experimental_telemetry: {
    isEnabled: true,
    recordInputs: true,
    recordOutputs: true,
  },
      }
    );



    return{
      geminiSteps,
      openaiSteps,
    };

  },
);