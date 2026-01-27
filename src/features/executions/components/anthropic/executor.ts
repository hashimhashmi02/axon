import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import {createAnthropic} from "@ai-sdk/anthropic";
import Handlebars from "handlebars";
import { generateText } from "ai";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";


Handlebars.registerHelper("json", (context) => {
    const jsonstring = JSON.stringify(context , null ,2);
    const safeString = new Handlebars.SafeString(jsonstring);
    return safeString;
});

type AnthropicData = {
    variableName?: string;
    credentialId?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
    data,
    nodeId,
    userId,
    context,
    step,
    publish,
}) =>{
    await publish(
        anthropicChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    if(!data.variableName){
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Variable name is required");
    }

     if(!data.credentialId){
            await publish(
                anthropicChannel().status({
                    nodeId,
                    status: "error",
                }),
            );
            throw new NonRetriableError("Credential is required");
        }


    if(!data.userPrompt){
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("User prompt is required");
    }

    const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : " You are a helpful assistant";

    const userPrompt = Handlebars.compile(data.userPrompt)(context);
    
 const credential = await step.run("get-credential",() =>{
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId,
                userId,
            },
        });
    });

    if(!credential){
        throw new NonRetriableError("Credential not found");
    }

    const credentialValue = credential.value;
    
    const anthropic = createAnthropic({
        apiKey: decrypt(credentialValue),
    });


    try{

        const {steps} = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            {
                model: anthropic("claude-4-5-sonnet"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            },
            
        );

        const text =steps[0].content[0].type === "text" 
        ? steps[0].content[0].text
        : "";

        await publish(
            anthropicChannel().status({
                nodeId,
                status: "success",
            }),
        );

        return {
            ...context,
            [data.variableName ]:{text},
        };

        

    } catch (error) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }



};
