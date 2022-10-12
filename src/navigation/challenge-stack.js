import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ChallengeDiscoveryDetailInfoScreen from '../screens/challenge/d.detail.info'
import ChallengeDiscoveryDetailMapScreen from '../screens/challenge/d.detail.map'
import ChallengeListMapScreen from '../screens/challenge/map'
// import ChallengeListScreen from '../screens/challenge/list.screen'

import WTeamCreation1 from '../screens/challenge/WTeamCreation1'
import WTeamCreation2 from '../screens/challenge/WTeamCreation2'
import WTeamCreation3 from '../screens/challenge/WTeamCreation3'

const Stack = createStackNavigator()

/**
 * @returns {*}
 * @constructor
 */
function ChallengeStackNavigation() {
  return (
<<<<<<< Updated upstream
    <Stack.Navigator initialRouteName="ChallengeListMap" headerMode="screen">
      {/* <Stack.Screen
        name="Challenge"
=======
    <Stack.Navigator initialRouteName="WTeamCreation1" screenOptions={{
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
        name="WTeamCreation1"
        component={WTeamCreation1}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="WTeamCreation2"
        component={WTeamCreation2}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="WTeamCreation3"
        component={WTeamCreation3}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ChallengeList"
>>>>>>> Stashed changes
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