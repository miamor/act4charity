import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ChallengeListScreen from '../screens/main/challenge/list.screen'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function ChallengeStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="MyAstro" headerMode="screen">
      <Stack.Screen
        name="Challenge"
        component={ChallengeListScreen}
        options={{
          // headerTitle: 'All the challenges',
          // headerStyle: { backgroundColor: 'transparent' },
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default ChallengeStackNavigation