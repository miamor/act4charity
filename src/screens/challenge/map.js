import React, { useEffect, useState } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView } from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import { Text, H2 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import SpaceSky from '../../components/decorations/space-sky'
import CustomInput from '../../components/paper/custom-input'
import { useGlobals } from '../../contexts/global'
import { Backgrounds } from '../../svgs'
import Aquarius from '../../svgs/Aquarius'

import * as Yup from 'yup'
import { Formik } from 'formik'
import * as authAPI from "../../services/authAPI"
import axios from 'axios'

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { TabView, SceneMap } from 'react-native-tab-view'

import Geolocation from 'react-native-geolocation-service'
import MapView, { Marker, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeListMapScreen({ navigation }) {
  const [{ session, loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  /*
   * states to store user's location
   */
  const [getPosition, setGetPosition] = useState(false)
  const [currentLongitude, setCurrentLongitude] = useState(105.51)
  const [currentLatitude, setCurrentLatitude] = useState(21.02)
  //? location status: 
  //? 0: not retrieved yet
  //? 1: retrieved
  //? 2: retrieving
  //? -1: retrived error
  //? -2: permission denied
  const [locationStatus, setLocationStatus] = useState(0)



  useEffect(() => {
    requestLocationPermission()
  }, [])



  /*
   * Request user's permission to retrieve location
   */
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation()
      // subscribeLocationLocation()
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getOneTimeLocation()
          // subscribeLocationLocation()
        } else {
          console.log('heck ~~~~~~')
          setLocationStatus(-2)
          // setDoLoad(true)
        }
      } catch (err) {
        console.warn(err)
        // setDoLoad(true)
      }
    }
  }


  /* 
   * Request user location. Get one time. Ask everytime want to retrieve (not subscribe)
   */
  const getOneTimeLocation = () => {
    if (!getPosition) {
      setGetPosition(true)
      setLocationStatus(2)

      Geolocation.getCurrentPosition(
        (position) => {
          processPosition(position)
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      )
    }
  }


  /*
   * Subscribe so that the app will track the user's location without asking for permission again
   */
  const subscribeLocationLocation = () => {
    const watchID = Geolocation.watchPosition(
      (position) => {
        processPosition(position)
      },
      (error) => {
        setLocationStatus(-1)
        console.log(error.message)
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    )
  }


  /*
   * Process retrieved lng lat 
   */
  const processPosition = (position) => {
    console.log('position', position)
    setLocationStatus(1)

    //getting the Longitude from the location json
    const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude))
    const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude))

    setCurrentLongitude(currentLongitude)
    setCurrentLatitude(currentLatitude)

    setRegion({
      ...region,
      latitude: currentLatitude,
      longitude: currentLongitude,
    })
  }


  /* 
   * To set region on map
   */
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [markers, setMarkers] = useState()

  // const onRegionChange = (region) => {
  //   setRegion(region)
  // }

  /* 
   * Tab view
   */
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'map', title: 'Map' },
    { key: 'list', title: 'List' },
  ])

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'map':
        return (<>
          {/* {currentLatitude != null && currentLongitude != null && (<MapView
            initialRegion={{
              latitude: currentLatitude,
              longitude: currentLongitude,
              // latitudeDelta: 0.0922,
              // longitudeDelta: 0.0421,
            }}
            // region={region}
            onRegionChange={onRegionChange}>

          </MapView>)} */}
          <Text>{locationStatus}</Text>
          {locationStatus == 1 && (<Text>{currentLatitude} - {currentLongitude}</Text>)}
          {locationStatus == 1 ? (<MapView
            style={styles.map}
            // initialRegion={{
            //   // latitude: currentLatitude,
            //   // longitude: currentLongitude,
            //   latitude: 21,
            //   longitude: 105,

            //   // latitudeDelta: 0.0922,
            //   // longitudeDelta: 0.0421,
            // }}
            region={region}
          // onRegionChange={onRegionChange}
          >
            <Marker coordinate={region} />
            {/* {markers != null && markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))} */}

          </MapView>)
            : (<Text>Location must be enabled to use map</Text>)}
        </>)
      case 'list':
        return (<ScrollView
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{
            paddingHorizontal: 20
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <Text>rjfenkm</Text>
        </ScrollView>)
      default:
        return null
    }
  }

  const renderTabBar = (props) => {
    return (<View
      style={[styles.tabBar, {
        // marginTop: -15,
        // zIndex: 12,
        // backgroundColor: '#fff',
      }]}>
      {props.navigationState.routes.map((route, i) => {
        return (
          <TouchableOpacity
            key={"tab-" + i}
            style={[
              styles.tabItem,
              { borderBottomColor: index === i ? colors.primary : 'transparent' }
            ]}
            onPress={() => setIndex(i)}>
            <Text style={{ opacity: index === i ? 1 : 0.5, color: index === i ? colors.primary : colors.black, fontSize: 17 }}>{route.title}</Text>
          </TouchableOpacity>
        )
      })}
    </View>)
  }


  /*
   * Open filter screen
   */
  const openFilter = () => {
    console.log('openFilter')
  }

  /* 
   * Go to detail challenge
   */
  const openChallenge = () => {
    console.log('to ChallengeDiscoveryDetailInfoScreen')
    navigation.navigate('ChallengeDiscoveryDetailInfo', { key: 'ChallengeDetailInfo' })
  }


  return (
    <DefaultView>
      <Button style={styles.openFilterBtn} mode="contained" onPress={openFilter}>
        Filter
      </Button>
      <Button style={{ position: 'absolute', right: 80, zIndex: 2 }} onPress={openChallenge}>
        <Text>Detail</Text>
      </Button>

      <TabView
        navigationState={{ 'index': index, 'routes': routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
      // initialLayout={{ width: layout.window.width }}
      />
    </DefaultView>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2
  },
  tabCont: {
    paddingHorizontal: 15
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  openFilterBtn: {
    position: 'absolute',
    top: 3, right: 10,
    // backgroundColor: '#000',
    zIndex: 2
  }
})

export default ChallengeListMapScreen
