import { useState, useCallback } from "react";
import { SectionList } from "react-native";
import { VStack, Heading, Text, useToast } from "@gluestack-ui/themed";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { api } from "@services/api";

import { AppError } from "@utils/app-error";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

import { Loading } from "@components/Loading";
import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { ToastMessage } from "@components/ToastMessage";

export function History() {
  // Hooks
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  // Methods
  async function fetchExercisesHistory() {
    try {
      setIsLoading(true);

      const response = await api.get("/history");

      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "It was not possible to load the exercsies history";

      const toastId = "load-exercises-history-error";

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

      console.error("Error to load exercises history: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Effects
  useFocusEffect(
    useCallback(() => {
      fetchExercisesHistory();
    }, [])
  );

  // Renders
  return (
    <VStack flex={1}>
      <ScreenHeader title="Exercises History" />

      <SectionList
        sections={exercises}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        renderItem={({ item }) => <HistoryCard history={item} />}
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
