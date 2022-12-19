import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BottomTabNavigator from './BottomTabNavigator'

//Screens

import { DummyScreen } from 'xdapp/features/essentials'
import { AccountScreen } from 'xdapp/features/account'
import {
  SpacesTabsNavigator,
  CreateSpaceScreen,
  SelectContactsScreen,
  SetPersonalGoalScreen,
  SetRoscaGoalScreen,
  RoscaHomeScreen,
} from 'xdapp/features/spaces'
import { useSelector } from 'react-redux'

const MainStack = createNativeStackNavigator()

export default function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <MainStack.Group
        screenOptions={{ presentation: 'modal', headerStyle: { backgroundColor: '#FFFAF5' } }}
      >
        <MainStack.Screen name="Account" component={AccountScreen} />
        <MainStack.Screen name="MySpaces" component={SpacesTabsNavigator} />
        <MainStack.Screen name="createSpace" component={CreateSpaceScreen} />
        <MainStack.Screen name="selectContacts" component={SelectContactsScreen} />
        <MainStack.Screen name="setPersonalGoal" component={SetPersonalGoalScreen} />
        <MainStack.Screen name="setRoscaGoal" component={SetRoscaGoalScreen} />
        <MainStack.Screen name="RoscaHome" component={RoscaHomeScreen} />
        <MainStack.Screen name="DummyModal" component={DummyScreen} />
      </MainStack.Group>
    </MainStack.Navigator>
  )
}
