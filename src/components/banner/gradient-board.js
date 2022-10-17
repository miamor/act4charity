import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/core'
import PropTypes from 'prop-types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Subheading, Surface, Button, useTheme } from 'react-native-paper'
import LinearGradient from 'react-native-linear-gradient'
import Constellation from '../../svgs/backgrounds/Constellation'
import ConstellationSimple from '../../svgs/backgrounds/ConstellationSimple'
import { Text } from '../paper/typos'

/*                    <GradientBoard
                      // height={210}
                      flex={0.01}
                      paddingRightContent={30}
                      icon="coffee"
                      gradientColors={['#e39207', '#e39207EA', '#e39207AD', '#e392076a']}
                      title={i18n.t('I need your help')}
                      caption={i18n.t('buycofee_banner_desc')}
                      buttonTxt={i18n.t('Buy me a coffee')}
                      onPressButton={() => navigation.navigate('Donate', { key: 'Donate' })}
                    />
*/
function GradientBoard({ style, flex, side, paddingContent, icon, gradientColors, title, caption, buttonTxt, onPressButton }) {
  // const navigation = useNavigation()
  const { colors } = useTheme()
  return (
    <Surface
      style={[
        styles.surfaceRight,
        { backgroundColor: 'transparent' },
        style
      ]}
    >
      <View style={[StyleSheet.absoluteFill, { top: -25, opacity: 0.8 }]}>
        <Constellation
          color={colors.text + '3D'}
          dotColor={colors.accent}
          width={250}
          height={300}
        />
      </View>
      <LinearGradient
        // colors={['transparent', '#eb34eb46', '#eb34eb66', '#eb34ebe6']}
        // colors={['#eb34ebe6', '#eb34eb96', '#eb34eb3d', '#eb34eb0d']}
        colors={gradientColors}
        // colors={[colors.primary+'e6', colors.primary+'96', colors.primary+'3d', colors.primary+'0d']}
        style={[
          side === 'left' ? styles.gradientRight : styles.gradientLeft,
          side === 'left' ? { paddingRight: 80 } : { paddingLeft: 80 }
        ]}
      >
        <View>
          <Subheading
            theme={{ colors: { text: '#FFFFFF' } }}
            numberOfLines={1}
            style={{ fontWeight: 'bold' }}
          >
            {title}
          </Subheading>
          {/* <Caption theme={{ colors: { text: '#FFFFFF' } }}>
          {caption}
        </Caption> */}
          <Text style={{ opacity: .65, fontSize: 12, lineHeight: 19 }}>
            {caption}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
          {side === 'right' && <View style={{ flex: flex }} />}
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Button
              mode="contained"
              icon={icon}
              style={{ borderRadius: 25, marginTop: 0 }}
              theme={{
                colors: { primary: colors.backdrop, text: '#FFFFFF' },
              }}
              labelStyle={{ fontSize: 13, letterSpacing: 0 }}
              onPress={onPressButton}
            >
              {buttonTxt}
            </Button>
          </View>
          {side === 'left' && <View style={{ flex: flex }} />}
        </View>
      </LinearGradient>
    </Surface>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 15,
  },
  adviceContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 25,
    padding: 20,
  },
  adviceClose: { position: 'absolute', top: 20, right: 20, zIndex: 2 },
  surfaceRight: {
    // elevation: 3,
    // height: 160,
    flexDirection: 'row',
    borderRadius: 25,
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  surfaceLeft: {
    // elevation: 3,
    // height: 160,
    flexDirection: 'row-reverse',
    borderRadius: 25,
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  gradientRight: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    flex: 1,
    // flexDirection: 'row',
  },
  gradientLeft: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    flex: 1,
    // flexDirection: 'row',
  },
})

// GradientBoard.propTypes = {
//   style: PropTypes.object,
//   rightButton: PropTypes.element,
//   back: PropTypes.bool
// }

// GradientBoard.defaultProps = {
//   rightButton: <View style={{ width: 1 }} />,
//   back: false
// }

export default GradientBoard
