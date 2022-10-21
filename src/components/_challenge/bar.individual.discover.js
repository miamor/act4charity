import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Button, useTheme, IconButton, ProgressBar, MD3Colors, Badge } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../paper/typos'
import { useGlobals } from '../../contexts/global'
import PercentageCircle from 'react-native-percentage-circle'


function ChallengeBarDiscoverIndividual(props) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, currentRegion, trackStep, trackMemberLocationStates, trackMemberDistStates, trackMemberStepStates }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const { challenge_accepted_data } = props
  const challengeDetail = challenge_accepted_data.challenge_detail
  const challenge_accepted_id = challenge_accepted_data._id


  return (<>
    <View style={{ flex: 0.17, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, flexDirection: 'column', marginBottom: 10 }}>
      <View style={{ marginTop: 6, flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'transparent' }}>
            <PercentageCircle radius={30} percent={50} color={MD3Colors.primary10}>
              <TextBold style={{ fontSize: 26, lineHeight: 50 }}>
                {Math.round(trackLoc.distanceTravelled * 100) / 100}
              </TextBold>
            </PercentageCircle>
          </View>
        </View>

        <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
          <TextBold style={{ fontSize: 30, lineHeight: 30 }}>
            {'00:08:00'}
          </TextBold>
          <Text style={{ fontSize: 13, marginLeft: 5, lineHeight: 15 }}>Time</Text>
        </View>
      </View>
    </View>
  </>)
}

export default ChallengeBarDiscoverIndividual