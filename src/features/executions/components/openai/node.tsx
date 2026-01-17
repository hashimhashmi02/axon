"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { OpenAiFormValues, OpenAiDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenAiRealtimeToken } from "./action";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";


type OpenAINodeData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAINodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAiRealtimeToken,
    })

    const handleSettings = () =>
        setDialogOpen(true);

    const handleSubmit = (values: OpenAiFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values,
                    },
                };
            }
            return node;
        }))
    }


    const nodeData = props.data;
    const description = nodeData?.userPrompt
        ? `gpt-4o:${nodeData.userPrompt.slice(0, 50)}...`
        : "Not configured";

    return (
        <>
            <OpenAiDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/openai.svg"
                name="OpenAI"
                status={nodeStatus}
                description={description}
                onSettings={handleSettings}
                onDoubleClick={handleSettings}
            />
        </>

    )

});


OpenAiNode.displayName = "OpenAiNode";
