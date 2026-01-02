import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { polarClient } from "@/lib/polar";
import { TRPCError } from "@trpc/server";

export const subscriptionsRouter = createTRPCRouter({
    getState: protectedProcedure.query(async ({ ctx }) => {
        try {
            const customer = await polarClient.customers.getStateExternal({
                externalId: ctx.auth.user.id,
            });
            
            return {
                activeSubscriptions: customer.activeSubscriptions || [],
                hasActiveSubscription: 
                    customer.activeSubscriptions && 
                    customer.activeSubscriptions.length > 0,
            };
        } catch (error) {
            // If customer not found in Polar, return empty state
            if (error instanceof Error && error.message.includes("404")) {
                return {
                    activeSubscriptions: [],
                    hasActiveSubscription: false,
                };
            }
            
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch subscription state",
            });
        }
    }),
});
