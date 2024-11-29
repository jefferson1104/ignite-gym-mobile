import { useState } from "react";
import { SectionList } from "react-native";
import { VStack, Heading, Text } from "@gluestack-ui/themed";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";

export function History() {
  // States
  const [exercises, setExercises] = useState([
    { title: "28.11.24", data: ["Bent-over row", "Front Pulldown"] },
    { title: "27.11.24", data: ["Single-leg row", "Deadlift"] },
  ]);

  // Renders
  return (
    <VStack flex={1}>
      <ScreenHeader title="Exercises History" />

      <SectionList
        sections={exercises}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="$gray200"
            fontSize="$md"
            mt="$10"
            mb="$3"
            fontFamily="$heading"
          >
            {section.title}
          </Heading>
        )}
        ListEmptyComponent={() => (
          <Text color="$gray100" textAlign="center">
            There are no recorded exercises yet. {"\n"}
            let's do exercises today?
          </Text>
        )}
      />
    </VStack>
  );
}
