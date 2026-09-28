import { Box, Stack, Text, ThemeIcon } from "@mantine/core";

export function WelcomePanel() {
  return (
    <Box h="100%" miw={0} mih={320} display="grid" style={{ placeItems: "center" }} bg="body">
      <Stack align="center" gap="sm" style={{ transform: "translateY(-15px)" }}>
        <ThemeIcon size={48} radius="md" color="indigo" variant="filled" fz={22} fw={700}>
          F
        </ThemeIcon>
        <Text
          size="xs"
          fw={600}
          c="dimmed"
          tt="uppercase"
          style={{ fontSize: 9, letterSpacing: 1.2 }}>
          Patent workspace
        </Text>
        <Text size="2rem" fw={600} lts={-1} lh={1.2}>
          Welcome.
        </Text>
        <Text size="sm" c="dimmed">
          Use the search field in the upper left to open an application.
        </Text>
      </Stack>
    </Box>
  );
}
