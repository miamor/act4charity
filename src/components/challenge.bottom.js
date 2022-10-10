import { useNavigation } from '@react-navigation/core'
import PropTypes from 'prop-types'
import React from 'react'
import { Dimensions, Image, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text } from '../components/paper/typos'
import { useGlobals } from '../contexts/global'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeBottomSheet({ }) {
  const [{ currentChallenge }] = useGlobals()
  const navigation = useNavigation()

  const openChallenge = () => {
    if (currentChallenge.type == 'discovery') {
      navigation.navigate('ChallengeDiscoveryDetailMap', { key: 'ChallengeDiscoveryDetailMap', challengeDetail: currentChallenge })
    } else {
      navigation.navigate('ChallengeWalkDetailStart', { key: 'ChallengeWalkDetailStart', challengeDetail: currentChallenge })
    }
  }

  return (<TouchableOpacity style={{ backgroundColor: '#0f0', flex: 1, zIndex: 1000, position: 'absolute', bottom: 65, left: 0, right: 0 }} onPress={openChallenge}>
    <Text>jrhebf</Text>
  </TouchableOpacity>)
}

const styles = StyleSheet.create({
})

export default ChallengeBottomSheet
