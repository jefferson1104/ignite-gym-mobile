import { TouchableOpacity } from "react-native";
import { LogOut } from "lucide-react-native";
import { Heading, HStack, Text, VStack, Icon } from "@gluestack-ui/themed";

import { useAuth } from "@hooks/useAuth";

import defaultUserAvatar from "@assets/userPhotoDefault.png";

import { UserPhoto } from "@components/UserPhoto";

export function HomeHeader() {
  // Hooks
  const { user, signOut } = useAuth();

  // Renders
  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <UserPhoto
        source={user.avatar ? { uri: user.avatar } : defaultUserAvatar}
        alt="User photo"
        w="$16"
        h="$16"
      />

      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">
          Hello,
        </Text>
        <Heading color="$gray100" fontSize="$md">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon as={LogOut} color="$gray200" size="xl" />
      </TouchableOpacity>
    </HStack>
  );
}
