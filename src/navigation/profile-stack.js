import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ProfileScreen from '../screens/ProfileScreen'
import PersonalInformationModal from '../screens/PersonalInformationModal'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function ProfileStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ProfilePersonalInfo"
        component={PersonalInformationModal}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default ProfileStackNavigation