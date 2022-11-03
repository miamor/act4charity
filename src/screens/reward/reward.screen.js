import React, { PropTypes, Component } from 'react'
import { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Image, ToastAndroid, Dimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ProgressBar, Appbar, useTheme, Button, Badge, MD3Colors } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'
import { H2, H3, Text, TextBold } from '../../components/paper/typos'
import * as userAPI from '../../services/userAPI'
import Loading from '../../components/animations/loading'
import { diffTime, msToTime, secToTime } from '../../utils/timer'


function RewardScreen() {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCompletedChallenge()
  }, [])

  // useEffect(() => {
  //   if (completedChallenges != null) {
  //     setLoading(false)
  //   }
  // }, [completedChallenges])


  /* **********************************************
   *
   * Load my completed challenge
   *
   * **********************************************/
  const [completedChallenges, setCompletedChallenges] = useState()
  const loadCompletedChallenge = () => {
    userAPI.getCompletedChallenge({ num_per_page: 100 }).then((res) => {
      // console.log('[reward][loadCompletedChallenge] res', res)
      setCompletedChallenges(res.data)
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }

  const { height } = Dimensions.get('window')

  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Past Donations" color={colors.primary} />
      </Appbar.Header>

      {loading && <Loading />}

      <View style={{ backgroundColor: 'transparent' }}>

        <View style={{ height: 165, paddingHorizontal: 20 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 24,
          }}>
            <Image
              source={require('../../../assets/images/Coins.png')}
              style={{ width: 66, height: 48 }}
            />
            <TextBold style={{ color: colors.primary, marginLeft: 16, fontSize: 38, lineHeight: 55, marginTop: 4 }} variant="displayMedium">
              ${loggedUser.current_donation}
            </TextBold>
          </View>
          <Text variant="labelSmall"
            style={{
              color: colors.secondary,
              alignSelf: 'center',
              marginTop: 1,
            }}>
            Donated so far
          </Text>

          <H3 style={{ marginTop: 15, marginBottom: 0 }}>
            Donation Details
          </H3>
        </View>

        <ScrollView style={{ marginBottom: 229, marginTop: 0, paddingHorizontal: 20 }}>
          {completedChallenges != null && completedChallenges.map((item, i) => (<View key={`comp-` + i}
            style={{
              // marginHorizontal: 20,
              marginTop: 10,
              marginBottom: 10,
              flexDirection: 'row',
              // justifyContent: 'space-between',
              // alignItems: 'center',
            }}>
            <View>
              <Image
                style={{ height: 46, width: 46, marginTop: -1 }}
                source={item.challenge_detail.type == 'walk' ? require('../../../assets/icons/walking.png') : require('../../../assets/icons/discover.png')}
              />
              <Badge style={{
                paddingHorizontal: 6, 
                position: 'absolute', 
                left: 0, top: 36,
                fontSize: 8, lineHeight: 9, height: 14,
                backgroundColor: item.mode === 'individual' ? MD3Colors.primary40 : MD3Colors.primary25
              }}>{item.mode}</Badge>
            </View>

            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 6 }}>
              <Text style={{ color: colors.primary, lineHeight: 21, marginBottom: 3 }} variant="titleMedium">{item.challenge_detail.name}</Text>

              {item.time_started != null && item.time_completed != null && item.time_started.length > 0 && item.time_completed.length > 0 && (<Text style={{ color: '#c5c5c5', fontSize: 14, lineHeight: 18 }} variant="bodyMedium">
                completed in {diffTime(new Date(item.time_completed), new Date(item.time_started))}
              </Text>)}

              <Text style={{ color: '#c5c5c5', fontSize: 14, lineHeight: 18 }} variant="bodyMedium">
                Donated to <Text style={{color: '#888', fontSize: 14, lineHeight: 18}}>{item.challenge_detail.charity_detail.name}</Text>
              </Text>
              <Text style={{ color: '#c5c5c5', fontSize: 14, lineHeight: 18 }} variant="bodyMedium">
                by <Text style={{color: '#888', fontSize: 14, lineHeight: 18}}>{item.challenge_detail.sponsor_detail.name}</Text>
              </Text>
            </View>

            <Text>${item.donation != null ? item.donation : item.challenge_detail.donation}</Text>
          </View>))}
        </ScrollView>
      </View>
    </DefaultView>
  )
}

const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginRight: 24,
  },
  renderItemStyle: {
    backgroundColor: '#FFFBFE',
    borderRadius: 12,
    marginBottom: 8,
  },
})

export default RewardScreen
