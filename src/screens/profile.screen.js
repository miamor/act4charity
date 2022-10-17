import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import Constants from 'expo-constants'
import i18n from 'i18n-js'
import React from 'react'
import { StyleSheet, View, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native'
import {
  Avatar,
  Button,
  Divider,
  Switch,
  Title,
  useTheme,
} from 'react-native-paper'
import { Text } from '../components/paper/typos'
import Close from '../components/navs/close'
import { useGlobals } from '../contexts/global'
import useRate from '../hooks/use-rate'
import useShare from '../hooks/use-share'
// import { useIsDark } from '../hooks/use-theme'
import { Backgrounds } from '../svgs'
import { DateUtils } from '../utils'
import PlatformUtils from '../utils/platform'
import Storer from '../utils/storer'
import SpaceSky from '../components/decorations/space-sky'
import Rotation from '../components/animations/rotation'
import SolarSystem from '../svgs/SolarSystem'
import * as userAPI from '../services/userAPI'
import { LOGGED_USER_KEY, TOKEN_KEY } from '../constants/keys'
import Clipboard from '@react-native-clipboard/clipboard'
import UpgradeModal from '../components/banner/upgrade-modal'

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ProfileScreen({ navigation }) {
  const [{ session, loggedUser }, dispatch] = useGlobals()
  const { name, sex } = session
  const { colors } = useTheme()
  const { setRate } = useRate()
  const { setStartShare } = useShare(
    i18n.t(
      'Try Astrale, the most precise horoscopes app in this existential plain'
    ),
    'https://play.google.com/store/apps/details?id=josep.astrale'
  )
  const [isShare, setIsShare] = React.useState(false)
  // const isDark = useIsDark()

  const isAndroid = PlatformUtils.isAndroid
  // const _handleDarkThemeChange = () => {
  //   dispatch({
  //     type: 'switchTheme',
  //     // theme: isDark ? 'light' : 'dark',
  //   })
  // }
  const _handleLogOut = async () => {
    await Storer.delete(LOGGED_USER_KEY)
    await Storer.delete(TOKEN_KEY)
    dispatch({ type: 'setLogOut' })
  }
  const _handleRatePress = async () => setRate(true)
  const _handleSharePress = async () => {
    setStartShare(true)
    setIsShare(true)
  }

  const [loaded, setLoaded] = React.useState(false)


  React.useEffect(() => {
  }, [loaded])


  const [showUpgrade, setShowUpgrade] = React.useState(false)
  const onCloseModal = React.useCallback(() => {
    setShowUpgrade(false)
  })

  return (
    <View style={[
      StyleSheet.absoluteFill,
      // {backgroundColor: '#00000050'},
      isShare && {
        // backgroundColor: isDark ? '#000000ef' : '#ffffffef'
        backgroundColor: '#000'
      }
    ]}>
      <SpaceSky level={1} />
      <Backgrounds.Telescope color={colors.text} style={styles.telescope} />
      <Close position="right" />

      {showUpgrade && (<UpgradeModal onCloseModal={() => onCloseModal()} />)}

      <View style={styles.headerContainer}>
        <Avatar.Text label={name.substring(0, 1)} />
        <View style={{ marginLeft: 15 }}>
          <Title>{session.name}</Title>
        </View>
        <View style={{ position: 'absolute', bottom: -5, right: -10 }}>
          {loggedUser.premium <= 0 ? (<Button onPress={() => setShowUpgrade(true)}>
            {i18n.t('Upgrade')}
          </Button>) : (<View style={{ flexDirection: 'row', marginBottom: 5, opacity: .9 }}>
            <MaterialCommunityIcons name="diamond" size={24} color="#fff" style={{marginRight: 5, marginTop: 5}} />
            <Text>Premium</Text>
          </View>)}
        </View>
      </View>
      <Divider style={{ marginTop: 15 }} />

      <View style={styles.detailsContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="gender-transgender"
            color={colors.text}
            size={18}
          />
          <Text style={{ marginLeft: 10 }}>{i18n.t(sex)} </Text>
        </View>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="heart-circle"
            color={colors.text}
            size={18}
          />
          <Text style={{ marginLeft: 10 }}>{i18n.t(relationship)} </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="dice-6" color={colors.text} size={18} />
          <Text style={{ marginLeft: 10 }}>{number} </Text>
        </View> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="cash" color={colors.text} size={24} style={{ marginTop: 2 }} />
          <Text style={{ marginLeft: 4 }}>{loggedUser.bcoin} </Text>
        </View>
      </View>
      <Divider style={{ marginTop: 15 }} />

      <View style={styles.buttonsContainer}>
        <Button
          onPress={_handleSharePress}
          icon="account-multiple"
          style={{ marginTop: 2 }}
          labelStyle={styles.buttonsLabel}
          uppercase={false}
          contentStyle={{ justifyContent: 'flex-start' }}
        >
          <Text>{i18n.t('Share with your friends')}</Text>
        </Button>
        <Button
          onPress={_handleRatePress}
          icon="message-draw"
          style={{ marginTop: 2 }}
          labelStyle={styles.buttonsLabel}
          uppercase={false}
          contentStyle={{ justifyContent: 'flex-start' }}
        >
          <Text>{i18n.t('Rate the app')}</Text>
        </Button>
        <Button
          onPress={() => navigation.navigate('Donate')}
          icon="coffee"
          style={{ marginTop: 2 }}
          labelStyle={styles.buttonsLabel}
          uppercase={false}
          contentStyle={{ justifyContent: 'flex-start' }}
        >
          <Text>{i18n.t('Buy me a coffee')}</Text>
        </Button>
        <Button
          onPress={() => _handleLogOut()}
          icon="logout"
          style={{ marginTop: 2 }}
          labelStyle={styles.buttonsLabel}
          uppercase={false}
          contentStyle={{ justifyContent: 'flex-start' }}
        >
          <Text>{i18n.t('Logout')}</Text>
        </Button>
        {/* {__DEV__ && (
          <Button
            onPress={_handleLogOut}
            icon="restart"
            style={{ marginTop: 2 }}
            labelStyle={styles.buttonsLabel}
            uppercase={false}
            contentStyle={{ justifyContent: 'flex-start' }}
          >
            <Text>{i18n.t('Restart')}</Text>
          </Button>
        )} */}
      </View>

      {/* <Divider style={{ marginTop: 10 }} />
      <View style={styles.optionsContainer}>
        <View style={styles.optionsOption}>
          <Button
            icon="brightness-6"
            style={styles.optionsButton}
            labelStyle={styles.optionsLabel}
            uppercase={false}
            theme={{ colors: { primary: colors.text } }}
          >
            <Text>{i18n.t('Dark theme')}</Text>
          </Button>
          <Switch onChange={_handleDarkThemeChange} value={isDark} />
        </View>
      </View> */}

      <Divider style={{ marginTop: 2 }} />
      {/* <View
        style={[
          {
            position: 'absolute',
            bottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          },
        ]}
      > */}
      <View style={[styles.optionsOption, {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
      }]}>
        <Text>v1.0</Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  telescope: {
    zIndex: 0,
    position: 'absolute',
    top: 50,
    right: 20,
    opacity: 0.15,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  headerHeadline: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  detailsContainer: {
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  detailsLabel: {
    marginLeft: 23,
    fontSize: 18,
  },
  featuredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredView: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 25,
  },
  buttonsContainer: {
    marginHorizontal: 20,
    justifyContent: 'flex-start',
    // backgroundColor: '#00f',
    marginTop: 10,
  },
  buttonsLabel: {
    marginTop: 4,
    marginBottom: 7,
    // marginLeft: 23,
    fontSize: 18,
    // paddingVertical: 0,
    // lineHeight: 10
  },
  optionsContainer: {
    marginHorizontal: 20,
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
  },
  optionsOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsButton: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  optionsLabel: {
    marginLeft: 23,
    fontSize: 18,
  },
})

export default ProfileScreen
