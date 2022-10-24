import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { TextInput as PaperTextInput, useTheme } from 'react-native-paper'

/**
 * @param props
 * @returns {*}
 * @constructor
 */
function CustomInput(props) {
  const { colors } = useTheme()
  const maxLength = props.keyboardType === 'number-pad' ? 5 : null
  return (
    // <TextInput
    //   {...props}
    //   style={[styles.inputCustom, props.customStyle]}
    //   maxLength={maxLength}
    // />
    <PaperTextInput
      {...props}
      style={[styles.input, { borderBottomWidth: 0 }, props.inputStyle]}
      render={(props) => (
        <TextInput
          {...props}
          style={[styles.inputCustom, props.customStyle]}
          maxLength={maxLength}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  inputCustom: {
    textAlign: 'center',
    marginTop: 10,
    color: 'black',
    fontSize: 30,
  },
  input: {
    borderRadius: 5,
    fontSize: 30,
    textAlign: 'center',
    justifyContent: 'flex-end',
  },
})

export default CustomInput
