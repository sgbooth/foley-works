import {
  ActionIcon,
  Box,
  Group,
  Kbd,
  Menu,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { Lightbox } from "@mantine/lightbox";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import type { PatentSearchResult } from "../../domain/patentSearch";
import { ApplicationIdTextInput } from "../applicationData/ApplicationIdTextInput";
import { Icon } from "../../shared/Icon";
import styles from "./GlobalSearch.module.css";

export function GlobalSearch({
  onApplicationSearch,
}: {
  onApplicationSearch: (search: PatentSearchResult) => void;
}) {
  const [opened, setOpened] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!opened) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    });
    return () => cancelAnimationFrame(frame);
  }, [opened]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpened(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectApplication = (search: PatentSearchResult) => {
    setOpened(false);
    onApplicationSearch(search);
  };

  return (
    <>
      <Group gap={8} wrap="nowrap" h="100%" px={7}>
        <Menu shadow="md" width={300} withArrow>
          <Menu.Target>
            <ActionIcon aria-label="Open menu" variant="transparent" className={styles.menuButton}>
              <img src="/logo.svg" alt="" width={26} height={26} className={styles.menuIcon} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Test</Menu.Label>

            <Menu.Item
              leftSection={<Icon.Settings size={14} />}
              onClick={() => {}}
              children="My Profile"
            />
            <Menu.Item
              leftSection={<Icon.Logout size={14} />}
              onClick={() => {}}
              children="Logout"
            />
          </Menu.Dropdown>
        </Menu>

        <UnstyledButton
          onClick={() => setOpened(true)}
          c="dimmed"
          style={{
            display: "flex",
            height: 25,
            alignItems: "center",
            gap: 8,
            padding: "0 7px",
            border: "1px solid var(--mantine-color-default-border)",
            borderRadius: 4,
            background: "var(--mantine-color-body)",
            fontSize: 10,
            textAlign: "left",
            cursor: "pointer",
          }}>
          <IconSearch size={14} />
          <span>Search…</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginLeft: "auto",
              color: "var(--mantine-color-dimmed)",
            }}>
            <Kbd style={{ minWidth: 16, padding: "2px 4px", fontSize: 8, lineHeight: 1 }}>⌘</Kbd>
            <b style={{ fontSize: 9, fontWeight: 400 }}>K</b>
          </span>
        </UnstyledButton>
      </Group>
      <Lightbox
        opened={opened}
        onClose={() => setOpened(false)}
        slides={[
          {
            type: "custom",
            render: () => (
              <Box w="100%" mih="65vh" display="grid" style={{ placeItems: "center" }}>
                <Paper
                  w="min(480px, calc(100vw - 32px))"
                  p="clamp(22px, 4vw, 27px)"
                  withBorder
                  radius="md"
                  shadow="xl"
                  bg="body">
                  <Group>
                    <Icon.Search size={16} color="var(--mantine-primary-color-6)" />
                    <Text c="dimmed" size="9px" fw={600} lts={1.1}>
                      GLOBAL SEARCH
                    </Text>
                  </Group>
                  <Stack mt="lg" gap="xs">
                    <ApplicationIdTextInput
                      autoFocus
                      inputRef={searchInputRef}
                      onSearch={selectApplication}
                    />
                  </Stack>
                </Paper>
              </Box>
            ),
          },
        ]}
        withNavigation={false}
        closeOnClickOutside
        withInitialFocusPlaceholder={false}
        zIndex={10000}
        transitionProps={{
          transition: "pop",
          duration: 140,
          onEntered: () => searchInputRef.current?.focus(),
        }}
        styles={{
          overlay: {
            backgroundColor: "color-mix(in srgb, var(--mantine-color-dark-9) 24%, transparent)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          },
          content: { display: "flex", alignItems: "center", justifyContent: "center" },
          slides: { display: "flex", alignItems: "center", justifyContent: "center" },
          slide: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: 16,
          },
        }}
      />
    </>
  );
}
