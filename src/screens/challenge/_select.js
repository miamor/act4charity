import React, { useEffect, useState } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native'
import { Appbar, Button, useTheme } from 'react-native-paper'
import { Text, H2 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'

import * as Yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeSelectScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()


  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Hello" />
      </Appbar.Header>

      <TouchableOpacity onPress={() => navigation.navigate('ChallengeListWalk', { key: 'ChallengeListWalk' })}>
        <Text>Walk</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ChallengeListMapDiscover', { key: 'ChallengeListMapDiscover' })}>
        <Text>Discovery</Text>
      </TouchableOpacity>

    </DefaultView>
  )
}

const styles = StyleSheet.create({
})

export default ChallengeSelectScreen