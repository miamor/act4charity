import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ChallengeDiscoveryDetailInfoScreen from '../screens/challenge/d.detail.info'
import ChallengeDiscoveryDetailMapScreen from '../screens/challenge/d.detail.map'
import ChallengeListScreen from '../screens/challenge/list'
import ChallengeListMapScreen from '../screens/challenge/map'
import ChallengeSelectScreen from '../screens/challenge/select'
import ChallengeWalkDetailInfoScreen from '../screens/challenge/w.detail.info'
import ChallengeWalkDetailStartScreen from '../screens/challenge/w.detail.start'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function ChallengeStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="ChallengeSelect" screenOptions={{
      headerMode: 'screen'
    }}>
      <Stack.Screen
        name="ChallengeSelect"
        component={ChallengeSelectScreen}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ChallengeList"
        component={ChallengeListScreen}
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
        name="ChallengeWalkDetailInfo"
        component={ChallengeWalkDetailInfoScreen}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ChallengeListMap"
        component={ChallengeListMapScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ChallengeDiscoveryDetailMap"
        component={ChallengeDiscoveryDetailMapScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ChallengeDiscoveryDetailInfo"
        component={ChallengeDiscoveryDetailInfoScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default ChallengeStackNavigation