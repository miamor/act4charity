import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ChallengeModeScreen from '../screens/challenge/select'

import ChallengeDiscoverDetailInfoScreen from '../screens/challenge/d.detail.info'
import ChallengeDiscoverDetailStartScreen from '../screens/challenge/d.detail.start'
import ChallengeDiscoverDetailStartTeamScreen from '../screens/challenge/d.detail.start.team'
// import ChallengeDiscoverDetailCompletedScreen from '../screens/challenge/d.detail.completed'
import ChallengeDetailCompletedScreen from '../screens/challenge/detail.completed'
import ChallengeListWalkScreen from '../screens/challenge/list.walk'
import ChallengeListMapDiscoverScreen from '../screens/challenge/listmap.discover'
import ChallengeSelectScreen from '../screens/challenge/select'
import TestSockScreen from '../screens/challenge/socket'
import ChallengeWalkDetailInfoScreen from '../screens/challenge/w.detail.info'
import ChallengeWalkDetailStartScreen from '../screens/challenge/w.detail.start'
import ChallengeWalkDetailStartTeamScreen from '../screens/challenge/w.detail.start.team'
// import WTeamCreation1 from '../screens/challenge/WTeamCreation1'
// import WTeamCreation2 from '../screens/challenge/WTeamCreation2'
// import WTeamCreation3 from '../screens/challenge/WTeamCreation3'

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
        name="ChallengeWalkDetailStart"
        component={ChallengeWalkDetailStartScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ChallengeWalkDetailStartTeam"
        component={ChallengeWalkDetailStartTeamScreen}
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
        name="ChallengeDiscoverDetailStart"
        component={ChallengeDiscoverDetailStartScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ChallengeDiscoverDetailStartTeam"
        component={ChallengeDiscoverDetailStartTeamScreen}
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
      <Stack.Screen
        name="ChallengeDetailCompleted"
        component={ChallengeDetailCompletedScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default ChallengeStackNavigation