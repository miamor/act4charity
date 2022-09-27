import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

import { useGlobals } from '../contexts/global'
import { useIsDark } from '../hooks/use-theme'

import ChallengeStackNavigation from './challenge-stack'
import ChallengeListMapScreen from '../screens/challenge/map'
import RewardStackNavigation from './reward-stack'

const BarIcon = ({ color, size, name }) => {
  return (
    <MaterialCommunityIcons
      color={color}
      size={size}
      name={name}
      style={{ marginTop: 4 }}
    />
  )
}

const BarLabel = ({ color, children }) => {
  return (
    <Text
      style={{
        fontSize: 10,
        lineHeight: 20,
        textAlign: 'center',
        color,
      }}
    >
      {children}
    </Text>
  )
}

const Sta = createStackNavigator()

const Tab = createBottomTabNavigator()

function BottomBarNavigation() {
  const [{ session }] = useGlobals()
  const { colors } = useTheme()
  const _barStyle = useIsDark() ? 'light-content' : 'dark-content'

  return (
    <>
      <StatusBar
        barStyle={_barStyle}
        backgroundColor={colors.background}
        animated
      />
      <Tab.Navigator
      // initialRouteName="HomeScreen"
      // activeColor="red"
      // inactiveColor="white"
      // activeBackgroundColor="green"
      // inactiveBackgroundColor="green"
      // style={{ backgroundColor: 'green' }}

      screenOptions={({ route }) => ({
        headerShown: false,
        // tabBarStyle: {
        //   height: 90,
        //   paddingHorizontal: 5,
        //   paddingTop: 0,
        //   // backgroundColor: 'rgba(34,36,40,1)',
        //   position: 'absolute',
        //   borderTopWidth: 0,
        // },
      })}
      >
        <Tab.Screen
          name="Challenges"
          component={ChallengeStackNavigation}
          options={{
            tabBarIcon: (props) => (
              <BarIcon {...props} name="book-open-page-variant" />
              // <BarIcon {...props} name="theme-light-dark" />
            ),
            tabBarLabel: (props) => (
              <BarLabel {...props}>Challenges</BarLabel>
            ),
            title: 'Challenges',
          }}
        />
        
        <Tab.Screen
          name="Rewards"
          component={RewardStackNavigation}
          options={{
            tabBarIcon: (props) => (
              // <BarIcon {...props} name="book-open-page-variant" />
              <BarIcon {...props} name="theme-light-dark" />
            ),
            tabBarLabel: (props) => (
              <BarLabel {...props}>Reward</BarLabel>
            ),
            title: 'Rewards',
          }}
        />
      </Tab.Navigator>
    </>
  )
}

function MainStackNavigation() {
  return (
    <>
      <Sta.Navigator screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: '#fff',
        },
      }} mode="modal">
        <Sta.Screen
          name="Home"
          component={BottomBarNavigation}
          options={{
            cardStyle: {
              backgroundColor: '#000',
            },
          }}
        />

        {/* <Sta.Screen
          name="DiscoveryDestSelection"
          component={ChallengeListMapScreen}
          // options={{
          //   cardStyle: {
          //     backgroundColor: '#000',
          //     // marginTop: 50,
          //     // borderTopLeftRadius: 30,
          //     // borderTopRightRadius: 30,
          //   },
          // }}
        /> */}

      </Sta.Navigator>

    </>
  )
}

export default MainStackNavigation
