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
function ChallengeListWalkScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()


  /*
   * Load data
   */
  const [dataList, setDataList] = useState()

  /*
   * Filter options
   */
  const [filter, setFilter] = useState({
    type: 'walk',
  })

  /* 
   * Load
   */
  useEffect(() => {
    // console.log(dataList)
    userAPI.listChallengesWalk({ filter: filter }).then((res) => {
      // console.log(res)
      // var _cList = []
      // setDataList(challenges_discovery)
      if (res.status === 'success') {
        setDataList(res.data)
      }
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }, [filter])


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
        <Text>{item.name}</Text>
      </TouchableOpacity>))}
    </DefaultView>
  )
}

const styles = StyleSheet.create({
})

export default ChallengeListWalkScreen