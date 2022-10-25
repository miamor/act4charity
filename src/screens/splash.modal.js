import React from 'react'
import { View, Image, StyleSheet, Dimensions } from 'react-native'
import { Text } from '../components/paper/typos'

function SplashModal(props) {
  const { height } = Dimensions.get('window')

  setTimeout(() => {
    // navigation.navigate('Onboarding')
    props.onFinishSpash()
  }, 2000)

  return (
    <View style={{
      // position: 'absolute',
      // top:0, left:0, right:0, bottom:0,
      height: height,
      backgroundColor: '#6750A4',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Image
        style={{
          resizeMode: 'contain',
          width: '100%',
          height: 260,
        }}
        source={require('../../assets/images/splash.png')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
})

export default SplashModal
