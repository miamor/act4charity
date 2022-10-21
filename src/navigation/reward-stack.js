import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import RewardScreen from '../screens/reward/reward.screen'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function RewardStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Reward" options={{ 
      headerShown: false
    }}>
      <Stack.Screen
        name="Reward"
        component={RewardScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default RewardStackNavigation