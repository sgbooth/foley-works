import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AppProviders } from "./shared/AppProviders";
import { webStore } from "./shared/store";
createRoot(document.getElementById("root")!).render(
  <AppProviders store={webStore}>
    <App />
  </AppProviders>,
);
