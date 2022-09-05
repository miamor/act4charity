import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

import { useGlobals } from '../contexts/global'
import { useIsDark } from '../hooks/use-theme'

import ProfileScreen from '../screens/main/profile.screen'
import ChallengeStackNavigation from './challenge-stack'
// import DataDetailScreen from '../screens/main/data.detail'
// import AstrologerDetailScreen from '../screens/main/astrologer-detail.screen'
// import DonateScreen from '../screens/main/donate.screen'

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

      tabBarOptions={{
        style: {
          // backgroundColor: '#00000010',
          height: 56,
          paddingTop: 3,
          paddingBottom: 3,
        }
      }}

      // screenOptions={({ route }) => ({
      //   headerShown: false,
      //   tabBarStyle: {
      //     height: 90,
      //     paddingHorizontal: 5,
      //     paddingTop: 0,
      //     // backgroundColor: 'rgba(34,36,40,1)',
      //     position: 'absolute',
      //     borderTopWidth: 0,
      //   },
      // })}
      >
        {/* <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: (props) => (
              <BarIcon {...props} name="telescope" />
              // <BarIcon {...props} name="theme-light-dark" />
            ),
            tabBarLabel: (props) => (
              <BarLabel {...props}>Home</BarLabel>
            ),
            title: 'Home',
          }}
        /> */}
        <Tab.Screen
          name="Challenges"
          component={ChallengeStackNavigation}
          options={{
            tabBarIcon: (props) => (
              // <BarIcon {...props} name="book-open-page-variant" />
              <BarIcon {...props} name="theme-light-dark" />
            ),
            tabBarLabel: (props) => (
              <BarLabel {...props}>Challenges</BarLabel>
            ),
            title: 'Challenges',
          }}
        />
        {/* <Tab.Screen
          name="Astrologists"
          component={ChatStackNavigation}
          options={{
            tabBarIcon: (props) => (
              <BarIcon {...props} name="chat" />
            ),
            tabBarLabel: (props) => (
              <BarLabel {...props}>Chat</BarLabel>
            ),
            title: 'Chat',
          }}
        /> */}
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

        <Sta.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            cardStyle: {
              backgroundColor: '#000',
              // marginTop: 50,
              // borderTopLeftRadius: 30,
              // borderTopRightRadius: 30,
            },
          }}
        />
        <Sta.Screen
          name="ChallengeDetail"
          component={ChallengeDetailScreen}
          options={{
            cardStyle: {
              backgroundColor: '#000',
              // marginTop: 50,
              // borderTopLeftRadius: 30,
              // borderTopRightRadius: 30,
            },
          }}
        />

        {/* <Sta.Screen
          name="SponsorDetail"
          component={SponsorDetailScreen}
          options={{
            cardStyle: {
              backgroundColor: '#000',
              // marginTop: 50,
              // borderTopLeftRadius: 30,
              // borderTopRightRadius: 30,
            },
          }}
        />

        <Sta.Screen
          name="CharityDetail"
          component={CharityDetailScreen}
          options={{
            cardStyle: {
              backgroundColor: '#000',
              // marginTop: 50,
              // borderTopLeftRadius: 30,
              // borderTopRightRadius: 30,
            },
          }}
        /> */}

      </Sta.Navigator>

    </>
  )
}

export default MainStackNavigation
