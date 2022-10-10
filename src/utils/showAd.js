import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
// import { RewardedAd, RewardedAdEventType, TestIds } from '@react-native-firebase/admob'

import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType, RewardedAd, RewardedAdEventType } from '@react-native-firebase/admob'
// import { AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded } from 'react-native-admob'

import { Text } from '../components/paper/typos'

import * as userAPI from '../services/userAPI'

// AD UNIT ID FOR REWARDED AD
// const rewardedAdIDs = Platform.select({
//   android: " ca-app-pub-5199319830148150/4812935911",
// })
// const bannerAdIDs = Platform.select({
//   android: " ca-app-pub-5199319830148150/9813033031",
// })
const interstitialAdIDs = "ca-app-pub-5199319830148150/9776354459"
const rewardedAdIDs = "ca-app-pub-5199319830148150/4812935911"
const bannerAdIDs = "ca-app-pub-5199319830148150/9813033031"

const interstitialAdID = TestIds.INTERSTITIAL
const rewardedAdID = TestIds.REWARDED
const bannerAdID = TestIds.BANNER


const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdIDs, {
  // requestNonPersonalizedAdsOnly: true,
  // keywords: ['fashion', 'clothing'],
})
const rewardAd = RewardedAd.createForAdRequest(rewardedAdIDs, {
  // requestNonPersonalizedAdsOnly: true,
  // keywords: ['fashion', 'clothing'],
})


// function showRewardAd(onFinishAdSuccess, onFinishAdFailed) {
//   AdMobRewarded.setAdUnitID(rewardedAdID)
//   AdMobRewarded.requestAdAsync().then(() => {
//     AdMobRewarded.showAdAsync().catch((e) => console.log(e.message))
//   })
// }

export function BannerAdView() {
  // console.log('bannerAdID', bannerAdID)
  // console.log('bannerAdIDs', bannerAdIDs)
  return (<View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
    {/* <Text>Hello</Text> */}
    <BannerAd unitId={bannerAdIDs}
      // size='320x50'
      size={BannerAdSize.SMART_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: true, }}
      onAdLoaded={() => { console.log('Advert loaded')}}
      onAdFailedToLoad={(error) => { console.error('Advert failed to load: ', error)}}
    />
  </View>)
}


// export function loadInterstitialAd(onSuccess, onFailed) { 
//   interstitialAd.onAdEvent((type, error) => {
//     if (type === AdEventType.LOADED) {
//       //console.log('InterstitialAd adLoaded')
//     } else if (type === AdEventType.ERROR) {
//       console.warn('InterstitialAd => Error')
//     } else if (type === AdEventType.OPENED) {
//       //console.log('InterstitialAd => adOpened')
//     } else if (type === AdEventType.CLICKED) {
//       //console.log('InterstitialAd => adClicked')
//     } else if (type === AdEventType.LEFT_APPLICATION) {
//       //console.log('InterstitialAd => adLeft_App')
//     } else if (type === AdEventType.CLOSED) {
//       //console.log('InterstitialAd => adClosed')
//       interstitialAd.load()
//     }
//   })

//   interstitialAd.load()

//   return interstitialAd
// }

// export function showInterstitialAd(interstitialAd, onSuccess, onFailed) { 
//   if (interstitialAd.loaded) {
//     interstitialAd.show().catch(error => console.warn(error))
//   }
// }


// export function loadRewardAd(onSuccess, onFailed) { 
//   rewardAd.onAdEvent((type, error, reward) => {
//     if (type === RewardedAdEventType.LOADED) {
//       //console.log('RewardedAdEventType adLoaded')
//     } else if (type === RewardedAdEventType.ERROR) {
//       console.warn('RewardedAdEventType => Error')
//     } else if (type === RewardedAdEventType.OPENED) {
//       //console.log('RewardedAdEventType => adOpened')
//     } else if (type === RewardedAdEventType.CLICKED) {
//       //console.log('RewardedAdEventType => adClicked')
//     } else if (type === RewardedAdEventType.LEFT_APPLICATION) {
//       //console.log('RewardedAdEventType => adLeft_App')
//     } else if (type === RewardedAdEventType.EARNED_REWARD) {
//       //console.log('RewardedAdEventType => adReward', reward)
//     } else if (type === RewardedAdEventType.CLOSED) {
//       //console.log('RewardedAdEventType => adClosed')
//       rewardAd.load()
//     }
//   })

//   rewardAd.load()

//   return rewardAd
// }

// export function showRewardAd(ad, onSuccess, onFailed) { 
//   if (ad.loaded) {
//     ad.show().catch(error => {
//       console.warn(error)
//     })
//   }
// }


export const showRewardedAd = async (onSuccess, onFailed) => {
  const rewarded = RewardedAd.createForAdRequest(rewardedAdIDs, {
    requestNonPersonalizedAdsOnly: false
  })
  var loaded = false
  var gotReward = false

  const eventListener = rewarded.onAdEvent((type, error, reward) => {
    if (type === RewardedAdEventType.LOADED) {
      rewarded.show()
      loaded = true
      //console.log('RewardedAdEventType LOADED')
    }
    else if (type === RewardedAdEventType.CLOSED) {
      gotReward = false
      //console.log('RewardedAdEventType CLOSED')
      onFailed()
    }
    else if (type === RewardedAdEventType.EARNED_REWARD) {
      gotReward = true
      //console.log('RewardedAdEventType EARNED_REWARD')

      userAPI.finishedWatchingAd().then((res) => {
        //console.log('[finishedWatchingAd] res', res)
        // setLoading(false)
        // Storer.set(LOGGED_USER_KEY, res).then(() => {
        // })
        if (res.status === 'error') {
          onFailed()
        } else {
          onSuccess()
        }
      }).catch(error => {
        //console.error(error)
        onFailed()
        // ToastAndroid.show('Oops! Bad day bruh!', ToastAndroid.SHORT)
      })
    }
    else {
      if (error) {
        console.warn(error)
      }
      onFailed()
    }
  })

  rewarded.load()

  while (!loaded) {
    await new Promise((resolve, reject) => setTimeout(resolve, 1000))
  }

  return gotReward
}


// export function showRewardAd(onSuccess, onFailed) { 
//   // Create a new instance 
//   const rewardAd = RewardedAd.createForAdRequest(TestIds.REWARDED)

//   // Add event handlers 
//   rewardAd.onAdEvent((type, error) => {
//     if (type === RewardedAdEventType.LOADED) { 
//       rewardAd.show()
//     }
    
//     if (type === RewardedAdEventType.EARNED_REWARD) {
//       //console.log('User earned reward of 3 stars')
//       // Alert.alert( 'New Reward', 'You just earned a reward of 3 stars', [ {text: 'OK', onPress: () => console.log('OK Pressed')}, ], { cancelable: true } ) 
//     }
//   })
  
//   // Load a new advert 
//   rewardAd.load()
// }

// export function showRewardAd(onSuccess, onFailed) {
//   console.log('rewardedAdID', rewardedAdID)
//   console.log('rewardedAdIDs', rewardedAdIDs)
//   // console.log('[showRewardAd] DONE ! Reward user 5 point ! updateDB')

//   // AdMobRewarded.setAdUnitID(rewardedAdID)
//   // AdMobRewarded.requestAdAsync().then(() => {
//   //   AdMobRewarded.showAdAsync().catch((e) => console.log(e.message))
//   // })

//   const rewarded = RewardedAd.createForAdRequest(rewardedAdID, {
//     requestNonPersonalizedAdsOnly: true,
//   })

//   rewarded.onAdEvent((type, error, reward) => {    
//     if (type === RewardedAdEventType.LOADED) {
//       rewarded.show()
//     }
    
//     if (type === RewardedAdEventType.EARNED_REWARD) {
//       //console.log('User earned reward of ', reward)

//       userAPI.finishedWatchingAd().then((res) => {
//         //console.log('[finishedWatchingAd] res', res)
//         // setLoading(false)
//         // Storer.set(LOGGED_USER_KEY, res).then(() => {
//         // })
//         if (res.status === 'error') {
//           onFailed()
//         } else {
//           onSuccess()
//         }
//       }).catch(error => {
//         //console.error(error)
//         onFailed()
//         // ToastAndroid.show('Oops! Bad day bruh!', ToastAndroid.SHORT)
//       })
    
//     }
//   })
  
//   if (!rewarded.loaded) {
//     //console.log('[showRewardAd] rewarded.loaded', rewarded.loaded)
//     rewarded.load()
//   }


//   // console.log('User earned reward of 5 lives')
//   // Alert.alert(
//   //   'Reward Ad',
//   //   'You just earned a reward of 5 lives',
//   //   [
//   //     { text: 'OK', onPress: () => console.log('OK Pressed') },
//   //   ],
//   //   { cancelable: true }
//   // )
// }


