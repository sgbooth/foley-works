import { MantineProvider, createTheme, rem } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider, createStore } from "jotai";
import { useState } from "react";
import { trpc, trpcClient } from "../rpc/client";
import type { ReactNode } from "react";
import "@mantine/core/styles.css";
import "@mantine/lightbox/styles.css";
import "../styles.css";

const theme = createTheme({
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  primaryColor: "indigo",
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(17),
    xl: rem(18),
  },
  headings: {
    sizes: {
      h1: { fontWeight: "700", fontSize: rem(30), lineHeight: "1.4" },
      h2: { fontWeight: "700", fontSize: rem(18), lineHeight: "1.25" },
      h3: { fontWeight: "700", fontSize: rem(16), lineHeight: "1.1" },
    },
  },
  components: {
    InputWrapper: {
      styles: {
        label: {
          lineHeight: "1.0",
          marginBottom: rem(0),
          fontSize: rem(12),
          color: "var(--mantine-color-gray-7)",
        },
      },
    },
    Select: {
      styles: {
        dropdown: { boxShadow: "var(--mantine-shadow-md)" },
      },
    },
  },
});

export function AppProviders({
  store,
  children,
}: {
  store: ReturnType<typeof createStore>;
  children: ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <MantineProvider theme={theme}>
      <JotaiProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            {children}
          </trpc.Provider>
        </QueryClientProvider>
      </JotaiProvider>
    </MantineProvider>
  );
}
