import { VStack } from "@gluestack-ui/themed";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";

export function History() {
  // Renders
  return (
    <VStack flex={1}>
      <ScreenHeader title="History" />
      <HistoryCard />
    </VStack>
  );
}
