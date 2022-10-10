import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import AuthScreen from '../screens/auth/auth.screen';
import LoginScreen from '../screens/auth/login.screen';
import SignupScreen from '../screens/auth/signup.screen';
import OnboardingScreen from '../screens/auth/onboarding.screen';
import InterestScreen from '../screens/auth/interest.screen';
import SplashScreen from '../screens/auth/splash.screen';

const Stack = createStackNavigator();

/**
 * @returns {*}
 * @constructor
 */
function AuthStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Onboarding" headerMode="screen">
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Interest"
        component={InterestScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default AuthStackNavigation;
