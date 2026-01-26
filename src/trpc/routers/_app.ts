import { createTRPCRouter,} from '../init';
import { workflowsRouters } from '@/features/workflows/server/routers';
import { subscriptionsRouter } from '@/features/subscriptions/server/routers';
import { credentialsRouters } from '@/features/credentials/server/routers';


 export const appRouter = createTRPCRouter({
  workflows: workflowsRouters,
  subscriptions: subscriptionsRouter,
  credentials: credentialsRouters,
    
});
// export type definition of API
export type AppRouter = typeof appRouter;