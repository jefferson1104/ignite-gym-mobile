import { useState } from "react";
import { FlatList } from "react-native";
import { Heading, HStack, VStack, Text } from "@gluestack-ui/themed";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";

export function Home() {
  // States
  const [groupSelected, setGroupSelected] = useState("Back");
  const [exercises, setExercises] = useState([
    "Front pulldown",
    "Bent-over row",
    "Single-leg row",
    "Deadlift",
  ]);
  const [groups, setGroups] = useState([
    "Back",
    "Biceps",
    "Triceps",
    "Shoulder",
  ]);

  // Renders
  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
      />

      <VStack px="$8" flex={1}>
        <HStack justifyContent="space-between" alignItems="center" mb="$5">
          <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
            Exercises
          </Heading>
          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <ExerciseCard />}
        />
      </VStack>
    </VStack>
  );
}
