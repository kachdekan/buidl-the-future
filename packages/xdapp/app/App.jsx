import { NativeBaseProvider } from 'native-base'
import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'native-base'

import { theme } from './theme'

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <View flex={1} backgroundColor="primary.50" alignItems="center" justifyContent="center">
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </NativeBaseProvider>
  )
}
