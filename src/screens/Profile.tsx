import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";

export function Profile() {
  // Hooks
  const toast = useToast();

  // States
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/jefferson1104.png"
  );

  // Methods
  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        base64: true,
      });

      if (photoSelected.canceled) return;

      const photoURI = photoSelected.assets[0].uri;

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number;
        };

        // image size max 5MB
        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Image too large"
                description="Please select an image smaller than 5MB."
                action="error"
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        setUserPhoto(photoURI);
      }
    } catch (error) {
      console.error("Change user photo error:", error);
    }
  }

  // Renders
  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto source={{ uri: userPhoto }} alt="User photo" size="xl" />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Change Photo
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Input placeholder="Name" bg="$gray600" />
            <Input value="jefferson@soaresdev.com" bg="$gray600" isReadOnly />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Change Password
          </Heading>

          <Center w="$full" gap="$4">
            <Input placeholder="Old password" bg="$gray600" secureTextEntry />
            <Input placeholder="New password" bg="$gray600" secureTextEntry />
            <Input
              placeholder="Confirm new password"
              bg="$gray600"
              secureTextEntry
            />

            <Button title="Update" />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
