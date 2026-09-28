import { createRoot } from "react-dom/client";
import { AppProviders } from "../shared/AppProviders";
import { officePaneStore } from "../shared/store";
import { OutlookApp } from "./OutlookApp";
createRoot(document.getElementById("root")!).render(
  <AppProviders store={officePaneStore}>
    <OutlookApp />
  </AppProviders>,
);
