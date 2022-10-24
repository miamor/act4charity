import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, TouchableHighlight, ScrollView, Image } from 'react-native'
import { Appbar, Button, useTheme } from 'react-native-paper'
import { Text, H2, TextBold } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'

import { TabView, SceneMap } from 'react-native-tab-view'

import * as Location from 'expo-location'
import MapView, { Callout, Marker, Circle, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'

import { challenges_discovery } from '../../data/challenges.discovery'
import * as userAPI from '../../services/userAPI'
import Loading from '../../components/animations/loading'
import FilterModal from './filter.modal'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeListMapScreen({ navigation }) {
  const [{ loggedUser, currentRegion, currentLocation }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)

  /*
   * Filter options
   */
  const [filter, setFilter] = useState({
    // type: 'discover',
    // distance: 1000, //? search within 1km (1000m)
    distance: 0, //? distance = 0 means unfilter distance
  })


  /* 
   * To set region on map
   */
  const [region, setRegion] = useState(currentRegion)


  /* **********************************************
   *
   * Location and map
   *
   * **********************************************/
  useEffect(() => {
    if (currentLocation != null) {
      processPosition(currentLocation)
    }
  }, [currentLocation])

  /*
   * Process retrieved lng lat 
   */
  const processPosition = (position) => {
    // //console.log('[listmap][processPosition] position', position)

    setRegion({
      ...region,
      latitude: position.latitude,
      longitude: position.longitude,
    })


    // //console.log('[listmap][processPosition] >>>>>>>>>>> setFilter CALLING')
    setFilter({
      ...filter,
      distance: 1.5,
      user_loc: [position.longitude, position.latitude],
      interests: loggedUser.interests,
    })
  }



  /* **********************************************
   *
   * Load data
   *
   * **********************************************/
  const [dataList, setDataList] = useState()
  const [loaded, setLoaded] = useState(false)

  /* 
   * Load
   */
  useEffect(() => {
    console.log('[listmap] filter updated', filter)

    if (!loaded && filter.user_loc != null) {
      setLoading(true)
      loadData(filter)
    }
  }, [filter, loaded])

  const loadData = (_filter) => {
    //~console.log('[listmap] loadData called', _filter)
    //? fetch data
    setLoaded(true)
    userAPI.listChallenges({ filter: _filter, num_per_page: 100 }).then((res) => {
      // console.log('res', res)
      if (res.status === 'success') {
        setDataList(res.data)
        setLoading(false)
      } else {
        setLoading(false)
        console.error(error)
        ToastAndroid.show(error, ToastAndroid.SHORT)
      }
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


  /* **********************************************
   *
   * Tab view
   *
   * **********************************************/
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'map', title: 'Map' },
    { key: 'list', title: 'List' },
  ])

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'map':
        return (<>
          {/* <Text>{locationStatus}</Text> */}
          {currentLocation ? (<MapView
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
            {/* <Marker coordinate={region} /> */}
            {filter.distance > 0 && <Circle center={region} radius={filter.distance * 1000} fillColor="#f75d4f28" strokeColor="#f75d4f99" strokeWidth={2} />}

            {dataList != null && dataList.map((item, i) => {
              if (item.place_detail != null) {
                return (<Marker
                  key={`marker-` + i}
                  coordinate={item.place_detail.coordinates}
                  // title={item.title}
                  // description={item.des}
                  onCalloutPress={() => openChallenge(item)}
                >
                  <Callout tooltip>
                    <TouchableHighlight style={styles.customPopupView}>
                      <View style={styles.calloutText}>
                        <TextBold style={{ fontSize: 14 }}>{item.name}</TextBold>
                        {/* <Text style={{ fontSize: 11 }}>{item.des}</Text> */}
                      </View>
                    </TouchableHighlight>
                  </Callout>
                </Marker>)
              }
            })}
          </MapView>)
            : (<Text>Cannot retrieve location. PLease make sure Location has been enabled.</Text>)}
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
          {dataList != null && dataList.map((item, i) => (<TouchableOpacity key={`list-` + i}
            onPress={() => openChallenge(item)}
            style={{
              // marginHorizontal: 20,
              marginTop: 10,
              marginBottom: 10,
              flexDirection: 'row',
              // justifyContent: 'space-between',
              // alignItems: 'center',
            }}>
            <Image
              style={{ height: 46, width: 46, marginTop: -1 }}
              source={item.type == 'walk' ? require('../../../assets/icons/walking.png') : require('../../../assets/icons/discover.png')}
            />

            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 6 }}>
              <Text style={{ color: colors.primary, lineHeight: 21, marginBottom: 8 }} variant="titleMedium">{item.name}</Text>
              <Text style={{ color: '#d2d2d2', fontSize: 14, lineHeight: 15 }} variant="bodyMedium">
                {item.sponsor_detail.name}
              </Text>
            </View>

            <Text>${item.donation}</Text>
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
            marginBottom: -8,
            // zIndex: 12,
            // backgroundColor: '#f0f',
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
   * Go to detail challenge
   */
  const openChallenge = (item) => {
    navigation.navigate('ChallengeDetailInfo', { key: 'ChallengeDetailInfo', challengeDetail: item })
  }



  /*
   * Open filter screen
   */
  const [filterModal, setFilterModalVisibility] = useState(false)
  const openFilter = () => {
    // //console.log('openFilter')
    setFilterModalVisibility(!filterModal)
  }
  /* 
   * on finish set filter
   */
  const onFinishFilter = useCallback((values) => {
    // //console.log('[listmap][onFinishFilter] >> values', values)
    // //console.log('[listmap][onFinishFilter] >> filter', filter)
    let newFilter = {
      ...filter,
      ...values
    }
    // //console.log('[listmap][onFinishFilter] >> newFilter', newFilter)
    setFilter(newFilter)
    loadData(newFilter)
  }, [filter])

  const [helpModal, setHelpModalVisibility] = useState(false)



  return (
    <DefaultView>
      {loading && <Loading />}

      <TabView
        navigationState={{ 'index': index, 'routes': routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
      />

      {/* <Button onPress={openFilter}>Filter</Button> */}

      <FilterModal
        filterModalVisibility={filterModal}
        setFilterModalVisibility={setFilterModalVisibility}
        onFinishFilter={onFinishFilter}
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
