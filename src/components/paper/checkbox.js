import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
// import CheckBox from '@react-native-community/checkbox'
import { Text } from './typos'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from 'react-native-paper'

const Checkbox = ({ label, iconSize, iconStyle, lblStyle, checked, onPress, ...props }) => {
  const { colors } = useTheme()

  //console.log('[Checkbox] checked === true', checked === true)
  return (
    // <View>
    //   <CheckBox
    //     type={'checkbox'}
    //     {...props}
    //   />
    //   {label}
    // </View>
    <TouchableOpacity onPress={onPress} style={{
      flexDirection: 'row',
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor:'#0f0',
      // opacity: checked === true ? 1 : 0.1
    }}>
      <MaterialCommunityIcons size={iconSize == null ? 28 : iconSize} name={checked === true ? 'checkbox-marked' : 'checkbox-blank'} color={checked === true ? colors.primary : '#fff'} style={[iconStyle, {
        opacity: checked === true ? 1 : 0.5
      }]} />
      <Text style={[{
        // textAlign:'center',
        // flex: 1, 
        marginLeft: 5, 
        color: checked === true ? colors.primary : '#fff',
        opacity: checked === true ? 1 : 0.5
      }, lblStyle]}>{label}</Text>
    </TouchableOpacity>
  )
}

export default React.memo(Checkbox)