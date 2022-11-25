import React from 'react'
import { Box, Text, Avatar, Pressable, HStack } from 'native-base'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Icon from 'react-native-remix-icon' //Fix/Add types

//Screens
import { HomeScreen, DummyScreen } from 'xdapp/features/essentials'
import { AccountScreen } from 'xdapp/features/account'
import { SpacesHomeScreen } from 'xdapp/features/spaces'
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
        <MainStack.Screen name="DummyModal" component={DummyScreen} />
      </MainStack.Group>
    </MainStack.Navigator>
  )
}

//creating a bottom tabs navigator
const BottomTab = createBottomTabNavigator()

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF7ED' },
        tabBarStyle: { height: 60, backgroundColor: '#FFF7ED' },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={() => ({
          title: 'Home',
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'home-3-fill' : 'home-3-line'}
              bgc={focused ? 'primary.200' : '#FFF7ED'}
              color="#292524"
            />
          ),
          tabBarLabel: () => (
            <Text _light={{ color: 'warmGray.800' }} fontSize="xs" mb="0.5">
              Home
            </Text>
          ),
          headerLeft: () => <AccPressable />,
          headerRight: () => <HeaderRightIcons />,
        })}
      />
      <BottomTab.Screen
        name="Spaces"
        component={SpacesHomeScreen}
        options={() => ({
          title: 'Spaces',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'safe-2-fill' : 'safe-2-line'}
              bgc={focused ? 'primary.200' : '#FFF7ED'}
              color="#292524"
            />
          ),
          tabBarLabel: () => (
            <Text _light={{ color: 'warmGray.800' }} fontSize="xs" mb="0.5">
              Spaces
            </Text>
          ),
          headerLeft: () => <AccPressable />,
          headerRight: () => <HeaderRightIcons />,
        })}
      />
      <BottomTab.Screen
        name="Account"
        component={AccountScreen}
        options={() => ({
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'user-3-fill' : 'user-3-line'}
              bgc={focused ? 'primary.200' : '#FFF7ED'}
              color="#292524"
            />
          ),
          tabBarLabel: () => (
            <Text _light={{ color: 'warmGray.800' }} fontSize="xs" mb="0.5">
              Account
            </Text>
          ),
          headerLeft: () => <AccPressable />,
          headerRight: () => <HeaderRightIcons />,
        })}
      />
    </BottomTab.Navigator>
  )
}

function TabBarIcon(props) {
  return (
    <Box bg={props.bgc} rounded="2xl" px="5" py="1" mt="1">
      <Icon size={24} {...props} />
    </Box>
  )
}

function AccPressable() {
  //const { initials } = useSelector((s) => s.essential.userDetails)
  const initials = 'AK'
  const navigation = useNavigation()
  return (
    // fix avatar text color to primary.700
    <Pressable
      onPress={() => navigation.navigate('Account')}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Avatar bg="primary.300" ml="2" size="sm" _text={{ color: 'warmGray.800' }}>
        {initials}
      </Avatar>
    </Pressable>
  )
}

function HeaderRightIcons() {
  const navigation = useNavigation()
  return (
    <HStack space="5" mr="3">
      <Pressable
        onPress={() => navigation.navigate('DummyModal')}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Icon size={24} name="donut-chart-fill" />
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('DummyModal')}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Icon size={24} name="star-fill" />
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('DummyModal')}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Icon size={24} name="notification-4-fill" />
      </Pressable>
    </HStack>
  )
}
