import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import DashboardHomeScreen from '../screens/DashboardHomeScreen'
import TargetScreenModal from '../screens/TargetScreenModal'

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
      <Stack.Screen
        name="DashboardTarget"
        component={TargetScreenModal}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default DashboardStackNavigation