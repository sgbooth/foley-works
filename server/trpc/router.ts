import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { patentsRouter } from './procedures/patents';
const t=initTRPC.context<Context>().create();
export const appRouter=t.router({patents:patentsRouter});
export type AppRouter=typeof appRouter;
