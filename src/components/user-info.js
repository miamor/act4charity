import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useState } from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import { Text } from './paper/typos'
import { levels_ranges } from '../utils/vars'
import { useNavigation } from '@react-navigation/core'

function UserInfo({ user_detail, color }) {
  const navigation = useNavigation()

  const level = Math.floor(user_detail.current_reward / 100)
  const lvlInfo = level < levels_ranges.length ? levels_ranges[level] : levels_ranges[levels_ranges.length - 1]

  const toUserWall = () => {
    navigation.navigate('_UserWall', { key: '_UserWall', user_id: user_detail._id })
  }

  // console.log('[UserInfo] user_detail', user_detail, ' | level =', level, ' | lvlInfo', lvlInfo)
  return (
    <TouchableOpacity onPress={toUserWall} style={{ flexDirection: 'row' }}>
      <Text style={{ color: color }}>{user_detail.username}</Text>

      <Image source={lvlInfo.image} style={{ width: 24, height: 24, marginTop: 5 }} />
      {/* <Text style={{ color: '#888', fontSize: 10, marginTop: 2 }}>{lvlInfo.title}</Text> */}
      {/* <Text style={{ color: '#888', fontSize: 10, marginTop: 2 }}>Level {level}</Text> */}
      <Text style={{ color: '#888', fontSize: 11, marginTop: 2 }}>${user_detail.current_donation}</Text>
    </TouchableOpacity>
  )
}

export default UserInfo