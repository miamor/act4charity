import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import AuthScreen from '../screens/auth/auth.screen'
import LoginScreen from '../screens/auth/login.screen'
import RegisterScreen from '../screens/auth/register.screen'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function AuthStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Login" headerMode="screen">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default AuthStackNavigation
