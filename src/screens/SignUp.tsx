import { VStack, Image, Center, Text, Heading, ScrollView } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import BackgroundImage from '@assets/background.png';
import Logo from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignUp() {
  // Hooks
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  // Methods
  function handleGoBack() {
    navigation.navigate('SignIn');
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
          <Center gap="$2" flex={1}>
            <Heading color="$gray100">
              Create your account
            </Heading>
            <Input placeholder='Name' />
            <Input
              placeholder='E-mail'
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <Input
              placeholder='Password'
              secureTextEntry
            />
            <Button title='Create' />
          </Center>
          <Button
            title='Back to Sign In'
            variant="outline"
            mt="$12"
            onPress={handleGoBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
