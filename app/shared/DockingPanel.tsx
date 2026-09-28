import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DockviewDefaultTab,
  DockviewReact,
  type DockviewApi,
  type DockviewReadyEvent,
  type IDockviewHeaderActionsProps,
  type IDockviewPanelHeaderProps,
  type IDockviewPanelProps,
} from "dockview-react";
import "dockview/dist/styles/dockview.css";
import "./extra.css";

export type DockPosition = {
  direction: "left" | "right" | "above" | "below" | "within";
  referencePanel: string;
};
export type PanelDef = {
  type: string;
  title: string;
  component: React.ComponentType<any>;
  closable?: boolean;
};
export type PanelInstance = {
  id: string;
  type: string;
  title?: string;
  props?: Record<string, unknown>;
  closable?: boolean;
  position?: DockPosition;
};
type PanelParams = {
  Component: React.ComponentType<any>;
  props: Record<string, unknown>;
  closable: boolean;
};
const GenericPanel: React.FC<IDockviewPanelProps<PanelParams>> = ({ params }) => {
  const Component = params.Component;
  return <Component {...params.props} />;
};
const GenericTab: React.FC<IDockviewPanelHeaderProps<PanelParams>> = props => (
  <DockviewDefaultTab {...props} hideClose={props.params.closable === false} />
);
const components = { generic: GenericPanel };
const tabComponents = { generic: GenericTab };
const HeaderMenuContext = createContext<{ menu?: React.ReactNode; groupId?: string }>({});

function PrefixHeaderActions({ group }: IDockviewHeaderActionsProps) {
  const { menu, groupId } = useContext(HeaderMenuContext);
  if (!menu || group.id !== groupId) return null;
  return (
    <div
      style={{ display: "flex", height: "100%", alignItems: "center", padding: "0 4px" }}
      onMouseDown={event => event.stopPropagation()}
      onPointerDown={event => event.stopPropagation()}
      onDragStart={event => event.preventDefault()}>
      {menu}
    </div>
  );
}

function topLeftGroup(api: DockviewApi) {
  return api.groups
    .filter(group => group.api.location.type === "grid")
    .flatMap(group => {
      const box = group.api.boundingBox;
      return box ? [{ group, box }] : [];
    })
    .sort((a, b) => a.box.top - b.box.top || a.box.left - b.box.left)[0]?.group;
}

export function DockingPanel({
  definitions,
  panels,
  onPanelsChange,
  headerMenu,
  onReady,
}: {
  definitions: PanelDef[];
  panels: PanelInstance[];
  onPanelsChange: (panels: PanelInstance[]) => void;
  headerMenu?: React.ReactNode;
  onReady?: (api: DockviewApi) => void;
}) {
  const [api, setApi] = useState<DockviewApi>();
  const [primaryGroupId, setPrimaryGroupId] = useState<string>();
  const panelsRef = useRef(panels);
  panelsRef.current = panels;
  const definitionsByType = useMemo(
    () => new Map(definitions.map(definition => [definition.type, definition])),
    [definitions],
  );

  useEffect(() => {
    if (!api) return;
    const wanted = new Set(panels.map(panel => panel.id));
    for (const panel of [...api.panels]) if (!wanted.has(panel.id)) api.removePanel(panel);
    for (const instance of panels) {
      const definition = definitionsByType.get(instance.type);
      if (!definition) continue;
      const params: PanelParams = {
        Component: definition.component,
        props: instance.props ?? {},
        closable: instance.closable ?? definition.closable ?? true,
      };
      const title = instance.title ?? definition.title;
      const existing = api.getPanel(instance.id);
      if (existing) {
        existing.api.updateParameters(params);
        if (existing.api.title !== title) existing.api.setTitle(title);
        continue;
      }
      api.addPanel({
        id: instance.id,
        component: "generic",
        tabComponent: "generic",
        title,
        params,
        ...(instance.position ? { position: instance.position } : {}),
      });
    }
  }, [api, definitionsByType, panels]);

  useEffect(() => {
    if (!api) return;
    const removed = api.onDidRemovePanel(panel => {
      if (panelsRef.current.some(item => item.id === panel.id)) {
        onPanelsChange(panelsRef.current.filter(item => item.id !== panel.id));
      }
    });
    const updatePrimaryGroup = () => setPrimaryGroupId(topLeftGroup(api)?.id);
    updatePrimaryGroup();
    const layout = api.onDidLayoutChange(updatePrimaryGroup);
    return () => {
      removed.dispose();
      layout.dispose();
    };
  }, [api, onPanelsChange]);

  const headerContext = useMemo(
    () => ({ menu: headerMenu, groupId: primaryGroupId }),
    [headerMenu, primaryGroupId],
  );

  const dockviewRoot = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (dockviewRoot.current) {
      dockviewRoot.current.style.width = "100%";
      dockviewRoot.current.style.height = "100%";
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <HeaderMenuContext.Provider value={headerContext}>
        <DockviewReact
          ref={dockviewRoot}
          className="dockview-theme-light"
          components={components}
          tabComponents={tabComponents}
          dndStrategy="pointer"
          prefixHeaderActionsComponent={PrefixHeaderActions}
          onReady={(event: DockviewReadyEvent) => {
            setApi(event.api);
            onReady?.(event.api);
          }}
        />
      </HeaderMenuContext.Provider>
    </div>
  );
}
