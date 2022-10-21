import React, { useCallback, useState } from 'react'
import { Alert, Modal, StyleSheet, Pressable, View, Image, Dimensions } from 'react-native'
import { Button, Provider, Surfac, TextInput, useTheme } from 'react-native-paper'
import { Text, H3, H2 } from '../paper/typos'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Dropdown } from 'react-native-element-dropdown'
import FeedbackSentModal from './feedback-sent.modal'
import { useGlobals } from '../../contexts/global'
import { DefaultView } from '../containers'
import { useNavigation } from '@react-navigation/core'

function FeedbackModal(props) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const optionList = [
    {
      label: 'Problems with challenges',
      value: 'challenges',
    },
    {
      label: 'User Experience',
      value: 'ux',
    },
    {
      label: 'Issues with social features',
      value: 'social',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ]
  const [selectedOption, setSelectedOption] = useState(null)
  const [isFocus, setIsFocus] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [sentModal, setSentModalVisibility] = useState(false)

  const onConfirm = useCallback(() => {
    setSentModalVisibility(false)
    props.setFeedbackModalVisibility(false)
  })

  const { height } = Dimensions.get('window')

  return (
    <>
      <FeedbackSentModal
        sentModalVisibility={sentModal}
        setSentModalVisibility={setSentModalVisibility}
        onConfirm={onConfirm}
      />
      <Modal
        animationType="slide"
        visible={props.feedbackModalVisibility}
        onRequestClose={() => {
          props.setFeedbackModalVisibility(!props.feedbackModalVisibility)
        }}>

        <View style={[styles.mainViewContainer, { height: height, flexDirection: 'column' }]}>
          <View style={{ flex: 0.2 }}>
            <H2>What can we improve?</H2>

            {/* <Text style={{ marginBottom: 6 }} variant="titleLarge">
              What can we improve?
            </Text> */}
            <Text variant="bodyLarge">
              Select and option and describe your opinion about it.
            </Text>
          </View>

          <View style={{ flex: 0.5, flexDirection: 'column' }}>
            <View style={styles.container}>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: '#000000' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={optionList}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select an option' : '...'}
                value={selectedOption}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setSelectedOption(item.value)
                  setIsFocus(false)
                }}
              />
            </View>
            <TextInput
              style={{ flex: 1, }}
              mode="outlined"
              placeholder="Write here..."
              placeholderTextColor="#C9C5CA"
              multiline={true}
              value={feedbackText}
              onChangeText={feedbackText => setFeedbackText(feedbackText)}
            />
          </View>


          <View style={{ flex: 0.3, paddingTop: 30 }}>
            <Button
              onPress={() => {
                console.log('challenge button pressed')
                setSentModalVisibility(!sentModal)
              }}
              style={{ backgroundColor: '#E89C51', borderRadius: 12 }}
              contentStyle={styles.targetButtonStyle}
              mode="contained">
              Send Feedback
            </Button>

            <Button
              mode="text"
              style={{ width: 20, marginTop: 65 }}
              onPress={() => {
                console.log('back button pressed')
                props.setFeedbackModalVisibility(!props.feedbackModalVisibility)
              }}>
              BACK
            </Button>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 30,
    marginRight: 24,
  },
  container: {
  },
  dropdown: {
    height: 50,
    borderColor: '#000000',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 12,
  },
  challengeButtonContainer: {
    marginTop: 21,
    marginBottom: 48,
  },
  targetButtonStyle: {
    height: 48,
    alignContent: 'center',
    justifyContent: 'space-around',
  },
})
export default FeedbackModal
