import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Heading, HStack, VStack, Text, useToast } from "@gluestack-ui/themed";

import { api } from "@services/api";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { ExerciseDTO } from "@dtos/ExerciseDTO";

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
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState<string>("back");
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);

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

  async function fetchExercisesByGroup() {
    try {
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);

      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "It was not possible to load exercises";

      const toastId = "load-exercises-error";

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

      console.error("Error to load exercises: ", error);
    }
  }

  // Effects
  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected])
  );

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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} data={item} />
          )}
        />
      </VStack>
    </VStack>
  );
}
