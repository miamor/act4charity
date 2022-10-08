import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ChallengeListMapScreen from '../screens/challenge/map'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function RewardStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="DiscoveryDestSelection" headerMode="screen">
      <Stack.Screen
        name="DiscoveryDestSelection"
        component={ChallengeListMapScreen}
        options={{
          // headerTitle: 'All the challenges',
          // headerStyle: { backgroundColor: 'transparent' },
          // headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default RewardStackNavigation