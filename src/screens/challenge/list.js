import React, { useEffect, useState } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native'
import { Appbar, Button, useTheme } from 'react-native-paper'
import { Text, H2 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'

import * as Yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { TabView, SceneMap } from 'react-native-tab-view'

import { challenges_walk } from '../../data/challenges.walk'
import * as userAPI from '../../services/userAPI'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeListScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()


  /*
   * Load data
   */
  const [dataList, setDataList] = useState()

  useEffect(() => {
    console.log(dataList)
    userAPI.ping({}).then((res) => {
      console.log(res)
      var _cList = []

      setDataList(challenges_walk)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }, [])


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
    navigation.navigate('ChallengeWalkDetailInfo', { key: 'ChallengeWalkDetailInfo', challengeDetail: item })
  }


  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Hello" />
        <Appbar.Action icon="magnify" onPress={openFilter} style={styles.openFilterBtn} />
      </Appbar.Header>

      {dataList != null && dataList.map((item, i) => (<TouchableOpacity key={`list-` + i} onPress={() => openChallenge(item)}>
        <Text>{item.title}</Text>
      </TouchableOpacity>))}
    </DefaultView>
  )
}

const styles = StyleSheet.create({
})

export default ChallengeListScreen