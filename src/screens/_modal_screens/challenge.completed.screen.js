import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import { Appbar, Button, useTheme, Paragraph, Dialog, Portal, TextInput } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'

import { TabView, SceneMap } from 'react-native-tab-view'

import Geolocation from 'react-native-geolocation-service'
import MapView, { Marker, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'

import * as userAPI from '../../services/userAPI'
import Storer from '../../utils/storer'
import Loading from '../../components/animations/loading'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeCompletedScreen({ route, navigation }) {
  const [{ loggedUser, currentChallenge, trackLoc, trackStep }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const { challengeDetail, captured_image, distanceTravelled, routeCoordinates, challenge_accepted_id, donation_amount, participants_names } = route.params


  const [loading, setLoading] = useState(false)


  // useEffect(() => {
  //   // //console.log('[challenge.completed] challengeDetail', challengeDetail)
  //   // //console.log('[challenge.completed] route.params', route.params)
  //   console.log('[challenge.completed] captured_image', captured_image)
  // }, [])


  /*
   * Add text content to share to feed
   */
  const [showForm, setShowForm] = useState(false)
  const hideForm = () => setShowForm(false)
  const onPressShareFeed = () => {
    setShowForm(true)
  }
  const [statusText, setStatusText] = useState('')
  const onSubmitShareFeed = () => {
    setShowForm(false)
    setLoading(true)

    // let fileToUpload = {
    //   uri: captured_image,
    //   type: 'image/jpg',
    //   name: pickerResponse.assets[0].fileName,
    // }

    // let data = new FormData()
    // data.append('files', fileToUpload)
    // data.append('content', statusText)

    // userAPI.shareFeed({
    //   challenge_accepted_id: challenge_accepted_id,
    //   challenge_id: challengeDetail._id,
    //   content: statusText
    // })
  }


  const onShareToFeed = () => {
    setLoading(true)
    ToastAndroid.show('Shared to your feed !', ToastAndroid.SHORT)

    // navigation.goBack()
    navigation.navigate('DashboardStack')
  }



  const dimensions = Dimensions.get('window')

  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction onPress={() => navigation.navigate('DashboardStack')} />
        <Appbar.Content title="Challenge Completed" color={colors.primary} />
      </Appbar.Header>

      {loading && <Loading />}

      {showForm && (<Portal>
        <Modal visible={showForm} onDismiss={hideForm} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Are you sure to cancel?</H3>

          <TextInput
            style={{ height: 120 }}
            mode="outlined"
            placeholder="Say something..."
            placeholderTextColor="#C9C5CA"
            multiline={true}
            value={statusText}
            onChangeText={value => setStatusText(value)}
          />

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onSubmitShareFeed}>Share</Button>
            <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideForm}>Close</Button>
          </View>
        </Modal>
      </Portal>)}


      <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 10 }}>

        <View style={{ flex: 0.45, alignSelf: 'flex-start', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={captured_image != null ? { uri: captured_image } : require('../../../assets/icons/logo.png')} style={{ flex: 1, width: dimensions.width - 20, height: 200 }} />

          <View style={{ flex: 0.2, marginTop: -25, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <Button mode="contained" labelStyle={{ paddingBottom: 1 }} onPress={onShareToFeed}>Share to my Feed</Button>
            <Button style={{ backgroundColor: '#fff', borderRadius: 30, marginTop: -5 }} labelStyle={{ width: 30, height: 40, justifyContent: 'center', alignItems: 'center', paddingTop: 8 }}>
              <MaterialCommunityIcons name="share" size={22} />
            </Button>
          </View>

        </View>

        <View style={{ flex: 0.35, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <H3>Congratulations!</H3>

          <Paragraph>
            You've completed this challenge
          </Paragraph>
          <Paragraph style={{textAlign: 'center', marginTop:6}}>
            {/* An amount of <TextBold>${donation_amount}</TextBold> has been donated to <TextBold>{challengeDetail.charity_detail.name}</TextBold> under your name <TextBold>{loggedUser.firstname}</TextBold> */}
            An amount of <TextBold>${donation_amount}</TextBold> has been donated to <TextBold>{challengeDetail.charity_detail.name}</TextBold> under your name <TextBold>{participants_names.join(', ')}</TextBold>
          </Paragraph>
          <Paragraph>
            <Text>by </Text>
            <TextBold>{challengeDetail.sponsor_detail.name}</TextBold>
          </Paragraph>
        </View>

        <View style={{ flex: 0.35, backgroundColor: '#eee', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Advertisement of sponsor here</Text>
          {/* <Image source={{ uri: challengeDetail.sponsor_detail.logo }} style={{ flex: 1, width: dimensions.width - 20, height: 200 }} /> */}
        </View>

      </View>

    </DefaultView>
  )
}

const styles = StyleSheet.create({

})

export default ChallengeCompletedScreen
