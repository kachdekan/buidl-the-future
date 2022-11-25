import { NativeBaseProvider } from 'native-base'
import { StatusBar } from 'expo-status-bar'
//import { Provider } from 'react-redux'

import { theme } from './theme'
import AppNavigator from './navigation/AppNavigation'

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar style="auto" />
      <AppNavigator />
    </NativeBaseProvider>
  )
}
