import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Button, useTheme, IconButton, ProgressBar, MD3Colors, Badge } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../paper/typos'
import { useGlobals } from '../../contexts/global'
import PercentageCircle from 'react-native-percentage-circle'


function ChallengeBarWalkTeam(props) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, currentRegion, trackStep, trackMemberLocationStates, trackMemberDistStates, trackMemberStepStates }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const { challenge_accepted_data } = props
  const challengeDetail = challenge_accepted_data.challenge_detail
  const challenge_accepted_id = challenge_accepted_data._id


  return (<>
    <View style={{ flex: 0.18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, flexDirection: 'column', marginBottom: 20 }}>
      <View style={{ marginTop: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <TextBold style={{ fontSize: 30, lineHeight: 30 }}>00:08:00</TextBold>
        <Text style={{ fontSize: 13, marginLeft: 5, lineHeight: 30 }}>Time</Text>
      </View>
      {/* <View style={{ width: windowWidth }}>
              <ProgressBar progress={0.5} color={MD3Colors.primary0} />
            </View> */}

      <View style={{ marginTop: 6, flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'transparent' }}>
            <PercentageCircle radius={30} percent={50} color={MD3Colors.primary10}>
              <TextBold style={{ fontSize: 26, lineHeight: 50 }}>
                {Object.values(trackMemberDistStates).length === 0 ? 0
                  : Math.round(Object.values(trackMemberDistStates).reduce((a, b) => a + b, 0) * 100) / 100}
              </TextBold>
            </PercentageCircle>
            <Badge style={{ position: 'absolute', zIndex: 1, top: 0 }}>
              {Math.round(trackLoc.distanceTravelled * 100) / 100}
            </Badge>
          </View>
        </View>

        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'transparent' }}>
            <PercentageCircle radius={30} percent={50} color={MD3Colors.primary20}>
              <TextBold style={{ fontSize: 26, lineHeight: 50 }}>
                {Object.values(trackMemberStepStates).length === 0 ? 0
                  : Object.values(trackMemberStepStates).reduce((a, b) => a + b, 0)}
              </TextBold>
            </PercentageCircle>
            <Badge style={{ position: 'absolute', zIndex: 1, top: 0 }}>
              {trackStep.currentStepCount}
            </Badge>
          </View>
        </View>
      </View>
    </View>
  </>)
}

export default ChallengeBarWalkTeam