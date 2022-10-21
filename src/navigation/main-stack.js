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
import ChallengeBottomSheet from '../components/challenge.bottom'
import DashboardStackNavigation from './dashboard-stack'
import ProfileStackNavigation from './profile-stack'

import ChallengeCompletedScreen from '../screens/_modal/challenge.completed'
// import ChallengeStartWalkScreen from '../screens/_modal/challenge.start.walk'
// import ChallengeStartDiscoverScreen from '../screens/_modal/challenge.start.discover'
// import ChallengeStartWalkTeamScreen from '../screens/_modal/challenge.start.walk.team'
// import ChallengeStartDiscoverTeamScreen from '../screens/_modal/challenge.start.discover.team'
import TargetScreenModal from '../screens/_modal/target.modal'


import * as Location from 'expo-location'
import { Pedometer } from 'expo-sensors'
import { SOCKET_URL } from '../services/APIServices'
import io from 'socket.io-client'
import ChallengeStartScreen from '../screens/_modal/challenge.start'



const BarIcon = ({ color, size, name }) => {
  return (<MaterialCommunityIcons
    color={color}
    size={size}
    name={name}
    style={{ marginTop: 4 }}
  />)
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
    {options.tabBarIcon !== undefined ? (<BarIcon size={26} name={options.tabBarIcon} color={isFocused ? '#673ab7' : '#a2a2a2'} />)
      : (<Text style={{ color: isFocused ? '#673ab7' : '#222', backgroundColor: '#0f0' }}>
        {label}
      </Text>)}
  </TouchableOpacity>)
}

const MyTabBar = ({ state, descriptors, navigation }) => {
  const [{ currentChallenge, showBottomBar }] = useGlobals()

  return (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
    {currentChallenge != null && showBottomBar === true && (<ChallengeBottomSheet />)}
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
        name="Dashboard"
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
          tabBarIcon: 'theme-light-dark',
          title: 'Challenges',
        }}
      />

      <Tab.Screen
        name="RewardsStack"
        component={RewardStackNavigation}
        options={{
          tabBarIcon: 'theme-light-dark',
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
  const [{ loggedUser, currentChallenge, currentLocation, trackStep, trackLoc, privateSockMsg, privateSockMsgs, socket, init }, dispatch] = useGlobals()



  useEffect(() => {
    if (init === false) {
      if (socket == null) {
        const socket_ = io.connect(SOCKET_URL, {
          transports: ['websocket'],
          autoConnect: true,
          withCredentials: false,
        })
        dispatch({
          type: 'setSocket',
          socket: socket_
        })
      }

      dispatch({
        type: 'setInit',
        socket: true
      })

      requestLocationPermission()
      requestPedometerPermission()
      return () => {
        unsubscribeLocation()
        unsubscribePedometer()
      }
    }
  }, [init])


  /* **********************************************
   *
   * If there is a team challenge running (currentChallenge != null && currentChallenge.mode === 'team'),
   * listen for socket updates 
   *
   * **********************************************/
  const [listened, setListened] = useState(false)
  useEffect(() => {
    if (socket != null && currentChallenge != null && currentChallenge.mode === 'team') {
      // setListened(true)

      socket.on('cast_private_' + currentChallenge._id, obj => {
        rcvSocket(obj)
      })

    }
  }, [socket, currentChallenge, listened])

  const rcvSocket = useCallback((obj) => {
    if (socket != null) {
      dispatch({
        type: 'setPrivateSockMsg',
        // privateSockMsg: [...privateSockMsg, obj]
        privateSockMsg: obj
      })
    }
  }, [privateSockMsg, socket, currentChallenge])


  useEffect(() => {
    if (privateSockMsg != null) {
      console.log('*************  privateSockMsg', privateSockMsg)
      dispatch({
        type: 'setPrivateSockMsgs',
        privateSockMsgs: [...privateSockMsgs, privateSockMsg]
      })
    }
  }, [privateSockMsg])



  /* **********************************************
   *
   * Location
   * 
   * -------------------
   * Request location, retrieve location, dispatch to all screens
   * Get my current position to find nearby challenges, etc.
   *
   * **********************************************/
  const [locationStatus, setLocationStatus] = useState(0)
  // const [myLocation, setMyLocation] = useState()
  /*
   * Request user's permission to retrieve location
   */
  const requestLocationPermission = async () => {
    console.log('[requestLocationPermission] CALLED')
    if (Platform.OS === 'ios') {
      // getOneTimeLocation()
      subscribeLocation()
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Location Access Required',
          message: 'This App needs to Access your location',
        })

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //? check if permission is granted
          // getOneTimeLocation()
          subscribeLocation()
        } else {
          setLocationStatus(-2)
          // setLoading(false)
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }

  /*
   * Subscribe so that the app will track the user's location without asking for permission again
   */
  let _subscriptionLocation = null
  const subscribeLocation = () => {
    _subscriptionLocation = Location.watchPositionAsync({}, (position) => {
      processPosition(position)
    })
  }
  const unsubscribeLocation = () => {
    _subscriptionLocation = null
  }

  /*
   * Process retrieved lng lat 
   */
  const processPosition = (position) => {
    // console.log('[main-stack][detail processPosition] position', position)
    setLocationStatus(1)
    // setLoading(false)

    //? getting the Longitude from the location json
    const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude))
    const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude))

    // setMyLocation({
    //   latitude: currentLatitude,
    //   longitude: currentLongitude,
    // })

    console.log('[main-stack] dispatch setCurrentLocation ', JSON.stringify({ latitude: currentLatitude, longitude: currentLongitude }))
    dispatch({
      type: 'setCurrentLocation',
      currentLocation: {
        latitude: currentLatitude,
        longitude: currentLongitude,
      },
    })
  }



  /* **********************************************
   *
   * Step counter
   * 
   * -------------------
   * Request pedometer, retrieve data, dispatch to all screens
   *
   * **********************************************/
  const [stepCounterStatus, setStepCounterStatus] = useState(0)
  /*
   * Request user's permission to retrieve sensor data
   */
  const requestPedometerPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION, {
      })

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        subscribePedometer()
      } else {
        setStepCounterStatus(0)
      }
    } catch (err) {
      console.warn(err)
    }
  }

  /*
   * Subscribe so that the app will track the user's step without asking for permission again
   */
  let _subscriptionPedometer = null
  const subscribePedometer = () => {
    console.log('[main-stack][subscribePedometer] >>> CALLED')

    _subscriptionPedometer = Pedometer.watchStepCount(result => {
      setStepCounterStatus(1)

      console.log('[main-stack] dispatch setTrackStep ', result)

      dispatch({
        type: 'setTrackStep',
        trackStep: {
          ...trackStep,
          currentStepCount: result.steps
        },
      })
    })
  }
  const unsubscribePedometer = () => {
    _subscriptionPedometer = null
  }




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

        {/* <Sta.Screen
          name="_ChallengeWalkDetailStart"
          component={ChallengeStartWalkScreen}
          options={{
          }}
        /> */}
        {/* <Sta.Screen
          name="_ChallengeWalkDetailStartTeam"
          component={ChallengeStartWalkTeamScreen}
          options={{
          }}
        />
        <Sta.Screen
          name="_ChallengeDiscoverDetailStart"
          component={ChallengeStartDiscoverScreen}
          options={{
          }}
        /> */}
        {/* <Sta.Screen
          name="_ChallengeDiscoverDetailStartTeam"
          component={ChallengeStartDiscoverTeamScreen}
          options={{
          }}
        /> */}
      </Sta.Navigator>

    </>
  )
}

export default MainStackNavigation
