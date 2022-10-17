import { useNavigation } from '@react-navigation/core'
import PropTypes from 'prop-types'
import React from 'react'
import { Dimensions, Image, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text } from './paper/typos'
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
    if (currentChallenge.type == 'discover') {
      navigation.navigate('ChallengeDiscoverDetailStart', { key: 'ChallengeDiscoverDetailStart', challenge_accepted_data: currentChallenge })
    } else {
      navigation.navigate('ChallengeWalkDetailStart', { key: 'ChallengeWalkDetailStart', challenge_accepted_data: currentChallenge })
    }
  }

  return (<TouchableOpacity style={{ backgroundColor: '#0f0', flex: 1, zIndex: 1000, position: 'absolute', bottom: 65, left: 0, right: 0 }} onPress={openChallenge}>
    <Text>jrhebf</Text>
  </TouchableOpacity>)
}

const styles = StyleSheet.create({
})

export default ChallengeBottomSheet
