import { View, StatusBar } from 'react-native';
import { useFonts, Roboto_700Bold, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Center, GluestackUIProvider, Text } from '@gluestack-ui/themed';
import { config } from './config/gluestack-ui.config';

export default function App() {
  // Hooks
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular });

  // Renders
  return (
    <GluestackUIProvider config={config}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {fontsLoaded ? (
          <Center flex={1} bg="$gray700">
            <Text color='$gray100'>Home</Text>
          </Center>
        ) : (
          <View />
        )
      }
    </GluestackUIProvider>
  );
}
