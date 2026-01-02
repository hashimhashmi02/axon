import { createTRPCRouter,} from '../init';
import { workflowsRouters } from '@/features/workflows/server/routers';
import { subscriptionsRouter } from '@/features/subscriptions/server/routers';


 export const appRouter = createTRPCRouter({
  workflows: workflowsRouters,
  subscriptions: subscriptionsRouter,
    
});
// export type definition of API
export type AppRouter = typeof appRouter;