import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export const useHasActiveSubscription = () => {
    const trpc = useTRPC();
    const searchParams = useSearchParams();
    const [isPolling, setIsPolling] = useState(false);
    
    // Detect if user just returned from checkout
    const hasCheckoutToken = searchParams.has("customer_session_token");
    
    useEffect(() => {
        if (hasCheckoutToken) {
            setIsPolling(true);
        }
    }, [hasCheckoutToken]);
    
    const {data, isLoading, ...rest} = useQuery({
        ...trpc.subscriptions.getState.queryOptions(),
        refetchOnWindowFocus: true,  
        staleTime: 0,
        // Poll every 2 seconds if just returned from checkout, until subscription is found
        refetchInterval: isPolling ? 2000 : false,
    });

    const hasActiveSubscription = data?.hasActiveSubscription ?? false;
    
    // Stop polling once subscription is found
    useEffect(() => {
        if (hasActiveSubscription && isPolling) {
            setIsPolling(false);
        }
    }, [hasActiveSubscription, isPolling]);

    return {
        hasActiveSubscription,
        subscription: data?.activeSubscriptions?.[0],
        isLoading,
        ...rest,
    }
}