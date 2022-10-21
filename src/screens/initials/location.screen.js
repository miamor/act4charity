import React, { useState, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Headline, useTheme } from 'react-native-paper'
import { H3, Text } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'
import HerePlacesInput from '../../components/paper/autocomplete-place'
import Axios from 'axios'

const TIMEZONEDB_API_KEY = 'LC2C7NL7F7MT'

function rawOffsetToOffset(offset) {
  const tz = offset < 0 ? - Math.abs(offset) / 3600 : Math.abs(offset) / 3600
  return tz
}

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function LocationScreen({ navigation }) {
  const dispatch = useGlobals()[1]
  const { colors } = useTheme()

  const [values, setValues] = useState()
  const buttonDisabled = values == null || !values.country
  const _handleContinue = () => {
    dispatch({
      type: 'setSession',
      fields: {
        ...values
      },
    })
    navigation.push('Loading')
  }

  const _handleSelectSuggest = useCallback((item) => {
    Axios.get(`https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONEDB_API_KEY}&by=position&format=json&lat=${item.DisplayPosition.Latitude}&lng=${item.DisplayPosition.Longitude}`).then((res) => {
      setValues({
        tzName: res.data.zoneName,
        timezone: rawOffsetToOffset(res.data.gmtOffset),
        country: item.Address.Country,
        town: item.Address.County,
        lat: item.DisplayPosition.Latitude,
        lng: item.DisplayPosition.Longitude,
      })
    })
  }, [values])



  return (
    <DefaultView>
      <View style={{ flex: 0.5 }} />
      <View style={styles.textContainer}>
        <H3 style={[styles.textHeadline, { color: colors.primary }]}>
          Your location
        </H3>
        <Text style={styles.textText}>
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <HerePlacesInput
          label="Location"
          styleType="border"
          onSelect={_handleSelectSuggest}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          disabled={buttonDisabled}
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
  aquarius: {
    zIndex: 0,
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.2,
  },
  textContainer: {
    flex: 1.3,
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
    flex: 1,
    alignSelf: 'center',
    paddingVertical: 40,
    zIndex: 1,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 20,
    opacity: 0.9,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 35,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
})

export default LocationScreen
