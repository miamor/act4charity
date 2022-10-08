import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ChallengeDiscoveryDetailInfoScreen from '../screens/challenge/d.detail.info'
import ChallengeDiscoveryDetailMapScreen from '../screens/challenge/d.detail.map'
import ChallengeListMapScreen from '../screens/challenge/map'
// import ChallengeListScreen from '../screens/challenge/list.screen'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function ChallengeStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="ChallengeListMap" headerMode="screen">
      {/* <Stack.Screen
        name="Challenge"
        component={ChallengeListScreen}
        options={{
          // headerTitle: 'All the challenges',
          // headerStyle: { backgroundColor: 'transparent' },
          headerShown: false
        }}
      /> */}
      <Stack.Screen
        name="ChallengeListMap"
        component={ChallengeListMapScreen}
        options={{
          // headerTitle: 'All the challenges',
          // headerStyle: { backgroundColor: 'transparent' },
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ChallengeDiscoveryDetailMap"
        component={ChallengeDiscoveryDetailMapScreen}
        options={{
          // headerTitle: 'All the challenges',
          // headerStyle: { backgroundColor: 'transparent' },
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ChallengeDiscoveryDetailInfo"
        component={ChallengeDiscoveryDetailInfoScreen}
        options={{
          // headerTitle: 'All the challenges',
          // headerStyle: { backgroundColor: 'transparent' },
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default ChallengeStackNavigation