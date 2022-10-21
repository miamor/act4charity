import React, { PropTypes, Component } from 'react'
import { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Image, ToastAndroid, Dimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ProgressBar, Appbar, useTheme, Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'
import { H2, H3, Text, TextBold } from '../../components/paper/typos'
import * as userAPI from '../../services/userAPI'
import Loading from '../../components/animations/loading'

const TESTDATA = [
  {
    id: '1',
    challengeTitle: 'Walking for them',
    challengeSponsor: 'Boots for all',
    donationAmount: '0.50',
    type: 'walk',
  },
  {
    id: '2',
    challengeTitle: 'All for Chris',
    challengeSponsor: "Children's Health Fund",
    donationAmount: '0.75',
    type: 'walk',
  },
  {
    id: '3',
    challengeTitle: 'Saving Koalas',
    challengeSponsor: 'Animals Australia',
    donationAmount: '0.25',
    type: 'discover',
  },
  {
    id: '4',
    challengeTitle: 'Summer Reading',
    challengeSponsor: 'Indigenous Literacy Foundation',
    donationAmount: '0.30',
    type: 'discover',
  },
]

function RewardScreen() {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const donatedAmount = 246


  const [loading, setLoading] = useState(true)

  const [targetModal, setTargetModalVisibility] = useState(false)
  const [progress, setProgress] = useState(0.5)
  const [donationProgress, setDonationProgress] = useState(246)
  const [finalDonationAmount, setFinalDonationAmount] = useState(500)
  const donationProgressPercentage = donationProgress / finalDonationAmount

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
      console.log('[loadCompletedChallenge] res', res)
      console.log('[loadCompletedChallenge] res', res.data.length)
      setCompletedChallenges(res.data)
      setLoading(false)
    }).catch(error => {
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

      <View style={{ backgroundColor: '#fff' }}>

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
              ${donatedAmount}
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

          <H3 style={{ marginTop: 10, marginBottom: 10 }}>
            Donation Details
          </H3>
        </View>

        {/* <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
              marginBottom: 12,
            }}>
            <TextBold variant="titleSmall">Challenge</TextBold>
            <TextBold variant="titleSmall">Donation</TextBold>
          </View> */}
        {/* {completedChallenges != null && <FlatList
          data={completedChallenges}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />} */}
        <ScrollView style={{ marginBottom: 229, marginTop: 5 }}>
          {completedChallenges != null && completedChallenges.map((item, i) => (<View key={`comp-` + i} style={{
            marginHorizontal: 20,
            marginTop: 10,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignItems: 'center',
          }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {item.challenge_detail.type == 'walk' ? <Image
                style={{ height: 46, width: 46, marginTop: 0 }}
                source={require('../../../assets/icons/walking.png')}
              /> : <Image
                style={{ height: 46, width: 46, marginTop: 0 }}
                source={require('../../../assets/icons/discover.png')}
              />}
              <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginLeft: 12 }}>
                <Text style={{ color: colors.primary, lineHeight: 22, marginBottom: 8 }} variant="titleMedium">{item.challenge_detail.name}</Text>
                <Text style={{ color: '#d2d2d2', fontSize: 14, lineHeight: 16 }} variant="bodyMedium">
                  {item.challenge_detail.sponsor_detail.name}
                </Text>
              </View>
            </View>
            <Text>${item.challenge_detail.donation}</Text>
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
