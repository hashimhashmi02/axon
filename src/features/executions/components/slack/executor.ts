import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";

import { discordChannel } from "@/inngest/channels/discord";
import { decode } from "html-entities";
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";


Handlebars.registerHelper("json", (context) => {
    const jsonstring = JSON.stringify(context , null ,2);
    const safeString = new Handlebars.SafeString(jsonstring);
    return safeString;
});

type SlackData = {
    variableName?: string;
   webhookUrl?: string;
   content?: string;
  
}

export const slackExecutor: NodeExecutor<SlackData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) =>{
    await publish(
        discordChannel().status({
            nodeId,
            status: "loading",
        }),
    );


    if(!data.content){
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Content is required");
    }

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);
    
    // Validate content is not empty
    const trimmedContent = content.trim();
    if (!trimmedContent) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Content cannot be empty after template processing");
    }

    try{
       
        const result = await step.run("send-discord-message", async() => {
            if(!data.webhookUrl){
                await publish(
                    discordChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );
                throw new NonRetriableError("Webhook URL is required");
            }

            const payload: { content: string; username?: string } = {
                content: trimmedContent.slice(0, 2000),
            };
          

            try {
                await ky.post(data.webhookUrl, {
                    json: {
                        content :content,
                    },
                });
            } catch (error) {
                if (error instanceof Error && 'response' in error) {
                    const kyError = error as { response: Response };
                    const errorBody = await kyError.response.text();
                    console.error("Slack API Error:", errorBody);
                    throw new NonRetriableError(`Slack API Error: ${errorBody}`);
                }
                throw error;
            }

             if(!data.variableName){
             await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Variable name is required");
    }
            return {
                ... context,
                [data.variableName]:{
                    messageContent: content.slice(0, 2000),
                },
            }
        })

        await publish(
            slackChannel().status({
                nodeId,
                status: "success",
            }),
        );
        
        return result;

    } catch (error) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }



};
