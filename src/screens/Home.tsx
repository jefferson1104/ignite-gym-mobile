import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Heading, HStack, VStack, Text, useToast } from "@gluestack-ui/themed";

import { api } from "@services/api";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { AppError } from "@utils/app-error";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";
import { ToastMessage } from "@components/ToastMessage";

export function Home() {
  // Hooks
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // States
  const [groupSelected, setGroupSelected] = useState("Back");
  const [exercises, setExercises] = useState([
    "Front pulldown",
    "Bent-over row",
    "Single-leg row",
    "Deadlift",
  ]);
  const [groups, setGroups] = useState<string[]>([]);

  // Methods
  function handleOpenExerciseDetails() {
    navigation.navigate("exercise");
  }

  async function fetchGroups() {
    try {
      const response = await api.get("/groups");

      if (response.data) {
        setGroups(response.data);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "It was not possible to load groups";

      const toastId = "load-groups-error";

      toast.show({
        placement: "top",
        render: () => (
          <ToastMessage
            id={toastId}
            title={title}
            action="error"
            onClose={() => toast.close(toastId)}
          />
        ),
      });

      console.error("Error to load groups: ", error);
    }
  }

  // Effects
  useEffect(() => {
    fetchGroups();
  }, []);

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
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
        />
      </VStack>
    </VStack>
  );
}
