import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import RewardScreen from '../screens/RewardScreen.js'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function RewardStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="RewardScreen" headerMode="screen">
      <Stack.Screen
        name="RewardScreen"
        component={RewardScreen}
        options={{
          // headerTitle: 'All the challenges',
          // headerStyle: { backgroundColor: 'transparent' },
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default RewardStackNavigation