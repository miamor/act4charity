import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Headline, useTheme } from 'react-native-paper'
import { H3, Text } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import CustomInput from '../../components/paper/custom-input'
import { useGlobals } from '../../contexts/global'
import CustomTextInput from '../../components/paper/custom-text-input'

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function NameScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [name, setName] = React.useState()

  const buttonDisabled = !name || name.length < 2
  const _handleContinue = () => {
    dispatch({
      type: 'setLoggedUser',
      loggedUser: {
        ...loggedUser,
        firstname: name
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
        <CustomTextInput
          value={name}
          placeholder="Write here"
          onChangeText={(text) => setName(text)}
          style={{ fontSize: 20, paddingVertical: 10 }}
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
    // alignItems: 'center',
    paddingHorizontal: 40,
  },
  buttonContainer: {
    flex: 0.2,
    paddingHorizontal: 40,
    paddingTop: 35,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
})

export default NameScreen
