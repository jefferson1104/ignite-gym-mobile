import { ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Image,
  Box,
} from "@gluestack-ui/themed";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { Button } from "@components/Button";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";

export function Exercise() {
  // Hooks
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // Methods
  function handleGoBack() {
    navigation.goBack();
  }

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
            Front Pulldown
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="capitalize">
              Back
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <VStack p="$8">
          <Image
            source={{
              uri: "https://static.wixstatic.com/media/2edbed_60c206e178ad4eb3801f4f47fc6523df~mv2.webp/v1/fill/w_350,h_375,al_c/2edbed_60c206e178ad4eb3801f4f47fc6523df~mv2.webp",
            }}
            alt="Exercise"
            mb="$3"
            resizeMode="cover"
            rounded="$lg"
            w="$full"
            h="$80"
          />

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
                  3 sets
                </Text>
              </HStack>
              <HStack alignItems="center">
                <RepetitionsSvg />
                <Text color="$gray200" ml="$2">
                  12 reps
                </Text>
              </HStack>
            </HStack>
            <Button title="Mark as done" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
