import React, { useEffect, useState } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native'
import { Appbar, Button, useTheme } from 'react-native-paper'
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

import * as Location from 'expo-location'
import MapView, { Callout, Marker, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'

import { challenges_discovery } from '../../data/challenges.discovery'
import * as userAPI from '../../services/userAPI'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeListMapScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()


  /* **********************************************
   *
   * Location and map
   *
   * **********************************************/
  useEffect(() => {
    requestLocationPermission()
    return () => unsubscribeLocation()
  }, [locationStatus])

  /*
   * states to store user's location
   */
  //? location status: 
  //? 0: not retrieved yet
  //? 1: retrieved
  //? 2: retrieving
  //? -1: retrived error
  //? -2: permission denied
  const [locationStatus, setLocationStatus] = useState(0)

  const LATITUDE = -37.82014135870454
  const LONGITUDE = 144.96851676141537

  /* 
   * To set region on map
   */
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })


  /*
   * Request user's permission to retrieve location
   */
  const requestLocationPermission = async () => {
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
        }
      } catch (err) {
        console.error(err)
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
    _subscriptionLocation && _subscriptionLocation.remove()
    _subscriptionLocation = null
  }


  /*
   * Process retrieved lng lat 
   */
  const processPosition = (position) => {
    console.log('position', position)
    setLocationStatus(1)

    //? getting the Longitude from the location json
    const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude))
    const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude))

    setRegion({
      ...region,
      latitude: currentLatitude,
      longitude: currentLongitude,
    })
  }



  /* **********************************************
   *
   * Load data
   *
   * **********************************************/
  const [dataList, setDataList] = useState()

  useEffect(() => {
    console.log(dataList)
    userAPI.ping({}).then((res) => {
      console.log(res)
      var _cList = []

      setDataList(challenges_discovery)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }, [])




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
          <Text>{locationStatus}</Text>
          {locationStatus == 1 ? (<MapView
            style={styles.map}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            showsCompass={true}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
          >
            <Marker coordinate={region} />
            {dataList != null && dataList.map((item, i) => (
              <Marker
                key={`marker-` + i}
                coordinate={item.coordinates}
                // title={item.title}
                // description={item.des}
                onCalloutPress={() => openChallenge(item)}
              >
                <Callout tooltip>
                  <TouchableHighlight style={styles.customPopupView}>
                    <View style={styles.calloutText}>
                      <Text style={{ fontSize: 14 }}>{item.title}</Text>
                      <Text style={{ fontSize: 11 }}>{item.des}</Text>
                    </View>
                  </TouchableHighlight>
                </Callout>
              </Marker>
            ))}
          </MapView>)
            : (<Text>Location must be enabled to use map</Text>)
          }
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
          {dataList != null && dataList.map((item, i) => (<TouchableOpacity key={`list-` + i} onPress={() => openChallenge(item)}>
            <Text>{item.title}</Text>
          </TouchableOpacity>))}
        </ScrollView>)

      default:
        return null
    }
  }

  const renderTabBar = (props) => {
    return (
      <Appbar.Header statusBarHeight={0}>
        <View
          style={[styles.tabBar, {
            // marginTop: -15,
            // zIndex: 12,
            // backgroundColor: '#fff',
          }]}>
          {props.navigationState.routes.map((route, i) => {
            return (<TouchableOpacity
              key={"tab-" + i}
              style={[
                styles.tabItem,
                { borderBottomColor: index === i ? colors.primary : 'transparent' }
              ]}
              onPress={() => setIndex(i)}>
              <Text style={{ opacity: index === i ? 1 : 0.5, color: index === i ? colors.primary : colors.black, fontSize: 17 }}>{route.title}</Text>
            </TouchableOpacity>)
          })}
        </View>
        <Appbar.Action icon="magnify" onPress={openFilter} style={styles.openFilterBtn} />
      </Appbar.Header>
    )
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
  const openChallenge = (item) => {
    console.log('to ChallengeDiscoveryDetailInfoScreen')
    navigation.navigate('ChallengeDiscoveryDetailInfo', { key: 'ChallengeDetailInfo', challengeDetail: item })
  }


  return (
    <DefaultView>
      {/* <Button style={styles.openFilterBtn} mode="contained" onPress={openFilter}>
        Filter
      </Button>
      <Button style={{ position: 'absolute', right: 80, zIndex: 2 }} onPress={openChallenge}>
        <Text>Detail</Text>
      </Button> */}

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
    top: 11, right: 10,
    // backgroundColor: '#000',
    zIndex: 2
  },

  customPopupView: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10
  }
})

export default ChallengeListMapScreen
