import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Headline, useTheme } from 'react-native-paper'
import { H3, Text } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import SpaceSky from '../../components/decorations/space-sky'
import CustomInput from '../../components/paper/custom-input'
import { useGlobals } from '../../contexts/global'
import { Backgrounds } from '../../svgs'
import Aquarius from '../../svgs/Aquarius'

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function NameScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const [name, setName] = React.useState()
  const { colors } = useTheme()

  const buttonDisabled = !name || name.length < 2
  const _handleContinue = () => {
    dispatch({
      type: 'setLoggedUser',
      loggedUser: {
        ...loggedUser,
        name: name
      },
    })
    navigation.push('Sex')
  }

  return (
    <DefaultView>
      <View style={styles.textContainer}>
        <H3 style={[styles.textHeadline, { color: colors.primary }]}>
          What's your name?
        </H3>
        <Text style={styles.textText}>
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <CustomInput
          value={name}
          placeholder="Write here"
          onChangeText={(text) => setName(text)}
          style={{ fontSize: 12 }}
          maxLength={20}
        />
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
  aquarius: {
    zIndex: 0,
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.2,
  },
  textContainer: {
    flex: 1.3,
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
    paddingVertical: 10,
    lineHeight: 28
  },
  logoContainer: {
    flex: 1,
    alignSelf: 'center',
    paddingVertical: 40,
    zIndex: 1,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 20,
    opacity: 0.9,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 35,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
})

export default NameScreen
