import React, { useEffect, useState } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView } from 'react-native'
import { Appbar, Button, useTheme, Paragraph, Dialog, Portal } from 'react-native-paper'
import { TextBold, Text, H2 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import SpaceSky from '../../components/decorations/space-sky'
import CustomInput from '../../components/paper/custom-input'
import { useGlobals } from '../../contexts/global'
import { Backgrounds } from '../../svgs'
import Aquarius from '../../svgs/Aquarius'

import axios from 'axios'

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { TabView, SceneMap } from 'react-native-tab-view'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeWalkDetailInfoScreen({ route, navigation }) {
  const [{ loggedUser, currentChallenge }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const { challengeDetail } = route.params


  /*
   * Start the challenge. Go to the map direction screen.
   * Make sure to checkk if there's any other challenge running.
   */
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const onPressStartChallenge = () => {
    if (currentChallenge != null && currentChallenge._id !== challengeDetail._id) { //? the user is in another challenge
      setShowConfirmDialog(true)
    } else {
      onConfirmStart()
    }
  }
  const onConfirmStart = () => {
    navigation.navigate('ChallengeWalkDetailStart', { key: 'ChallengeWalkDetailStart', challengeDetail: challengeDetail })
  }
  const hideDialog = () => setShowConfirmDialog(false)


  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={challengeDetail.title} color={colors.primary} />
      </Appbar.Header>

      {showConfirmDialog && (<Portal>
        <Dialog visible={showConfirmDialog} onDismiss={hideDialog} style={{ zIndex: 1000, backgroundColor: '#fff' }}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              You are in another challenge: <TextBold>{currentChallenge.title}</TextBold>
            </Paragraph>
            <Paragraph>
              Starting this challenge will kill the other challenge you are doing. Are you sure ?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={{ flexDirection: 'column' }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 2, lineHeight: 20 }} onPress={hideDialog}>No, continue old challenge</Button>
            <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 2, lineHeight: 20 }} onPress={onConfirmStart}>Yes, start this challenge</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>)}


      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <View style={{ flex: 0.5, backgroundColor: '#ddd' }}>

        </View>

        <View style={{ flex: 0.45, paddingHorizontal: 10, marginTop: 10, alignItems: 'center' }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Your challenge is to walk <TextBold>{challengeDetail.distance}</TextBold> km</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Donations from this challenge will go to <TextBold>{challengeDetail.charity_activity_info.name}</TextBold> who <TextBold>{challengeDetail.charity_activity_info.activity}</TextBold></Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Are you ready ?</Text>
          </View>
        </View>

        <View style={{ marginVertical: 20, flexDirection: 'row' }}>
          <Button onPress={() => navigation.goBack()} style={{ flex: 1, borderRadius: 30 }} contentStyle={{ height: 50 }}>
            Back
          </Button>
          <Button mode="contained" onPress={onPressStartChallenge} style={{ flex: 1, borderRadius: 30 }} contentStyle={{ height: 50 }}>
            {(currentChallenge != null && currentChallenge._id === challengeDetail._id) ? 'Continue' : 'Start'}
          </Button>
        </View>

      </View>

    </DefaultView>
  )
}

const styles = StyleSheet.create({
  startChallengeBtn: {
    position: 'absolute',
    top: 3, right: 10,
    // backgroundColor: '#000'
  }
})

export default ChallengeWalkDetailInfoScreen
