import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Pressable, View, Image } from 'react-native'
import { Button, Provider, Surfac, TextInput, useTheme } from 'react-native-paper'
import { Text, H3, H2 } from './paper/typos'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Dropdown } from 'react-native-element-dropdown'
import FeedbackSentModal from './FeedbackSentModal'
import { useGlobals } from '../contexts/global'

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


  return (
    <View>
      <FeedbackSentModal
        sentModalVisibility={sentModal}
        setSentModalVisibility={setSentModalVisibility}
      />
      <Modal
        animationType="slide"
        visible={props.feedbackModalVisibility}
        onRequestClose={() => {
          props.setFeedbackModalVisibility(!props.feedbackModalVisibility)
        }}>

        <View style={styles.mainViewContainer}>
          <H2>What can we improve?</H2>
          <View style={{ marginTop: 18 }}>
            {/* <Text style={{ marginBottom: 6 }} variant="titleLarge">
              What can we improve?
            </Text> */}
            <Text variant="bodyLarge">
              Select and option and describe your opinion about it.
            </Text>
          </View>
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
          <View style={{ width: 342, marginTop: 8 }}>
            <TextInput
              style={{ height: 256 }}
              mode="outlined"
              placeholder="Write here..."
              placeholderTextColor="#C9C5CA"
              multiline={true}
              value={feedbackText}
              onChangeText={feedbackText => setFeedbackText(feedbackText)}
            />
          </View>


          <View style={styles.challengeButtonContainer}>
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
          </View>
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
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 30,
    marginRight: 24,
  },
  container: {
    marginTop: 32,
    backgroundColor: 'white',
    width: 342,
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
