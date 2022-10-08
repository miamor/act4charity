import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import AuthScreen from '../screens/auth/auth.screen';
import LoginScreen from '../screens/auth/login.screen';
import RegisterScreen from '../screens/auth/register.screen';
import SplashScreen from '../screens/auth/splash.screen';
import OnboardingScreen from '../screens/auth/onboarding.screen';
import SignupScreen from '../screens/auth/signup.screen';
import SigninScreen from '../screens/auth/signin.screen';
import InterestScreen from '../screens/auth/interest.screen';
import PersonalInterestScreen from '../screens/auth/personalinterest.screen';

const Stack = createStackNavigator();

/**
 * @returns {*}
 * @constructor
 */
function AuthStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Splash" headerMode="screen">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false, gesturesEnabled: false}}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{headerShown: false, gesturesEnabled: false}}
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
        name="Interest"
        component={InterestScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="PersonalInterest"
        component={PersonalInterestScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      {/* <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{headerShown: false}}
      /> */}
    </Stack.Navigator>
  );
}

export default AuthStackNavigation;
