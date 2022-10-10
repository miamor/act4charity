import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Text, Button} from 'react-native-paper';

function InterestsModal(props) {
  const [healthCareSelected, setHealthCareSelected] = useState(false);
  return (
    <View style={{color: '#ffffff'}}>
      <Modal
        animationType="slide"
        visible={props.interestsModalVisibility}
        onRequestClose={() => {
          props.setInterestsModalVisibility(!props.interestsModalVisibility);
        }}>
        <View style={styles.mainViewContainer}>
          <Text variant="headlineMedium" style={{color: '#6750A4'}}>
            Interests
          </Text>
          <Text style={{marginTop: 24, marginBottom: 24}} variant="bodyMedium">
            Select the topics that interest you the most
          </Text>
          <TouchableOpacity
            onPress={() => {
              console.log('healthcare selected');
              setHealthCareSelected(!healthCareSelected);
            }}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Image
                style={{width: 72, height: 72}}
                source={require('../assets/icons/healthcare.png')}
              />
              <View>
                <Text
                  style={{color: '#381E72', marginTop: 18}}
                  variant="labelMedium">
                  Healthcare
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 12,
    marginRight: 24,
  },
});
export default InterestsModal;
