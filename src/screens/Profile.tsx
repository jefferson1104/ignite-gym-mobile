import { ScrollView, TouchableOpacity } from "react-native";
import { Center, Heading, Text, VStack } from "@gluestack-ui/themed";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function Profile() {
  // Renders
  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: "https://github.com/jefferson1104.png" }}
            alt="User photo"
            size="xl"
          />
          <TouchableOpacity>
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
