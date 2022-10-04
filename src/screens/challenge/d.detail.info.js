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
function ChallengeDiscoveryDetailInfoScreen({ navigation }) {
  const [{ session, loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()


  useEffect(() => {
  }, [])


  /*
   * Start the challenge. Go to the map direction screen
   */
  const startChallange = () => {
    navigation.navigate('ChallengeDiscoveryDetailMap', { key: 'ChallengeDetailMap' })
  }


  return (
    <DefaultView>
      <Button style={styles.startChallengeBtn} onPress={startChallange}>
        <Text>Start</Text>
      </Button>
      
    </DefaultView>
  )
}

const styles = StyleSheet.create({
  startChallengeBtn: {
    position: 'absolute',
    top:3, right:10,
    // backgroundColor: '#000'
  }
})

export default ChallengeDiscoveryDetailInfoScreen
