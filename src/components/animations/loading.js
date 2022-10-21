import React from 'react'
import { View, Text } from 'react-native'
import Rotation from './rotation'
import SolarSystem from '../../svgs/SolarSystem'

function Loading({ }) {
  return (
    <View style={{ position: 'absolute', backgroundColor: '#00000097', zIndex: 999, top: 0, left: 0, bottom: 0, right: 0 }}>
      <Rotation style={{ position: 'absolute', top: '40%', flex: 1, alignSelf: 'center', opacity: 0.7 }} rotate>
        <SolarSystem />
      </Rotation>
    </View>
  )
}

export default Loading