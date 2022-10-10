import React, { useState, useLayoutEffect, useEffect } from 'react'
import { useGlobals } from '../../contexts/global'

import { StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { DefaultView } from '../../components/containers'
import { Button, Surface, TouchableRipple, useTheme } from 'react-native-paper'
import { H3, Text } from '../../components/paper/typos'
import SpaceSky from '../../components/decorations/space-sky'
import { Backgrounds } from '../../svgs'

import * as userAPI from '../../services/userAPI'

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function InterestCategoryScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [cats, setCats] = useState()
  const [selectedCats, setSelectedCats] = useState([])

  useEffect(() => {
    userAPI.listCats().then((data) => {
      console.log(data)
      setCats(data)
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
        cats: cats
      },
    })
    navigation.push('Location')
  }

  const toggleToCats = (cat_code) => {
    console.log('cat_code', cat_code, ' | selectedCats', selectedCats)
    let a = selectedCats
    const idx = a.indexOf(cat_code)
    console.log('idx', idx)
    if (idx < 0) {
      setSelectedCats([...selectedCats, cat_code])
    } else {
      a.splice(idx, 1)
      console.log('>>> idx', idx)
      console.log('>>> a', a)
      console.log('>>> a', a)
      console.log('>>> a', a)
      setSelectedCats(a)
    }
  }
  useEffect(() => {
    console.log(' > new selectedCats', selectedCats)
  }, [selectedCats])


  return (
    <DefaultView>
      <SpaceSky />
      <View style={{ flex: 0.7 }} />
      <View style={styles.textContainer}>
        <H3 style={[styles.textHeadline, { color: colors.primary }]}>
          Categories of Interest
        </H3>
        <Text style={styles.textText}>
          What do you like?
        </Text>
      </View>

      <View style={styles.sexContainer}>
        {cats != null && cats.map((cat) => (
          <TouchableOpacity
            onPress={() => toggleToCats(cat.code)}
            style={[
              selectedCats.indexOf(cat.code) >= 0 && { backgroundColor: colors.primary },
              {
                height: 45,
                paddingHorizontal: 20,
                paddingVertical: 5,
                // opacity: selectedCats.indexOf(cat.code) >= 0 ? 1 : 0.5,

                borderColor: colors.primary,
                borderRadius: 30,
                borderWidth: 1
              }
            ]}
          >
            <Text style={[selectedCats.indexOf(cat.code) >= 0 && {color: '#fff'}, styles.sexText]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button mode="contained"
          disabled={!Array.isArray(selectedCats) || selectedCats.length === 0}
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
  constellation: {
    zIndex: 0,
    position: 'absolute',
    bottom: 20,
    left: 20,
    opacity: 0.1,
  },
  scorpio: {
    zIndex: 0,
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.2,
  },
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
  sexContainer: {
    flex: 1,
    paddingHorizontal: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sexText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 35,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
})

export default InterestCategoryScreen
