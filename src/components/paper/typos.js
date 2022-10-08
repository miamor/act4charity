/**
 * @format
 * @flow
 */
import React, { PureComponent } from 'react'
import {
  // Text as RNText,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native'
import { Text as RNText, useTheme } from 'react-native-paper';

import { colors } from '../../utils/themes'

function AnimatedHeading({ style, ...props }) {
  return (
    <Animated.Text {...props} style={[styles.animatedHeading, style]} />
  )
}

const AnimatedTitle = (props) => (
  <Animated.Text {...props} style={[styles.heading, props.style]} />
)

function Heading({ style, ...props }) {
  return (
    <RNText {...props} style={[styles.heading, style]} />
  )
}

function TextBold({ children, style }) {
  return <Text style={[styles.textbold, style]}>{children}</Text>;
}

function AnimatedText({ style, ...props }) {
  return (
    <Animated.Text {...props} style={[styles.title, style]} />
  )
}

function Title({ style, ...props }) {
  return <RNText {...props} style={[styles.title, style]} />
}

function H2({ style, ...props }) {
  return <RNText {...props} style={[styles.h2, {color: colors.primary}, style]} />
}

function H3({ style, ...props }) {
  const { colors } = useTheme();
  return <RNText {...props} style={[styles.h3, {color: colors.primary}, style]} />
}

function Subtitle({ style, ...props }) {
  return (
    <RNText {...props} style={[styles.subtitle, style]} />
  )
}

function TextButton({ style, ...props }) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <RNText {...props} style={[styles.textButton, style]} />
    </TouchableOpacity>
  )
}

function Text({ style, ...props }) {
  return <RNText {...props} style={[styles.text, style]} />
}

function Text1({ style, ...props }) {
  return <RNText {...props} style={[styles.text1, style]} />
}

function SubText({ style, ...props }) {
  return (
    <RNText {...props} style={[styles.subText, style]} />
  )
}

function Caption({ style, ...props }) {
  return (
    <RNText {...props} style={[styles.caption, style]} />
  )
}

export {
  AnimatedHeading,
  AnimatedTitle,
  AnimatedText,
  TextBold,
  Heading,
  Title,
  Subtitle,
  Text,
  Text1,
  TextButton,
  SubText,
  Caption,
  H2,
  H3,
}

const styles = StyleSheet.create({
  animatedHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: colors.text,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: colors.text,
    fontFamily: "GMV_DIN_Pro",
    paddingBottom: 3,
  },
  title: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: "GMV_DIN_Pro-Bold",
    // color: colors.text,
    paddingBottom: 3,
  },
  h2: {
    fontSize: 25,
    // fontWeight: 'bold',
    lineHeight: 35,
    fontFamily: "GMV_DIN_Pro-Bold",
    // color: colors.text,
    // paddingBottom: 3,
  },
  h3: {
    fontSize: 20,
    // fontWeight: 'bold',
    lineHeight: 30,
    fontFamily: "GMV_DIN_Pro-Bold",
    // color: colors.text,
    // paddingBottom: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: colors.text,
  },
  textButton: {
    fontSize: 13,
    fontWeight: 'normal',
    // color: colors.primary,
  },
  text: {
    fontSize: 17,
    fontWeight: 'normal',
    lineHeight: 31,
    // paddingBottom: 3,
    fontFamily: "GMV_DIN_Pro",
    // color: colors.text,
  },
  text1: {
    fontSize: 18.5,
    fontWeight: 'normal',
    lineHeight: 34,
    fontFamily: "GMV_DIN_Pro",
    // color: colors.text,
  },
  textbold: {
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 27,
    fontFamily: "GMV_DIN_Pro-Bold",
    // color: colors.text,
  },
  subText: {
    fontSize: 13,
    fontWeight: 'normal',
    // color: colors.textSecondary,
  },
  caption: {
    fontSize: 10,
    fontWeight: 'normal',
    // color: colors.textSecondary,
  },
})
