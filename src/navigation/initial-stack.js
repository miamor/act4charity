import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import NameScreen from '../screens/initials/name.screen'
import InterestsInitialScreen from '../screens/initials/interests.screen'
// import LocationScreen from '../screens/initials/location.screen'
import SexScreen from '../screens/initials/sex.screen'
import LoadingScreen from '../screens/initials/loading.screen'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function InitialStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Name" options={{ 
      headerShown: false
    }}>
      <Stack.Screen
        name="Name"
        component={NameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sex"
        component={SexScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InterestCategory"
        component={InterestsInitialScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default InitialStackNavigation
