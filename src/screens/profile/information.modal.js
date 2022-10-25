import React, { useEffect, useState } from 'react'
import { Alert, Modal, StyleSheet, ScrollView, View, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { TextInput, Button, useTheme } from 'react-native-paper'
import { useGlobals } from '../../contexts/global'
import { Text, H2 } from '../../components/paper/typos'

import * as userAPI from '../../services/userAPI'
import Loading from '../../components/animations/loading'
import Storer from '../../utils/storer'


function InformationModal(props) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)

  const [username, setUsername] = useState(loggedUser.username)
  const [email, setEmail] = useState(loggedUser.email)
  const [name, setName] = useState(loggedUser.firstname)
  // const [password, setPassword] = useState('')
  // const [secureText, setSecureText] = useState(true)


  const onUpdateInformation = () => {
    setLoading(true)

    const update_data = {
      email: email,
      firstname: name
    }
    userAPI.updateProfile(update_data).then((res) => {
      Storer.set('loggedUser', {
        ...loggedUser,
        ...update_data
      })

      dispatch({
        type: 'setLoggedUser',
        loggedUser: {
          ...loggedUser,
          ...update_data
        }
      })

      setLoading(false)

      // ToastAndroid.show('Your information is updated', ToastAndroid.SHORT)
      // navigation.goBack()
      props.setInformationModalVisibility(!props.informationModalVisibility)
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


  return (
    <View style={{ color: '#ffffff' }}>
      <Modal
        animationType="slide"
        visible={props.informationModalVisibility}
        onRequestClose={() => {
          props.setInformationModalVisibility(!props.informationModalVisibility)
        }}>

        {loading && <Loading />}

        <View style={styles.mainViewContainer}>
          <H2>Personal Information</H2>

          <Text style={{ marginTop: 24, marginBottom: 24 }} variant="bodyMedium">
            Update your personal information
          </Text>


          <ScrollView>
            <View style={{ flex: 0.6 }}>
              <View style={{ marginVertical: 10 }}>
                <TextInput
                  mode="outlined"
                  label="Username"
                  disabled={true}
                  value={username}
                // onChangeText={value => setUserName(value)}
                />
              </View>

              <View style={{ marginVertical: 10 }}>
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={email}
                  onChangeText={value => setEmail(value)}
                />
              </View>

              <View style={{ marginVertical: 10 }}>
                <TextInput
                  mode="outlined"
                  label="Name"
                  value={name}
                  onChangeText={value => setName(value)}
                />
              </View>
            </View>

            <View style={{ flex: 0.6, marginTop: 30 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button mode="text"
                  style={{ marginHorizontal: 10 }}
                  labelStyle={{ paddingHorizontal: 10 }}
                  onPress={() => props.setInformationModalVisibility(!props.informationModalVisibility)}>
                  BACK
                </Button>

                <Button mode="contained"
                  style={{ marginHorizontal: 10 }}
                  labelStyle={{ paddingHorizontal: 10 }}
                  onPress={onUpdateInformation}
                  style={{ borderRadius: 30 }}
                >
                  Update
                </Button>
              </View>
            </View>

          </ScrollView>

        </View>
      </Modal>
    </View>
  )
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 12,
    marginRight: 24,
  },
})
export default InformationModal
