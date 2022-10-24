import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Headline, TouchableRipple, useTheme } from 'react-native-paper'
import { H3, Text } from '../../components/paper/typos'

import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'
import Female from '../../svgs/Female'
import Male from '../../svgs/Male'

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function SexScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

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
      <View style={styles.textContainer}>
        <H3 style={[styles.textHeadline, { color: colors.primary }]}>
          Your gender
        </H3>
        <Text style={styles.textText}>
        </Text>
      </View>

      <View style={[styles.inputContainer, styles.sexContainer]}>
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
  textContainer: {
    flex: 0.2,
    paddingTop: 50,
    // justifyContent: 'center',
    // alignSelf: 'center',
    paddingHorizontal: 40,
  },
  textHeadline: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  textText: {
    textAlign: 'center',
    paddingVertical: 10,
    lineHeight: 28
  },
  inputContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  sexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sexText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 0.2,
    paddingHorizontal: 40,
    paddingTop: 35,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
})

export default SexScreen
