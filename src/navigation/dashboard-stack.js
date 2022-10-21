import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import DashboardHomeScreen from '../screens/dashboard/dashboard.screen'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function DashboardStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="DashboardHome" options={{ 
      headerShown: false
    }}>
      <Stack.Screen
        name="DashboardHome"
        component={DashboardHomeScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default DashboardStackNavigation