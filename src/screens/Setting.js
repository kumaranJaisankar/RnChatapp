import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';
import UserDetails from '../components/UserDetails';
import {useIsFocused} from '@react-navigation/native';
import Loader from '../components/Loader';

const Setting = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [isAvatar, setAvatar] = useState('');
  const [isLoading, setLoading] = useState(false);
  console.log(route, 'htis sis a route');
  useEffect(() => {
    const getingInfo = async () => {
      try {
        setLoading(true);
        const details = JSON.parse(await AsyncStorage.getItem('userDetail'));
        setLoading(false);
        if (details.avatar !== null) {
          setAvatar(details.avatar);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getingInfo();
  }, [isFocused]);

  const loggingOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.push('login');
    } catch (error) {
      Alert.alert('Error:');
    }
  };
  const changeName = async () => {
    const userDetail = JSON.parse(await AsyncStorage.getItem('userDetail'));
    firestore()
      .collection('Users')
      .doc(userDetail.userId)
      .update({
        avatar:
          'https://res.cloudinary.com/dtbarluca/image/upload/v1667812251/CamScanner_08-23-2021_19.51.24_1_iz3uek.jpg',
      })
      .then(res => console.log('success uplode image'));
  };
  return (
    <View style={styles.settingContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('uploadimage')}>
        {isAvatar.length === 0 ? (
          <Image
            style={styles.imageStyle}
            source={require('../images/user.png')}
          />
        ) : (
          <Image
            style={[{borderRadius: 100}, styles.imageStyle]}
            source={{uri: isAvatar}}
          />
        )}
        <View style={styles.editIcone} activeOpacity={0.9}>
          <FontAwsome5 name="plus" color="#ffffff" size={30} />
        </View>
      </TouchableOpacity>
      <UserDetails />
      <Text style={{color: 'black'}}>Setting</Text>
      <Button title="logout" color={'red'} onPress={loggingOut} />
      <Button disabled title="uplode image " onPress={changeName} />
      <Loader isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  settingContainer: {
    backgroundColor: '#000000',
    alignItems: 'center',
    paddingTop: 30,
    flex: 1,
  },
  imageStyle: {
    width: 200,
    height: 200,
    alignContent: 'center',
  },
  editIcone: {
    backgroundColor: '#02a9f1',
    position: 'relative',
    alignSelf: 'flex-end',
    bottom: 55,
    borderRadius: 50,
    right: 10,
    padding: 5,
  },
});

export default Setting;
