import { Alert, Anchor, Badge, Group, Loader, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import type { FileHistoryEvent, PatentApplicationData } from "../../domain/UsptoTypes";
import type { PatentSearchResult } from "../../domain/patentSearch";
import { getPatentApplication, getPatentFileHistory } from "../patentSearch/patentSearchApi";
import { FileHistory } from "./FileHistory";

type DataItem = { label: string; value?: string | number; href?: string };
const patentUrl = (value?: string | number) =>
  value ? `https://patents.google.com/patent/US${String(value).replace(/\D/g, "")}` : undefined;

function DataCard({ title, items }: { title: string; items: DataItem[] }) {
  const visible = items.filter(item => item.value !== undefined && item.value !== "");
  if (!visible.length) return null;
  return (
    <Paper withBorder p="sm" radius="sm" miw={0} bg="body">
      <Text size="xs" fw={700} tt="uppercase" mb={7}>
        {title}
      </Text>
      <Stack gap={5}>
        {visible.map(item => (
          <Group key={item.label} gap="xs" align="baseline" wrap="nowrap">
            <Text
              size="xs"
              c="dimmed"
              style={{ width: 100, flex: "none", overflowWrap: "anywhere" }}>
              {item.label}
            </Text>
            {item.href ? (
              <Anchor
                size="sm"
                href={item.href}
                target="_blank"
                rel="noreferrer"
                style={{ overflowWrap: "anywhere" }}>
                {item.value}
              </Anchor>
            ) : (
              <Text size="sm" style={{ overflowWrap: "anywhere" }}>
                {item.value}
              </Text>
            )}
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}

function Metadata({ data }: { data: PatentApplicationData }) {
  const meta = data.applicationMetaData ?? {};
  const people = (values: NonNullable<typeof meta.applicantBag>) =>
    values.map((person, index) => ({
      label: String(index + 1),
      value:
        person.applicantNameText ||
        [person.firstName, person.middleName, person.lastName].filter(Boolean).join(" "),
    }));
  const sections: { title: string; items: DataItem[] }[] = [
    {
      title: "Application",
      items: [
        { label: "Application #", value: data.applicationNumberText },
        { label: "Title", value: meta.inventionTitle },
        { label: "Status", value: meta.applicationStatusDescriptionText },
        { label: "Status date", value: meta.applicationStatusDate },
        { label: "Docket", value: meta.docketNumber },
      ],
    },
    {
      title: "Filing",
      items: [
        { label: "Filing date", value: meta.filingDate },
        { label: "Effective date", value: meta.effectiveFilingDate },
        { label: "Type", value: meta.applicationTypeLabelName || meta.applicationTypeCategory },
      ],
    },
    {
      title: "Grant",
      items: [
        { label: "Patent #", value: meta.patentNumber, href: patentUrl(meta.patentNumber) },
        { label: "Grant date", value: meta.grantDate },
        {
          label: "Publication #",
          value: meta.earliestPublicationNumber,
          href: patentUrl(meta.earliestPublicationNumber),
        },
        { label: "Publication date", value: meta.earliestPublicationDate },
      ],
    },
    {
      title: "Classification",
      items: [
        { label: "Class", value: meta.class },
        { label: "Subclass", value: meta.subclass },
        { label: "CPC", value: meta.cpcClassificationBag?.join(", ") },
        { label: "Art unit", value: meta.groupArtUnitNumber },
      ],
    },
    {
      title: "Administration",
      items: [
        { label: "Examiner", value: meta.examinerNameText },
        { label: "Applicant", value: meta.firstApplicantName },
        { label: "Inventor", value: meta.firstInventorName },
        { label: "Confirmation #", value: meta.applicationConfirmationNumber },
      ],
    },
    { title: "Applicants", items: people(meta.applicantBag ?? []) },
    {
      title: "Inventors",
      items: (meta.inventorBag ?? []).map((person, index) => ({
        label: String(index + 1),
        value:
          person.inventorNameText ||
          [person.firstName, person.middleName, person.lastName].filter(Boolean).join(" "),
      })),
    },
  ];
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="sm">
      {sections.map(section => (
        <DataCard key={section.title} {...section} />
      ))}
    </SimpleGrid>
  );
}

export function ApplicationDataPanel({ externalSearch }: { externalSearch?: PatentSearchResult }) {
  const [application, setApplication] = useState<PatentApplicationData>();
  const [fileHistory, setFileHistory] = useState<FileHistoryEvent[]>([]);
  const [fileHistoryLoading, setFileHistoryLoading] = useState(false);
  const [fileHistoryError, setFileHistoryError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const loadFileHistory = async (applicationId: string, currentRequest: number) => {
    setFileHistoryLoading(true);
    setFileHistoryError("");
    try {
      const history = await getPatentFileHistory(applicationId);
      if (currentRequest === requestId.current) setFileHistory(history);
    } catch (cause) {
      if (currentRequest === requestId.current) {
        setFileHistoryError(
          cause instanceof Error ? cause.message : "Unable to load file history.",
        );
      }
    } finally {
      if (currentRequest === requestId.current) setFileHistoryLoading(false);
    }
  };
  const search = async (input: PatentSearchResult) => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError("");
    setApplication(undefined);
    setFileHistory([]);
    setFileHistoryLoading(false);
    setFileHistoryError("");
    try {
      const result = await getPatentApplication(input);
      if (currentRequest !== requestId.current) return;
      setApplication(result);
      setLoading(false);
      await loadFileHistory(result.applicationNumberText, currentRequest);
    } catch (cause) {
      if (currentRequest !== requestId.current) return;
      setError(cause instanceof Error ? cause.message : "Unable to load this application.");
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  };
  useEffect(() => {
    if (externalSearch) void search(externalSearch);
    // Each placed panel owns its application result and lookup lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSearch]);
  return (
    <Stack p="md" gap="sm" h="100%" miw={0} style={{ overflow: "auto" }}>
      {loading && <Loader size="sm" />}
      {error && <Alert color="red">{error}</Alert>}
      {application && (
        <>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <div style={{ padding: "8px 0 3px" }}>
              <Text size="xs" c="dimmed">
                US {application.applicationNumberText}
              </Text>
              <Text fw={600} size="lg" style={{ marginTop: 4 }}>
                {application.applicationMetaData?.inventionTitle || "Untitled application"}
              </Text>
            </div>
            <Badge variant="light" color="teal" mt={7}>
              USPTO record
            </Badge>
          </Group>
          <Metadata data={application} />
          <Stack gap="xs">
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              File history
            </Text>
            <FileHistory
              applicationId={application.applicationNumberText}
              events={fileHistory}
              loading={fileHistoryLoading}
              error={fileHistoryError}
              onRetry={() =>
                void loadFileHistory(application.applicationNumberText, requestId.current)
              }
            />
          </Stack>
        </>
      )}
      {!application && !loading && !error && (
        <Alert color="gray">Open an application from Global Search to see its USPTO record.</Alert>
      )}
    </Stack>
  );
}
