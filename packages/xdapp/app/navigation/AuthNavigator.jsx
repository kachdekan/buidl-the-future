import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//Screens
import { WelcomeScreen, DummyScreen, LoginScreen, LoaderScreen } from 'xdapp/features/essentials'
import { ImportWalletScreen } from 'xdapp/features/wallet'
import { setLoggedIn } from 'xdapp/features/essentials/essentialSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

const AuthStack = createNativeStackNavigator()

export default function AuthNavigator() {
  const dispatch = useDispatch()
  const address = useSelector((s) => s.wallet.walletInfo.address)
  let hasAccount = false
  useEffect(() => {
    if (address) {
      dispatch(setLoggedIn(true))
      hasAccount = true
    } else {
      hasAccount = false
    }
  }, [address])
  return (
    <AuthStack.Navigator initialRouteName="Welcome">
      {hasAccount ? (
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <AuthStack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
      )}
      <AuthStack.Group
        screenOptions={{ presentation: 'modal', headerStyle: { backgroundColor: '#FFFAF5' } }}
      >
        <AuthStack.Screen name="DummyModal" component={DummyScreen} />
        <AuthStack.Screen name="Loader" component={LoaderScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="importWallet" component={ImportWalletScreen} />
      </AuthStack.Group>
    </AuthStack.Navigator>
  )
}
