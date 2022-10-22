import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import ChallengeDiscoverDetailInfoScreen from '../screens/challenge/info.discover.screen'
import ChallengeListWalkScreen from '../screens/challenge/list.walk.screen'
import ChallengeListMapDiscoverScreen from '../screens/challenge/listmap.discover.screen'
import ChallengeSelectScreen from '../screens/challenge/select.screen'
import ChallengeWalkDetailInfoScreen from '../screens/challenge/info.walk.screen'

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
        name="ChallengeWalkDetailInfo"
        component={ChallengeWalkDetailInfoScreen}
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
        name="ChallengeDiscoverDetailInfo"
        component={ChallengeDiscoverDetailInfoScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default ChallengeStackNavigation