import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = ({navigation}) => {
  const loggingOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('login');
    } catch (error) {
      Alert.alert(error);
    }
  };
  return (
    <View>
      <Text style={{color: 'black'}}>Setting</Text>
      <Button title="logout" color={'red'} onPress={loggingOut} />
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({});
