import { NativeBaseProvider } from 'native-base'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'react-redux'
import { useState, useEffect } from 'react'

import { theme } from './theme'
import store from './store'
import AppNavigator from './navigation/AppNavigation'
import { connectToProvider } from '../blockchain/provider'
import { setUserDetails, setToken, setIsConnected } from '../features/essentials/essentialSlice'

export default function App() {
  // Start Provider
  useEffect(() => {
    async function initProvider() {
      try {
        await connectToProvider()
        store.dispatch(setIsConnected(true))
      } catch (error) {
        console.log('Unable to connect to provider', error)
        store.dispatch(setIsConnected(false))
      }
    }
    initProvider()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <NativeBaseProvider theme={theme}>
      <Provider store={store}>
        <StatusBar style="auto" />
        <AppNavigator />
      </Provider>
    </NativeBaseProvider>
  )
}
