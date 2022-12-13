import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ChallengesScreen from './ChallengesScreen'
import GroupsSpacesScreen from './GroupsSpacesScreen'
import PersonalSpacesScreen from './PersonalSpacesScreen'

const Tab = createMaterialTopTabNavigator()

function LoansTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Challenges" component={ChallengesScreen} />
      <Tab.Screen name="Groups" component={GroupsSpacesScreen} />
      <Tab.Screen name="Personal" component={PersonalSpacesScreen} />
    </Tab.Navigator>
  )
}

export default LoansTabNavigator
