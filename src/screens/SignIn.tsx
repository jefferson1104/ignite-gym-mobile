import { VStack, Image, Center, Text, Heading, ScrollView } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import BackgroundImage from '@assets/background.png';
import Logo from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignIn() {
  // Hooks
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  // Methods
  function handleSignUp() {
    navigation.navigate('SignUp');
  }

  // Renders
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          source={BackgroundImage}
          defaultSource={BackgroundImage}
          alt='People training in the gym'
          w="$full"
          h={624}
          position='absolute'
        />
        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />
            <Text color="$gray100" fontSize="$sm">
              Train your mind and body
            </Text>
          </Center>
          <Center gap="$2">
            <Heading color="$gray100">
              Access your account
            </Heading>
            <Input
              placeholder='E-mail'
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <Input
              placeholder='Password'
              secureTextEntry
            />
            <Button title='Sign In' />
          </Center>
          <Center flex={1} justifyContent='flex-end' mt="$4">
            <Text color="$gray100" fontSize="$sm" fontFamily='$body' mb="$3">
              Are you not registered?
            </Text>
            <Button
              title='Sign Up'
              variant='outline'
              onPress={handleSignUp}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
