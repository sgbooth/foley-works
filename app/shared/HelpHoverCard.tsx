import { ActionIcon, HoverCard } from "@mantine/core";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type Props = {
  children: ReactNode;
};

export const HelpHoverCard: React.FC<Props> = ({ children }) => {
  return (
    <HoverCard shadow="md">
      <HoverCard.Target>
        <ActionIcon variant="transparent" children={<Icon.Help />} size="sm" />
      </HoverCard.Target>
      <HoverCard.Dropdown>{children}</HoverCard.Dropdown>
    </HoverCard>
  );
};
