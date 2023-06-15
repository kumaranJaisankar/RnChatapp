import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import AppColors from '../colors/AppColors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash({navigation}) {
  useEffect(() => {
    setTimeout(() => checkingLogin(), 2000);
  }, []);

  const checkingLogin = async () => {
    try {
      const response = await AsyncStorage.getItem('userDetail');
      if (response === null) {
        navigation.navigate('login');
      } else {
        navigation.navigate('mainScreen');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.splashContainer}>
      <Text style={styles.appText}>Firebase Chat App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    backgroundColor: AppColors.mainColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appText: {
    fontSize: 40,
    fontWeight: 900,
    color: AppColors.light,
  },
});
