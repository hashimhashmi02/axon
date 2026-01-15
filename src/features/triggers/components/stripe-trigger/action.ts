"use server"

import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger"
import { getSubscriptionToken, Realtime } from "@inngest/realtime"
import { inngest } from "@/inngest/client"


export type StripeTriggerToken = Realtime.Token<
typeof stripeTriggerChannel,
["status"]
>;

export async function fetchStripeTriggerRealtimeToken(): Promise<StripeTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: stripeTriggerChannel(),
        topics:["status"],
    })
    return token;
}