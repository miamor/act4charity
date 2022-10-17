import i18n from 'i18n-js'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import { H3, Text, TextBold } from '../paper/typos'
import { useGlobals } from '../../contexts/global'
import { useIsDark } from '../../hooks/use-theme'
import { useNavigation } from '@react-navigation/core'

/**
 * @param props
 * @returns {*}
 * @constructor
 */
function UpgradeModal({ astroData, title, onCloseModal, style, ...props }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const isDark = useIsDark()
  const navigation = useNavigation()


  React.useEffect(() => {
  }, [])


  return (<>
    <View
      presentationStyle="overFullScreen"
      // animationType="slide"
      transparent={true}
      style={{
        position: 'absolute',
        top: 0, bottom: 0, right: 0, left: 0,
        marginTop: 0,
        backgroundColor: 'rgba(0,0,0,.85)',
        // backgroundColor: '#fff',
        zIndex: 100,
      }}>
      <View style={{
        // flex: 1,
        // flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        borderRadius: 36,
        backgroundColor: isDark ? '#0000008a' : '#fff',
        borderColor: isDark ? colors.primary + '5a' : '#000' + '5a',
        borderWidth: isDark ? 1 : 0,
        // width: 300,
        position: 'absolute',
        // top: '35%',
        bottom: -1,
        left: -1, right: -1,
        paddingLeft: 15,
        paddingRight: 15
      }}>
        <View style={{
          color: '#333',
          paddingVertical: 20,
          paddingHorizontal: 15,
          borderBottomWidth: 1,
          borderBottomColor: colors.primary + '7a',
            opacity: .7
          // padding: '18px 0 16px', 
          // margin: '0 15px', 
          // borderBottom: '1px solid #e0e0e0', 
          // fontSize: 19 
        }}>
          <H3>{i18n.t('Upgrade')}</H3>
        </View>

        <View style={{ flexDirection: 'column' }}>
          <ScrollView style={{ marginTop: 30, marginBottom: 30 }}>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <H3>Unlock premium today !</H3>
            </View>

            <View style={{ flex: 1, marginHorizontal: 30, marginTop: 10 }}>
              <View style={styles.row}>
                <MaterialCommunityIcons name="check" size={26} color="#fff" style={styles.icon} />
                <Text>Ad free</Text>
              </View>
              <View style={styles.row}>
                <MaterialCommunityIcons name="check" size={26} color="#fff" style={styles.icon} />
                <Text>Unlimited profiles</Text>
              </View>
              <View style={styles.row}>
                <MaterialCommunityIcons name="check" size={26} color="#fff" style={styles.icon} />
                <Text>Advanced content</Text>
              </View>
              <View style={styles.row}>
                <MaterialCommunityIcons name="check" size={26} color="#fff" style={styles.icon} />
                <Text>+1000 coin</Text>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 30, }}>
              <View style={{
                backgroundColor: 'transparent',
                padding: 5,
                borderRadius: 16,
                borderWidth: 2,
                  borderColor: colors.primary,
              }}>
                <TouchableOpacity style={{
                  backgroundColor: '#fff',
                  // borderWidth: 2,
                  // borderColor: colors.primary,
                  paddingHorizontal: 20,
                  paddingTop: 8,
                  paddingBottom: 14,
                  borderRadius: 12,
                  // flex: 1
                  flexDirection: 'row'
                }}>
                  <MaterialCommunityIcons name="check" size={36} color={colors.primary} style={{ marginTop: 12, marginRight: 10 }} />
                  <View>
                    <Text style={{ fontSize: 16, color: '#111' }}>3 months $4.99 / month</Text>
                    <TextBold style={{ fontSize: 18, color: colors.primary }}>$14.99 / 3 months</TextBold>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity style={{
                marginTop: 30,
                backgroundColor: colors.primary,
                paddingHorizontal: 50,
                paddingTop: 10,
                paddingBottom: 14,
                borderRadius: 30,
                // flex: 1
              }}>
                <Text style={{ fontSize: 18 }}>Upgrade now</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>

        <TouchableOpacity style={{ zIndex: 10, position: 'absolute', right: 20, top: 20, opacity: .8, fontWeight: 'bold' }} onPress={onCloseModal}>
          <MaterialCommunityIcons size={32} name="close" color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  </>)
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 10
  },
  icon: {
    marginTop: 4,
    marginRight: 7
  }
})

export default React.memo(UpgradeModal)
