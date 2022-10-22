import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import { Appbar, Button, useTheme, Paragraph, Dialog, Portal } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'

import { TabView, SceneMap } from 'react-native-tab-view'

import Geolocation from 'react-native-geolocation-service'
import MapView, { Marker, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'

import * as userAPI from '../../services/userAPI'
import Storer from '../../utils/storer'
import { CURRENT_CHALLENGE_KEY } from '../../constants/keys'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeCompletedScreen({ route, navigation }) {
  const [{ loggedUser, currentChallenge, trackLoc, trackStep }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const { challengeDetail, captured_image, distanceTravelled, routeCoordinates, challenge_accepted_id } = route.params


  useEffect(() => {
    console.log('challengeDetail', challengeDetail)
    console.log('route.params', route.params)

    /* 
     * clean everything
     */
    onSetDispatch('setStarted', 'started', false)
    onSetDispatch('setFinished', 'finished', false)
    onSetDispatch('setTrackMemberLocationStates', 'trackMemberLocationStates', {})
    onSetDispatch('setTrackMemberDistStates', 'trackMemberDistStates', {})
    onSetDispatch('setTrackMemberStepStates', 'trackMemberStepStates', {})
    onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', {})
    onSetDispatch('setCompletedMembers', 'completedMembers', [])
    onSetDispatch('setChatMessages', 'chatMessages', [])
    onSetDispatch('setPrivateSockMsgs', 'privateSockMsgs', [])
    onSetDispatch('setPrivateSockMsg', 'privateSockMsg', null)
    onSetDispatch('setProcessedPrivateSockMsgs', 'processedPrivateSockMsgs', 0)
    onSetDispatch('setTeamCompleted', 'teamCompleted', 0)
    onSetDispatch('setTrackLoc', 'trackLoc', {
      ...trackLoc,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
    })
    onSetDispatch('setTrackStep', 'trackStep', {
      distanceTravelled: 0,
      currentStepCount: 0
    })

    onSetDispatch('setShowBottomBar', 'showBottomBar', false)
    Storer.delete(CURRENT_CHALLENGE_KEY)
    onSetDispatch('setCurrentChallenge', 'currentChallenge', null)

    onSetDispatch('setCompleted', 'completed', 5)
  }, [])


  /*
   * Post to db
   */
  const updateDB = () => {
  }


  const dimensions = Dimensions.get('window')

  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction onPress={() => navigation.navigate('ChallengeStack', { screen: 'ChallengeSelect' })} />
        <Appbar.Content title="Challenge Completed" color={colors.primary} />
      </Appbar.Header>

      <View style={{ flex: 1, paddingHorizontal: 10 }}>

        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={{ uri: captured_image }} style={{ flex: 1, width: dimensions.width - 20, height: 200 }} />

          <View style={{ flex: 0.2, marginTop: -25, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <Button mode="contained" labelStyle={{ paddingBottom: 1 }}>Share to my Feed</Button>
            <Button style={{ backgroundColor: '#fff', borderRadius: 30, marginTop: -5 }} labelStyle={{ width: 30, height: 40, justifyContent: 'center', alignItems: 'center', paddingTop: 8 }}>
              <MaterialCommunityIcons name="share" size={22} />
            </Button>
          </View>

        </View>

        <View style={{ flex: 0.3, marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
          <H3>Congratulations!</H3>

          <Paragraph>
            You've completed this challenge
          </Paragraph>
          <Paragraph>
            An amount of <TextBold>${challengeDetail.donation}</TextBold> has been donated to <TextBold>{challengeDetail.charity_detail.name}</TextBold> under <TextBold>your name</TextBold>
          </Paragraph>
          <Paragraph>
            <Text>by </Text>
            <Image source={{ uri: challengeDetail.sponsor_detail.logo }} />
            <TextBold>{challengeDetail.sponsor_detail.name}</TextBold>
          </Paragraph>
        </View>

        <View style={{ flex: 0.45, backgroundColor: '#f0f', justifyContent: 'center', alignItems: 'center' }}>
        </View>

      </View>

    </DefaultView>
  )
}

const styles = StyleSheet.create({

})

export default ChallengeCompletedScreen
