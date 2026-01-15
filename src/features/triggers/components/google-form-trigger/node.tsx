import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken, } from "./action";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";


export const GoogleFormTrigger = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGoogleFormTriggerRealtimeToken,
    })


    const handleOpenSetting = () => {
        setDialogOpen(true);
    }
    return (
        <>
            <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                icon="/logos/googleform.svg"
                name="Google Form"
                status={nodeStatus}
                description="Trigger this workflow when a Google Form is submitted"
                onSettings={handleOpenSetting}
                onDoubleClick={handleOpenSetting}




            />

        </>
    )
})