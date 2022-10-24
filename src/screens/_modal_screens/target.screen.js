import React, { PropTypes, Component } from 'react'
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  ToastAndroid,
} from 'react-native'
import { ProgressBar, Button, RadioButton, useTheme, Appbar } from 'react-native-paper'
import Loading from '../../components/animations/loading'
import { DefaultView } from '../../components/containers'
import { Text } from '../../components/paper/typos'
import { useGlobals } from '../../contexts/global'

import * as userAPI from '../../services/userAPI'
import Storer from '../../utils/storer'


const targetText =
  'As a personal goal, you can define your own target amount to complete in a period of time. Challenge yourself!'

function TargetScreenModal({ route, navigation }) {
  const [{ loggedUser, currentChallenge }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)

  const [selectedDuration, setSelectedDuration] = useState('day')
  const [selectedAmount, setSelectedAmount] = useState(loggedUser.target_donation || 10)

  const onSubmit = () => {
    setLoading(true)

    userAPI.updateProfile({ target_donation: selectedAmount }).then((res) => {
      //console.log('[target][updateProfile] res', res)

      Storer.set('loggedUser', {
        ...loggedUser,
        target_donation: selectedAmount
      })

      dispatch({
        type: 'setLoggedUser',
        loggedUser: {
          ...loggedUser,
          target_donation: selectedAmount
        }
      })

      setLoading(false)
      
      navigation.goBack()
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }

  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Target" color={colors.primary} />
      </Appbar.Header>

      {loading && <Loading />}

      <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>
        <Text style={{ marginTop: 24, marginBottom: 24 }} variant="bodyMedium">
          {targetText}
        </Text>


        <View style={{}}>
          <Text variant="labelLarge" style={{ color: colors.primary, marginTop: 24, marginBottom: 16, fontSize: 20 }}>
            Donation Goal
          </Text>

          <View style={{
            marginTop: 8,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <TouchableOpacity onPress={() => {
              //console.log('minus pressed')
              setSelectedAmount(Math.max((selectedAmount / 10 - 1) * 10, 10))
            }}>
              <Image
                source={require('../../../assets/icons/minus.png')}
                style={{ height: 40, width: 40, marginTop: 5 }}
              />
            </TouchableOpacity>

            <Text
              style={{ marginLeft: 25, marginRight: 25, fontSize: 30, marginTop: 11 }}
              variant="displayMedium">
              ${selectedAmount}
            </Text>

            <TouchableOpacity
              onPress={() => {
                //console.log('plus pressed')
                setSelectedAmount((selectedAmount / 10 + 1) * 10)
              }}>
              <Image
                source={require('../../../assets/icons/plus.png')}
                style={{ height: 40, width: 40, marginTop: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>


        <View style={{ paddingTop: 30 }}>
          <Button mode="contained"
            onPress={onSubmit}
            style={{ borderRadius: 12 }}
            contentStyle={styles.saveButtonStyle}>
            Save
          </Button>
          <Button mode="text" style={{ width: 100, marginTop: 25 }} onPress={() => navigation.goBack()}>
            Back
          </Button>
        </View>

      </View>
    </DefaultView>
  )
}

const styles = StyleSheet.create({
  saveButtonStyle: {
    height: 48,
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  saveButtonContainer: {
    marginTop: 32,
    marginBottom: 48,
  },
})
export default TargetScreenModal
