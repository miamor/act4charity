import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
<<<<<<< HEAD
import RewardScreen from '../screens/reward/reward.screen'
=======
import ChallengeListMapScreen from '../screens/challenge/map'
>>>>>>> 0451ae88464b168ba0cafb0e32a9c90b5a5c85cc

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function RewardStackNavigation() {
  return (
<<<<<<< HEAD
    <Stack.Navigator initialRouteName="Reward" screenOptions={{
      headerMode: 'screen'
    }}>
      <Stack.Screen
        name="Reward"
        component={RewardScreen}
        options={{
          headerShown: false
=======
    <Stack.Navigator initialRouteName="DiscoveryDestSelection" headerMode="screen">
      <Stack.Screen
        name="DiscoveryDestSelection"
        component={ChallengeListMapScreen}
        options={{
          // headerTitle: 'All the challenges',
          // headerStyle: { backgroundColor: 'transparent' },
          // headerShown: false
>>>>>>> 0451ae88464b168ba0cafb0e32a9c90b5a5c85cc
        }}
      />
    </Stack.Navigator>
  )
}

export default RewardStackNavigation