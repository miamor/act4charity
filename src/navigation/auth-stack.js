import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import AuthScreen from '../screens/auth/auth.screen'
import OnboardingScreen from '../screens/auth/onboarding.screen'
import SignupScreen from '../screens/auth/signup.screen'
import SigninScreen from '../screens/auth/signin.screen'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function AuthStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Onboarding" options={{
      headerShown: false
    }}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false, gesturesEnabled: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="Signin"
        component={SigninScreen}
        options={{headerShown: false, gestureEnabled: false}}
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
