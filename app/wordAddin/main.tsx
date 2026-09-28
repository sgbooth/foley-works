import { createRoot } from "react-dom/client";
import { AppProviders } from "../shared/AppProviders";
import { officePaneStore } from "../shared/store";
import { WordApp } from "./WordApp";
createRoot(document.getElementById("root")!).render(
  <AppProviders store={officePaneStore}>
    <WordApp />
  </AppProviders>,
);
