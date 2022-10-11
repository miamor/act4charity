/**
 * @format
 * @flow
 */
import {Dimensions, StatusBar, Platform} from 'react-native';
// import { DefaultTheme } from 'react-native-paper'

const {height, width} = Dimensions.get('window');
const isIphoneXGen =
  Platform.OS === 'ios' &&
  (height === 812 || width === 812 || height === 896 || width === 896);
const statusBarHeight = Platform.select({
  ios: isIphoneXGen ? 44 : 24,
  android: StatusBar.currentHeight,
  // android: 20
});
const headerHeight = isIphoneXGen ? 130 - statusBarHeight : 80;
const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};

const metrics = {
  //     // padding: 15,
  //     // lessPadding: 10,
  //     // extraPadding: 20,
  //     // radius: 8,
  //     // screenWidth: width,
  //     // screenHeight: height,
  //     // coverWidth: 126,
  //     // coverHeight: 168,
  //     // statusBarHeight: statusBarHeight,
  //     // headerHeightHalf: headerHeight / 2,
  //     // headerHeight: headerHeight,
  //     // headerHeightX2: headerHeight * 2,
  //     // headerHeightX3: headerHeight * 3,
  //     // tabbarHeight: 49,
  //     // bottomSpaceHeight: isIphoneXGen ? 34 : 0,
};

const colors = {
  // wholeBg: '#000',
  // // ...DefaultTheme.colors,
  // // primary: '#1c86f4',
  // // primary: '#1db853',
  // // primary: '#db7769',
  // // primary: '#ff9645',
  // primaryBg: '#f2f2f2',
  primary: '#db8276', //'#1c1b1b',
  // primaryDark: '#1e5bef',
  // primaryLight: '#1ba1f7',
  // accent: '#3497FD',
  // text: '#000000',
  // textSecondary: '#8D8D92',
  // textSecondary: '#8D8D92',
  // text_gray: '#999',
  // red: '#ff0000',
  // // divider: '#BDBDBD',
  // divider: '#e4e4e4',
  // light_divider: '#f0f0f0',
  // white: '#ffffff',
  // lightOpacity: 'rgba(255,255,255,0.8)',
  // darkOpacity: 'rgba(0, 0, 0, 0.1)',
  // black: '#000000',
  // background: '#f1f1f1',
  // star: '#fe8302',
  // transparent: 'transparent',
  // shadow: {
  //     ...Platform.select({
  //         ios: {
  //             shadowColor: 'rgba(0, 0, 0, 0.9)',
  //             shadowOffset: { width: 0, height: 2 },
  //             shadowOpacity: 0.15,
  //             shadowRadius: 15,
  //         },
  //         android: {
  //             elevation: 1,
  //         },
  //     }),
  // },
};

export {metrics, colors, layout};
