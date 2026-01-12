import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, {type Options as KYOptions} from "ky";

type HttpRequestData = {
    variableName?: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body: string;
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId,
    context,
    step,
}) =>{

    if(!data.endpoint){
        throw new NonRetriableError("HTTP Request node : No endpoint configured")
    }


    if(!data.variableName){
        throw new NonRetriableError("No variable name configured")
    }

    const result = await step.run("http-request", async () => {
        const endpoint = data.endpoint!;
        const method=data.method || "GET";

        const options: KYOptions = {method};
        
        if(["POST", "PUT", "PATCH"].includes(method)){
            options.body = data.body;
            options.headers = {
                "Content-Type": "application/json",
            };

        }
        
        const response = await ky(endpoint, options); 
        const contentType = response.headers.get("content-type");
        const responseData = contentType?.includes("application/json") 
        ? await response.json()
        : await response.text();


        const responsePayload = {
             httpResponse: {
                status: response.status,
               statusText: response.statusText,
               data: responseData,
            }

        }
        
        if (data.variableName){
            return {
                ...context,
                [data.variableName]: responsePayload,
            }
        }

        return {
            ...context,
            ...responsePayload,
        }

    }
)

    return result;

}
