import { ActionIcon, Group, Text, TextInput, Tooltip } from "@mantine/core";
import { IconInfoCircle, IconSearch } from "@tabler/icons-react";
import type { Ref } from "react";
import { useState } from "react";
import {
  parsePatentSearch,
  patentSearchLabel,
  type PatentSearchResult,
} from "../../domain/patentSearch";
import { HelpHoverCard } from "../../shared/HelpHoverCard";

export function ApplicationIdTextInput({
  onSearch,
  loading = false,
  error,
  initialValue = "",
  autoFocus = false,
  inputRef,
  placeholder = "Enter an application, patent, or publication number",
}: {
  onSearch: (result: PatentSearchResult) => void;
  loading?: boolean;
  error?: string;
  initialValue?: string;
  autoFocus?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  placeholder?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const parsed = parsePatentSearch(value);

  const submit = () => {
    if (parsed && !loading) onSearch(parsed);
  };
  return (
    <TextInput
      ref={inputRef}
      aria-label="Search USPTO applications"
      autoFocus={autoFocus}
      label={
        <Group gap={4} wrap="nowrap">
          <Text size="xs">Search by: {patentSearchLabel(parsed?.key)}</Text>

          <HelpHoverCard>
            <Text size="sm" w={300}>
              This component will attempt to match the search value. Use standard EpoId format to
              force search US patents or publications by using a US prefix before the document
              identifier.
            </Text>
          </HelpHoverCard>
        </Group>
      }
      placeholder={placeholder}
      value={value}
      onChange={event => setValue(event.currentTarget.value)}
      onKeyDown={event => {
        if (event.key === "Enter") {
          event.preventDefault();
          submit();
        }
      }}
      error={error}
      size="sm"
      rightSectionWidth={34}
      rightSection={
        <ActionIcon
          aria-label="Search"
          variant="subtle"
          size="sm"
          loading={loading}
          disabled={!parsed || loading}
          onClick={submit}>
          <IconSearch size={15} />
        </ActionIcon>
      }
    />
  );
}
