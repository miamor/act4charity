import React, { PropTypes, Component, useEffect, useState, useCallback } from 'react'
import { StyleSheet, View, Image, ScrollView, ToastAndroid, PermissionsAndroid, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import { ProgressBar, Button, Appbar, useTheme, Badge, Portal, Modal, Paragraph, MD2Colors, MD3Colors, Avatar } from 'react-native-paper'
import { H2, H3, Text, TextBold } from '../components/paper/typos'
import { DefaultView } from '../components/containers'
import { useGlobals } from '../contexts/global'
import Loading from '../components/animations/loading'

import * as userAPI from '../services/userAPI'
import haversine from 'haversine'
import Storer from '../utils/storer'
import { levels_ranges } from '../utils/vars'
import UserInfo from '../components/user-info'
import DateUtils from '../utils/date'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */

function UserWallScreen({ route, navigation }) {
  const [{ loggedUser, currentChallenge, currentLocation, trackStep, trackLoc }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const { user_id } = route.params

  const [loading, setLoading] = useState(true)

  const [userInfo, setUserInfo] = useState()
  // const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    // if (loaded === false) {
    //   setLoaded(true)
    //   loadUserProfile()
    // }
    loadUserProfile()
  }, [])

  const loadUserProfile = () => {
    userAPI.getUserInfo({ user_id: user_id }).then((res) => {
      // console.log('[loadUserProfile] res', res)
      setUserInfo(res.data)
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


  const [tabIndex, setTabIndex] = useState(0)


  const { width } = Dimensions.get('window')


  return (<DefaultView>
    <Appbar.Header statusBarHeight={0}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
    </Appbar.Header>

    {loading && <Loading />}

    {userInfo != null && (<View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{ height: 190, marginTop: -50, paddingTop: 0, justifyContent: 'center', alignItems: 'center' }}>
        <Avatar.Image size={120} source={{ uri: userInfo.avatar }} />

        <H3>{userInfo.firstname}</H3>
      </View>

      <View style={{ height: 70, flexDirection: 'row', justifyContent: 'center', paddingTop: 0 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.bigtxt}>
            ${userInfo.current_donation}</Text>
          <Text style={styles.subtxt}>donated</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.bigtxt}>{userInfo.n_completed}</Text>
          <Text style={styles.subtxt}>challenges completed</Text>
        </View>
        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.bigtxt}>{userInfo.current_donation}</Text>
          <Text style={styles.subtxt}>donated</Text>
        </View> */}
      </View>




      <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => setTabIndex(0)}
          style={{
            // backgroundColor: '#00f',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderBottomWidth: 2,
            borderBottomColor: tabIndex === 0 ? colors.primary : 'transparent',
          }}>
          <Text style={[tabIndex === 0 && { color: colors.primary, fontWeight: 'bold' }]}>
            Stories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTabIndex(1)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderBottomWidth: 2,
            borderBottomColor: tabIndex === 1 ? colors.primary : 'transparent',
          }}>
          <Text style={[tabIndex === 1 && { color: colors.primary, fontWeight: 'bold' }]}>
            Feed
          </Text>
        </TouchableOpacity>
      </View>


      <View style={{ flex: 1 }}>
        {tabIndex === 0 ? (<>
          <FlatList
            data={userInfo.stories}
            // style={styles.list}
            numColumns={3}
            scrollEnabled={true}
            keyExtractor={item => item._id}
            bounces={true}
            contentContainerStyle={{
              justifyContent: 'space-between',
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={{
                // flex: 1,
              }}>
                <Image source={{ uri: item.picture }} style={{ width: width / 3, height: width / 3 }} />
              </TouchableOpacity>
            )}
          />
        </>) : tabIndex === 1 ? (<>
          <FlatList
            data={userInfo.feeds}
            // style={styles.list}
            numColumns={3}
            scrollEnabled={true}
            keyExtractor={item => item._id}
            bounces={true}
            contentContainerStyle={{
              justifyContent: 'space-between',
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={{
                // flex: 1,
              }}>
                <Image source={{ uri: item.picture }} style={{ width: width / 3, height: width / 3 }} />
              </TouchableOpacity>
            )}
          />
        </>) : (<></>)}

      </View>

    </View>)}

  </DefaultView>)
}

const styles = StyleSheet.create({
  bigtxt: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  subtxt: {
    fontSize: 11,
    lineHeight: 15
  }
})

export default UserWallScreen
