import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TextInput as Input, useTheme } from 'react-native-paper'

/**
 * @param props
 * @returns {*}
 * @constructor
 */
function CustomTextInput({ errorText, description, ...props }) {
  const { colors } = useTheme()
  return (
    <View style={styles.container}>
      <Input
        style={[{ backgroundColor: colors.surface }, styles.input]}
        selectionColor={colors.primary}
        underlineColor="transparent"
        mode="outlined"
        {...props}
      />
      {description && !errorText ? (
        <Text style={[{ color: colors.secondary }, styles.description]}>{description}</Text>
      ) : null}
      {errorText ? <Text style={[{ color: colors.error }, styles.error]}>{errorText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
  },
  description: {
    fontSize: 13,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    paddingTop: 8,
  },
})

export default CustomTextInput
