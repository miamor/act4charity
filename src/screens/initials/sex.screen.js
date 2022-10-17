import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Headline, TouchableRipple } from 'react-native-paper'
import { Text } from '../../components/paper/typos'

import { DefaultView } from '../../components/containers'
import SpaceSky from '../../components/decorations/space-sky'
import { useGlobals } from '../../contexts/global'
import Female from '../../svgs/Female'
import Aquarius from '../../svgs/Aquarius'
import Male from '../../svgs/Male'

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function SexScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const [sex, setSex] = useState('')
  const buttonDisabled = !sex
  const _handleContinue = () => {
    dispatch({
      type: 'setLoggedUser',
      loggedUser: { 
        ...loggedUser,
        sex: sex
       },
    })
    navigation.push('InterestCategory')
  }

  return (
    <DefaultView>
      <SpaceSky />
      <Aquarius width={60} height={60} style={styles.leo} />
      <View style={{ flex: 1 }} />
      <View style={styles.textContainer}>
        <Headline style={styles.textHeadline}>Your gender</Headline>
        <Text style={styles.textText}>
        </Text>
      </View>

      <View style={styles.sexContainer}>
        <TouchableRipple
          onPress={() => setSex('Male')}
          rippleColor="rgba(0,0,0,0)"
        >
          <View>
            <Male style={{ opacity: sex === 'Male' ? 1 : 0.5 }} />
            <Text style={styles.sexText}>Male</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => setSex('Female')}
          rippleColor="rgba(0,0,0,0)"
        >
          <View>
            <Female style={{ opacity: sex === 'Female' ? 1 : 0.5 }} />
            <Text style={styles.sexText}>Female</Text>
          </View>
        </TouchableRipple>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          disabled={buttonDisabled}
          onPress={_handleContinue}
          style={{ borderRadius: 30 }}
          labelStyle={{ color: '#fff', paddingVertical: 5 }}
        >
          Continue
        </Button>
      </View>
    </DefaultView>
  )
}

const styles = StyleSheet.create({
  constellation: {
    zIndex: 0,
    position: 'absolute',
    bottom: 20,
    left: 20,
    opacity: 0.1,
  },
  leo: {
    zIndex: 0,
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.2,
  },
  textContainer: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  textHeadline: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  textText: {
    textAlign: 'center',
    paddingVertical: 5,
  },
  logoContainer: {
    flex: 1,
    alignSelf: 'center',
    paddingVertical: 25,
    zIndex: 1,
  },
  sexContainer: {
    flex: 1,
    paddingHorizontal: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sexText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 35,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
})

export default SexScreen
