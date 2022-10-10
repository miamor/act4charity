import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Pressable, View, Image} from 'react-native';
import {Text, Button} from 'react-native-paper';

function FeedbackSentModal(props) {
  return (
    <View style={styles.centredView}>
      <Modal
        animationType="slide"
        visible={props.sentModalVisibility}
        onRequestClose={() => {
          console.log('do log out request');
          props.setSentModalVisibility(!props.sentModalVisibility);
        }}>
        <View style={styles.centredView}>
          <View style={styles.modalBackgroundStyle}>
            <Image
              source={require('../assets/icons/feedbacksent.png')}
              style={{height: 180, width: 224, marginTop: 20}}
            />
            <Text
              style={{textAlign: 'center', width: 200}}
              variant="headlineSmall">
              Thank you
            </Text>
            <Text
              style={{marginTop: 18, width: 200, textAlign: 'center'}}
              variant="bodyMedium">
              Your message has been sent. Your opinion is essential for us to
              continue growing.
            </Text>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <Button
                onPress={() => {
                  console.log('no action here');
                  props.setSentModalVisibility(!props.sentModalVisibility);
                }}
                mode="text">
                OK
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  centredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    opacity: 50,
  },
  modalBackgroundStyle: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    shadowRadius: 5,
    shadowColor: '#111111',
    alignItems: 'center',
    shadowOpacity: 0.25,
    elevation: 5,
    height: 390,
    width: 264,
  },
});
export default FeedbackSentModal;
