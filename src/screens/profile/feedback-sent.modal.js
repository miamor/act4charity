import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Pressable, View, Image, Dimensions } from 'react-native'
import { Button } from 'react-native-paper'
import { TextBold, Text } from '../../components/paper/typos'


function FeedbackSentModal(props) {
  const { width } = Dimensions.get('window')

  return (
    <Modal
      animationType="slide"
      visible={props.sentModalVisibility}
      onRequestClose={props.onConfirm}>
      <View style={styles.centredView}>
        <View style={styles.modalBackgroundStyle}>
          <Image
            source={require('../../../assets/icons/feedbacksent.png')}
            style={{ height: 180, width: 224, marginTop: 20 }}
          />
          <TextBold
            style={{ textAlign: 'center' }}
            variant="headlineSmall">
            Thank you
          </TextBold>
          <Text
            style={{ marginTop: 18, width: 200, textAlign: 'center' }}
            variant="bodyMedium">
            Your message has been sent. Your opinion is essential for us to
            continue growing.
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Button onPress={props.onConfirm}
              mode="text">
              OK
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  centredView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    opacity: 50,
  },
  modalBackgroundStyle: {
    flex: 0.8,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    shadowRadius: 5,
    shadowColor: '#111111',
    alignItems: 'center',
    shadowOpacity: 0.25,
    elevation: 5,
    paddingBottom: 20
  },
})
export default FeedbackSentModal
