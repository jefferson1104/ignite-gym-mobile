import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Image,
  Box,
  useToast,
} from "@gluestack-ui/themed";

import { api } from "@services/api";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { ExerciseDTO } from "@dtos/ExerciseDTO";

import { AppError } from "@utils/app-error";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";

import { Button } from "@components/Button";
import { Loading } from "@components/Loading";
import { ToastMessage } from "@components/ToastMessage";

type RouteParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  // Hooks
  const toast = useToast();
  const route = useRoute();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

  // Constants
  const { exerciseId } = route.params as RouteParamsProps;

  // Methods
  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);

      if (response.data) {
        setExercise(response.data);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "It was not possible to load this exercise details";

      const toastId = "load-exercise-details-error";

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

      console.error("Error to load exercise details: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  //Effects
  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  // Renders
  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <VStack p="$8">
            <Box rounded="$lg" mb="$3" overflow="hidden">
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
                alt="Exercise"
                resizeMode="cover"
                rounded="$lg"
                w="$full"
                h="$80"
              />
            </Box>

            <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
              <HStack
                alignItems="center"
                justifyContent="space-around"
                mb="$6"
                mt="$5"
              >
                <HStack alignItems="center">
                  <SeriesSvg />
                  <Text color="$gray200" ml="$2">
                    {exercise.series} sets
                  </Text>
                </HStack>
                <HStack alignItems="center">
                  <RepetitionsSvg />
                  <Text color="$gray200" ml="$2">
                    {exercise.repetitions} reps
                  </Text>
                </HStack>
              </HStack>
              <Button title="Mark as done" />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
