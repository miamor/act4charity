import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Appbar, Button, useTheme, ProgressBar, MD3Colors, Paragraph, Dialog, Portal, Modal } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'

import haversine from 'haversine'

import PercentageCircle from 'react-native-percentage-circle'
import ViewShot from 'react-native-view-shot'
import Loading from '../../components/animations/loading'

import * as userAPI from '../../services/userAPI'
import Storer from '../../utils/storer'
import ChallengeStartMap from '../../components/_challenge/mapview'
import ChallengeStartActionsIndividual from '../../components/_challenge/actions.individual'
import ChallengeStartActionsTeam from '../../components/_challenge/actions.team'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeStartScreen({ route, navigation }) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, trackStep,
    completed, started, startTime }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })



  /* **********************************************
   *
   * Set currentChallenge global variable after back, so that when exit this screen, the current challenge will display at bottom bar
   *
   * **********************************************/
  useEffect(() => {
    onSetDispatch('setShowBottomBar', 'showBottomBar', false)
  }, [completed])
  useEffect(() => {
    if (completed === 0) {
      navigation.addListener('beforeRemove', (e) => {
        onSetDispatch('setShowBottomBar', 'showBottomBar', true)
      })
    }
  }, [navigation, completed])



  return (
    <DefaultView>

      {(currentChallenge != null && completed !== 4) ? (<>

        <View style={{ flex: 0.9, flexDirection: 'row' }}>
          <ChallengeStartMap showFull={true} />
        </View>

        {currentChallenge.mode === 'individual' ? (
          <ChallengeStartActionsIndividual showFull={true} />
        )
          : (
            <ChallengeStartActionsTeam showFull={true} />
          )}

      </>) : (<>
        <Appbar.Header statusBarHeight={0}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Challenge Map" color={colors.primary} />
        </Appbar.Header>

        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <Paragraph style={{ alignItems: 'center', textAlign: 'center' }}>
            {(completed === 4 && currentChallenge == null) ? 'You\'ve completed the challenge' : 'No challenge selected'}
          </Paragraph>

          <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
            <Button mode="contained" onPress={() => navigation.goBack()}>
              Back
            </Button>
          </View>
        </View>
      </>)}

    </DefaultView>
  )
}

const styles = StyleSheet.create({
})

export default ChallengeStartScreen
