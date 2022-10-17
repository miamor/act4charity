import React, { PropTypes, Component } from 'react'
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native'
import { ProgressBar, Button, RadioButton, useTheme, Appbar } from 'react-native-paper'
import { DefaultView } from '../components/containers'
import { Text } from '../components/paper/typos'
import { useGlobals } from '../contexts/global'

const targetText =
  'As a personal goal, you can define your own target amount to complete in a period of time. Challenge yourself!'

function TargetScreenModal(props) {
  const [{ loggedUser, currentChallenge }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [selectedDuration, setSelectedDuration] = useState('day')
  const [selectedAmount, setSelectedAmount] = useState(1)

  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Target" color={colors.primary} />
      </Appbar.Header>

      <View style={{ backgroundColor: '#ffffff' }}>
        <View style={styles.mainViewContainer}>
          <Text style={{ marginTop: 24, marginBottom: 24 }} variant="bodyMedium">
            {targetText}
          </Text>
          <Text
            variant="labelLarge"
            style={{ color: '#381E72', marginBottom: 12 }}>
            Completion Time
          </Text>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40 }}>
                <RadioButton
                  value="Day"
                  status={selectedDuration === 'day' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    console.log('day selected')
                    setSelectedDuration('day')
                  }}
                />
              </View>
              <Text style={{ marginBottom: 2 }} variant="bodyLarge">
                Day
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40 }}>
                <RadioButton
                  value="Week"
                  status={selectedDuration === 'week' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    console.log('week selected')
                    setSelectedDuration('week')
                  }}
                />
              </View>
              <Text style={{ marginBottom: 2 }} variant="bodyLarge">
                Week
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40 }}>
                <RadioButton
                  value="Fortnight"
                  status={
                    selectedDuration === 'fortnight' ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    console.log('fortnight selected')
                    setSelectedDuration('fortnight')
                  }}
                />
              </View>
              <Text style={{ marginBottom: 2 }} variant="bodyLarge">
                Fortnight
              </Text>
            </View>
          </View>
          <Text
            variant="labelLarge"
            style={{ color: '#381E72', marginTop: 24, marginBottom: 12 }}>
            Goal
          </Text>
          <View
            style={{
              marginTop: 8,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                console.log('minus pressed')
                setSelectedAmount(selectedAmount - 1)
              }}>
              <Image
                source={require('../../assets/icons/minus.png')}
                style={{ height: 40, width: 40, marginTop: 5 }}
              />
            </TouchableOpacity>
            <Text
              style={{ marginLeft: 25, marginRight: 25 }}
              variant="displayMedium">
              ${selectedAmount}
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log('plus pressed')
                setSelectedAmount(selectedAmount + 1)
              }}>
              <Image
                source={require('../../assets/icons/plus.png')}
                style={{ height: 40, width: 40, marginTop: 5 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.saveButtonContainer}>
            <Button
              onPress={() => {
                console.log('define goals button pressed')
              }}
              style={{ backgroundColor: '#E89C51', borderRadius: 12 }}
              contentStyle={styles.saveButtonStyle}
              mode="contained">
              {
                <Text
                  variant="labelMedium"
                  style={{ color: '#FFFFFF', height: 56 }}>
                  Save
                </Text>
              }
            </Button>
          </View>
          <Button
            mode="text"
            style={{ width: 20, marginTop: 125 }}
            onPress={() => {
              console.log('back button pressed')
            }}>
            {<Text style={{ color: '#6750A4' }}></Text>}
          </Button>
        </View>
      </View>
    </DefaultView>
  )
}

const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 12,
    marginRight: 24,
  },
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
