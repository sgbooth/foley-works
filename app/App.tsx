import { Box } from "@mantine/core";
import { useRef } from "react";
import type { PatentSearchResult } from "./domain/patentSearch";
import { ApplicationDataPanel } from "./features/applicationData/ApplicationDataPanel";
import { GlobalSearch } from "./features/globalSearch/GlobalSearch";
import { WelcomePanel } from "./features/applicationData/WelcomePanel";
import { DockingPanel, type PanelDef, type PanelInstance } from "./shared/DockingPanel";
import { useDockingWorkspace } from "./shared/useDockingWorkspace";

const panelDefinitions: PanelDef[] = [
  { type: "welcome", title: "Welcome", component: WelcomePanel, closable: false },
  { type: "application-data", title: "Application Data", component: ApplicationDataPanel },
];
const initialPanels: PanelInstance[] = [{ id: "welcome", type: "welcome", closable: false }];

function formatPanelTitle(search: PatentSearchResult) {
  if (search.key === "applicationId")
    return `${search.value.slice(0, 2)}/${search.value.slice(2, 5)},${search.value.slice(5)}`;
  if (search.key === "patentId") return `US ${search.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  return `US ${search.value.slice(0, 4)}/${search.value.slice(4)}`;
}

export function App() {
  const workspace = useDockingWorkspace(initialPanels);
  const panelNumber = useRef(1);
  const openApplication = (search: PatentSearchResult) => {
    const id = `application-data-${panelNumber.current++}`;
    workspace.addPanel({
      id,
      type: "application-data",
      title: formatPanelTitle(search),
      props: { externalSearch: search },
    });
  };
  return (
    <Box component="main" w="100vw" h="100vh" miw={360} bg="body" style={{ overflow: "hidden" }}>
      <DockingPanel
        definitions={panelDefinitions}
        panels={workspace.panels}
        onPanelsChange={workspace.setPanels}
        onReady={workspace.onReady}
        headerMenu={<GlobalSearch onApplicationSearch={openApplication} />}
      />
    </Box>
  );
}
