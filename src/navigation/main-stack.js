import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View, TouchableOpacity, Image, PermissionsAndroid } from 'react-native'
import { useTheme } from 'react-native-paper'
import { Text } from '../components/paper/typos'

import { useGlobals } from '../contexts/global'
import { useIsDark } from '../hooks/use-theme'

import ChallengeStackNavigation from './challenge-stack'
import RewardStackNavigation from './reward-stack'
// import ChallengeBottomSheet from '../components/challenge.bottom'
import DashboardStackNavigation from './dashboard-stack'
import ProfileStackNavigation from './profile-stack'

import TargetScreenModal from '../screens/_modal_screens/target.screen'
import ChallengeStartScreen from '../screens/_modal_screens/challenge.start.screen'
import ChallengeCompletedScreen from '../screens/_modal_screens/challenge.completed.screen'
import UserWallScreen from '../screens/user-wall.screen'

// import * as Location from 'expo-location'
// import { Pedometer } from 'expo-sensors'
// import { SOCKET_URL } from '../services/APIServices'
// import io from 'socket.io-client'



const MyTabBarEle = ({ props }) => {
  const { state, route, index, descriptors, navigation } = props

  const { options } = descriptors[route.key]
  const label =
    options.tabBarIcon !== undefined ? options.tabBarIcon
      : options.tabBarLabel !== undefined ? options.tabBarLabel
        : options.title !== undefined ? options.title
          : route.name

  const isFocused = state.index === index

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    })

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({ name: route.name, merge: true })
    }
  }

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    })
  }


  return (<TouchableOpacity
    accessibilityRole="button"
    accessibilityState={isFocused ? { selected: true } : {}}
    accessibilityLabel={options.tabBarAccessibilityLabel}
    testID={options.tabBarTestID}
    onPress={onPress}
    onLongPress={onLongPress}
    style={{ flex: 1, paddingBottom: 3, justifyContent: 'center', alignItems: 'center', height: 65 }}
  >
    {options.tabBarIcon !== undefined ? (<MaterialCommunityIcons size={26} name={options.tabBarIcon} color={isFocused ? '#673ab7' : '#a2a2a2'} />)
      : (<Text style={{ color: isFocused ? '#673ab7' : '#222', backgroundColor: '#0f0' }}>
        {label}
      </Text>)}
  </TouchableOpacity>)
}

const MyTabBar = ({ state, descriptors, navigation }) => {
  return (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      {state.routes.map((route, index) => (<MyTabBarEle key={`tabbarele-` + index} props={{ state, route, index, descriptors, navigation }} />))}
    </View>
  </View>)
}



const Sta = createStackNavigator()

const Tab = createBottomTabNavigator()

function BottomBarNavigation() {
  const [{ loggedUser }] = useGlobals()
  const { colors } = useTheme()
  const _barStyle = useIsDark() ? 'light-content' : 'dark-content'

  return (<>
    <StatusBar
      barStyle={_barStyle}
      backgroundColor={colors.background}
      animated
    />

    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
      tabBar={props => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="DashboardStack"
        component={DashboardStackNavigation}
        options={{
          tabBarIcon: 'home',
          title: 'Challenges',
        }}
      />

      <Tab.Screen
        name="ChallengeStack"
        component={ChallengeStackNavigation}
        options={{
          tabBarIcon: 'map-legend',
          title: 'Challenges',
        }}
      />

      <Tab.Screen
        name="RewardsStack"
        component={RewardStackNavigation}
        options={{
          tabBarIcon: 'seal',
          title: 'Rewards',
        }}
      />

      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigation}
        options={{
          tabBarIcon: 'account',
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  </>)
}



function MainStackNavigation() {
  return (
    <>
      <Sta.Navigator screenOptions={{
        headerShown: false,
        cardStyle: {
          // backgroundColor: '#00f',
        },
        mode: 'modal'
      }}>
        <Sta.Screen
          name="Home"
          component={BottomBarNavigation}
          options={{
            cardStyle: {
              // backgroundColor: '#000',
            },
          }}
        />

        <Sta.Screen
          name="_Target"
          component={TargetScreenModal}
          options={{
          }}
        />

        <Sta.Screen
          name="_ChallengeDetailCompleted"
          component={ChallengeCompletedScreen}
          options={{
          }}
        />

        <Sta.Screen
          name="_ChallengeDetailStart"
          component={ChallengeStartScreen}
          options={{
          }}
        />

        <Sta.Screen
          name="_UserWall"
          component={UserWallScreen}
          options={{
          }}
        />
      </Sta.Navigator>

    </>
  )
}

export default MainStackNavigation
