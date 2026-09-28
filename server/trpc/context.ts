export async function createContext() { return { userId: null as string | null }; }
export type Context = Awaited<ReturnType<typeof createContext>>;
