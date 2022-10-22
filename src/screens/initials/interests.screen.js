import React, { useState, useLayoutEffect, useEffect } from 'react'
import { useGlobals } from '../../contexts/global'

import { StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
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
    dispatch({
      type: 'setLoggedUser',
      loggedUser: {
        ...loggedUser,
        interests: selectedCats,
        target_donation: 50, // just put a fixed value here
      },
    })
    navigation.push('Loading')
  }

  const toggleToCats = (cat_id) => {
    // console.log('cat_id', cat_id, ' | selectedCats', selectedCats)
    let a = selectedCats
    const idx = a.indexOf(cat_id)
    // console.log('idx', idx)

    if (!selectedCats.hasOwnProperty(cat_id) || selectedCats[cat_id] === 0) {
      setSelectedCats({
        ...selectedCats,
        [cat_id]: 1
      })
    } else {
      setSelectedCats({
        ...selectedCats,
        [cat_id]: 0
      })
    }
  }
  // useEffect(() => {
  //   console.log(' > new selectedCats', selectedCats)
  // }, [selectedCats])


  return (
    <DefaultView>
      <View style={{ flex: 0.7 }} />
      <View style={styles.textContainer}>
        <H3 style={[styles.textHeadline, { color: colors.primary }]}>
          Categories of Interest
        </H3>
        <Text style={styles.textText}>
          What do you like?
        </Text>
      </View>

      <View style={{
        flex: 1,
        paddingHorizontal: 50,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {cats != null && cats.map((cat, i) => (
          <TouchableOpacity key={`cat-` + i}
            onPress={() => toggleToCats(cat._id)}
            style={[
              selectedCats.hasOwnProperty(cat._id) && selectedCats[cat._id] === 1 && { backgroundColor: colors.primary },
              {
                height: 45,
                paddingHorizontal: 20,
                paddingVertical: 5,
                // opacity: selectedCats.indexOf(cat._id) >= 0 ? 1 : 0.5,

                borderColor: colors.primary,
                borderRadius: 30,
                borderWidth: 1
              }
            ]}
          >
            <Text style={[selectedCats.indexOf(cat._id) >= 0 && { color: '#fff' }]}>
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
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
    flex: 1.2,
    alignSelf: 'center',
    paddingHorizontal: 20,
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
  logoContainer: {
    flex: 1.1,
    alignSelf: 'center',
    paddingTop: 5,
    paddingBottom: 15,
    zIndex: 1,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 35,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
})

export default InterestsInitialScreen
