"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { boolean } from "zod"



interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({
    open,
    onOpenChange
}: Props) => {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        Trigger this workflow manually
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">Manual trigger</p>

                </div>


            </DialogContent>
        </Dialog>


    )
} 
