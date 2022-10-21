import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ProfileScreen from '../screens/profile/profile.screen'
import PersonalInformationModal from '../screens/profile/personal-information.modal'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function ProfileStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Profile" options={{ 
      headerShown: false
    }}>
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