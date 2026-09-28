import { useRef, useState } from "react";
import type { DockviewApi } from "dockview-react";
import type { DockPosition, PanelInstance } from "./DockingPanel";

type NewPanel = Omit<PanelInstance, "position"> & { position?: DockPosition };

export function useDockingWorkspace(initialPanels: PanelInstance[]) {
  const [panels, setPanels] = useState(initialPanels);
  const apiRef = useRef<DockviewApi | null>(null);

  const addPanel = (panel: NewPanel) => {
    setPanels(current => {
      const position = panel.position ?? {
        direction: "within" as const,
        referencePanel: apiRef.current?.activePanel?.id ?? current.at(-1)?.id ?? panel.id,
      };
      return [...current, { ...panel, position }];
    });
  };

  return {
    panels,
    setPanels,
    apiRef,
    addPanel,
    onReady: (api: DockviewApi) => {
      apiRef.current = api;
    },
  };
}
