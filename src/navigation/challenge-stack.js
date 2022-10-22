import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import ChallengeListWalkScreen from '../screens/challenge/list.walk.screen'
import ChallengeListMapDiscoverScreen from '../screens/challenge/listmap.discover.screen'
import ChallengeSelectScreen from '../screens/challenge/select.screen'
import ChallengeDetailInfoScreen from '../screens/challenge/detail.screen'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function ChallengeStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="ChallengeSelect" options={{ 
      headerShown: false
    }}>

      <Stack.Screen
        name="ChallengeSelect"
        component={ChallengeSelectScreen}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ChallengeListWalk"
        component={ChallengeListWalkScreen}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ChallengeListMapDiscover"
        component={ChallengeListMapDiscoverScreen}
        options={{
          headerShown: false
        }}
      />
      
      <Stack.Screen
        name="ChallengeDetailInfo"
        component={ChallengeDetailInfoScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default ChallengeStackNavigation