import { Alert, Box, Button, Stack, Text } from "@mantine/core";
import { useRef, useState } from "react";
import type { PatentSearchResult } from "../domain/patentSearch";
import { ApplicationDataPanel } from "../features/applicationData/ApplicationDataPanel";
import { GlobalSearch } from "../features/globalSearch/GlobalSearch";
import { DockingPanel, type PanelDef, type PanelInstance } from "../shared/DockingPanel";
import { useDockingWorkspace } from "../shared/useDockingWorkspace";
import { OutlookAdapter } from "./outlookAdapter";

function OutlookHomePanel() {
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const readSubject = async () => {
    try {
      setError("");
      setSubject(await OutlookAdapter.getSubject());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to read the message subject.");
    }
  };

  return (
    <Stack p="md" gap="sm">
      <Text fw={700} size="lg">
        Outlook workspace
      </Text>
      <Text c="dimmed" size="sm">
        Work with the current message and patent application references.
      </Text>
      <Button w="fit-content" onClick={() => void readSubject()}>
        Read message subject
      </Button>
      {error && <Alert color="red">{error}</Alert>}
      {subject && <Text size="sm">{subject}</Text>}
    </Stack>
  );
}

const definitions: PanelDef[] = [
  { type: "outlook-home", title: "Outlook", component: OutlookHomePanel, closable: false },
  { type: "application-data", title: "Application Data", component: ApplicationDataPanel },
];
const initialPanels: PanelInstance[] = [
  { id: "outlook-home", type: "outlook-home", closable: false },
];

function formatApplicationTitle(search: PatentSearchResult) {
  if (search.key === "applicationId")
    return `${search.value.slice(0, 2)}/${search.value.slice(2, 5)},${search.value.slice(5)}`;
  if (search.key === "patentId") return `US ${search.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  return `US ${search.value.slice(0, 4)}/${search.value.slice(4)}`;
}

export function OutlookApp() {
  const workspace = useDockingWorkspace(initialPanels);
  const panelNumber = useRef(1);
  const openApplication = (search: PatentSearchResult) => {
    const id = `application-data-${panelNumber.current++}`;
    workspace.addPanel({
      id,
      type: "application-data",
      title: formatApplicationTitle(search),
      props: { externalSearch: search },
    });
  };
  return (
    <Box component="main" w="100vw" h="100vh" miw={320} bg="body" style={{ overflow: "hidden" }}>
      <DockingPanel
        definitions={definitions}
        panels={workspace.panels}
        onPanelsChange={workspace.setPanels}
        onReady={workspace.onReady}
        headerMenu={<GlobalSearch onApplicationSearch={openApplication} />}
      />
    </Box>
  );
}
