import PropTypes from 'prop-types'
import React from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'

// import { useIsDark } from '../../hooks/use-theme'

/**
 * @param style {object}
 * @returns {*}
 * @constructor
 */
function SpaceSky({ style, level }) {
  const isDark = false //useIsDark()
  const { height, width } = Dimensions.get('window')
  return (
    <View style={[styles.container, { opacity: isDark ? 0.8 : 0.3 }, style]}>
      {/* <Image
        style={{
          position: 'absolute',
          top: 60, left: 0, right: 0, bottom: 0,
          opacity: level === 1 ? 0.02 : 0.05,
          height: height,
          width,
        }}
        resizeMethod="auto"
        source={require('./images/bg9.jpg')}
      />
      <Image
        style={{
          position: 'absolute',
          top: 60, left: 0, right: 0, bottom: 0,
          opacity: level === 1 ? 0.09 : 0.11,
          // marginTop: -50, 
          height,
          width
        }}
        source={require('./images/bg12.jpg')}
      />
      <Image
        style={{
          position: 'absolute',
          top: 60, left: 0, right: 0, bottom: 0,
          opacity: level === 1 ? 0.08 : 0.11,
          // marginTop: -50,
          height,
          width
        }}
        source={require('./images/bg4.jpg')}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -60,
    left: 0,
    right: 0,
  },
})

SpaceSky.defaultProps = {
  level: 0,
}

SpaceSky.PropsType = {
  style: PropTypes.object,
  level: PropTypes.number
}

export default SpaceSky
