import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import type { ComponentType } from "react";
import { useState } from "react";
import type { FileHistoryEvent } from "../../domain/UsptoTypes";
import { Icon } from "../../shared/Icon";

type Props = {
  applicationId: string;
  events: FileHistoryEvent[];
  loading: boolean;
  error: string;
  onRetry: () => void;
};

const formatDirection = (direction: string) =>
  direction.charAt(0) + direction.slice(1).toLowerCase();

const fileTypePresentation = {
  PDF: { icon: Icon.FilePdf, color: "red", label: "PDF" },
  MS_WORD: { icon: Icon.FileDocx, color: "indigo", label: "Word document" },
  XML: { icon: Icon.FileXml, color: "grape", label: "XML" },
  PNG: { icon: Icon.Image, color: "green", label: "PNG image" },
} satisfies Record<
  FileHistoryEvent["downloadOptionBag"][number]["mimeTypeIdentifier"],
  { icon: ComponentType<{ size?: number | string }>; color: string; label: string }
>;

export function FileHistory({ applicationId, events, loading, error, onRetry }: Props) {
  const [filter, setFilter] = useState("");
  if (loading) return <Loader size="sm" />;
  if (error) {
    return (
      <Group gap="sm" align="center">
        <Text c="red" size="sm">
          {error}
        </Text>
        <Button size="xs" variant="light" onClick={onRetry}>
          Retry
        </Button>
      </Group>
    );
  }
  if (events.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        No file history was returned.
      </Text>
    );
  }

  const query = filter.trim().toLowerCase();
  const filteredEvents = events.filter(event =>
    [
      event.officialDate,
      event.documentCode,
      event.documentCodeDescriptionText,
      event.directionCategory,
      event.documentIdentifier,
      ...event.downloadOptionBag.map(option => option.mimeTypeIdentifier),
    ]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );

  return (
    <Stack gap="xs">
      <TextInput
        aria-label="Filter file history"
        placeholder="Filter file history…"
        size="xs"
        value={filter}
        onChange={event => setFilter(event.currentTarget.value)}
      />
      <Paper withBorder radius="sm" style={{ overflow: "auto" }}>
        <Table striped highlightOnHover miw={640} verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Code</Table.Th>
              <Table.Th>Document</Table.Th>
              <Table.Th>Files</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredEvents.length ? (
              filteredEvents.map((event, index) => (
                <Table.Tr key={`${event.documentIdentifier}-${index}`}>
                  <Table.Td style={{ whiteSpace: "nowrap" }}>{event.officialDate || "—"}</Table.Td>
                  <Table.Td style={{ whiteSpace: "nowrap" }}>{event.documentCode || "—"}</Table.Td>
                  <Table.Td>{event.documentCodeDescriptionText || "—"}</Table.Td>
                  <Table.Td>
                    <Group gap={6} wrap="nowrap">
                      {event.downloadOptionBag?.map((option, optionIndex) => {
                        const presentation = fileTypePresentation[option.mimeTypeIdentifier];
                        const FileIcon = presentation.icon;
                        const label = `Download ${presentation.label}`;
                        return (
                          <Tooltip
                            key={`${option.mimeTypeIdentifier}-${optionIndex}`}
                            label={label}
                            withArrow>
                            <ActionIcon
                              component="a"
                              href={`/trpc/downloads?${new URLSearchParams({
                                applicationId,
                                documentIdentifier: event.documentIdentifier,
                                mimeType: option.mimeTypeIdentifier,
                              }).toString()}`}
                              aria-label={label}
                              color={presentation.color}
                              variant="light"
                              size="sm">
                              <FileIcon size={15} />
                            </ActionIcon>
                          </Tooltip>
                        );
                      })}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" size="sm" ta="center">
                    No file history entries match “{filter}”.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
