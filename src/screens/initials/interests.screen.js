import React, { useState, useLayoutEffect, useEffect } from 'react'
import { useGlobals } from '../../contexts/global'

import { FlatList, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { DefaultView } from '../../components/containers'
import { Button, Surface, TouchableRipple, useTheme } from 'react-native-paper'
import { H3, Text } from '../../components/paper/typos'

import * as userAPI from '../../services/userAPI'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function InterestsInitialScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [cats, setCats] = useState()
  const [selectedCats, setSelectedCats] = useState({})

  useEffect(() => {
    userAPI.listInterests({ num_per_page: 100 }).then((res) => {
      setCats(res.data)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }, [])

  const _handleContinue = () => {
    const selected_ids = Object.keys(selectedCats).filter(function (key) { return selectedCats[key] === 1 })

    dispatch({
      type: 'setLoggedUser',
      loggedUser: {
        ...loggedUser,
        interests: selected_ids,
        target_donation: 50, // just put a fixed value here
      },
    })
    navigation.push('Loading')
  }

  const onToggleInterest = (cat_id) => {
    if (!selectedCats.hasOwnProperty(cat_id) || selectedCats[cat_id] === 0) {
      setSelectedCats({
        ...selectedCats,
        [cat_id]: 1
      })
    } else if (selectedCats[cat_id] === 1) {
      setSelectedCats({
        ...selectedCats,
        [cat_id]: 0
      })
    }
  }


  return (
    <DefaultView>
      <View style={styles.textContainer}>
        <H3 style={[styles.textHeadline, { color: colors.primary }]}>
          Categories of Interest
        </H3>
        <Text style={styles.textText}>
          What do you like?
        </Text>
      </View>

      <View style={styles.inputContainer}>
        {cats && <FlatList
          data={cats}
          style={styles.list}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={item => item._id}
          bounces={false}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          renderItem={({ item, index }) => (
            <Button
              onPress={() => onToggleInterest(item._id)}
              mode={selectedCats.hasOwnProperty(item._id) && selectedCats[item._id] === 1 ? 'contained' : 'outlined'}
              // buttonColor={item.selected ? 'rgba(31, 31, 31, 0.12)' : ''}
              style={{
                flex: 1,
                marginHorizontal: 4,
                marginVertical: 10,
                borderRadius: 40
              }}
              labelStyle={{
                paddingVertical: selectedCats.hasOwnProperty(item._id) && selectedCats[item._id] === 1 ? 5 : 4,
                fontSize: 17
              }}
            >
              {item.title}
            </Button>
          )}></FlatList>}
      </View>

      <View style={styles.buttonContainer}>
        <Button mode="contained"
          disabled={Object.keys(selectedCats).length === 0 || Object.values(selectedCats).reduce((a, b) => a + b, 0) === 0}
          onPress={_handleContinue}
          style={{ borderRadius: 30 }}
          labelStyle={{ color: '#fff', paddingVertical: 5 }}
        >
          Continue
        </Button>
      </View>
    </DefaultView>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 0.2,
    paddingTop: 50,
    // justifyContent: 'center',
    // alignSelf: 'center',
    paddingHorizontal: 40,
  },
  textHeadline: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  textText: {
    textAlign: 'center',
    paddingVertical: 10,
    lineHeight: 28
  },
  inputContainer: {
    flex: 0.6,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 40,
  },
  buttonContainer: {
    flex: 0.2,
    paddingHorizontal: 40,
    paddingTop: 35,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
})

export default InterestsInitialScreen
