import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Alert,
  Image,
  Button,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Loader from './Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadImage = ({navigation}) => {
  const [imageDetail, setImageDetail] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const openFile = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.didCancel === undefined) {
      setImageDetail(result);
    }
  };
  const openCamera = async () => {
    launchCamera({mediaType: 'photo'}, res => {
      console.log('Response = ', res);

      if (res.didCancel) {
        ToastAndroid.show('Canceled Image', ToastAndroid.SHORT);
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        Alert.alert(res.customButton);
      } else {
        setImageDetail(res);
      }
    });
    // console.log(result, 'frommob result');
    // if (result.didCancel === undefined) {
    //   setImageDetail(result);
    // }
  };
  const requestPermision = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'ChatApp Camera Permission',
          message:
            'ChatApp needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted, 'granted');
      console.log(PermissionsAndroid.RESULTS.GRANTED, 'from granted ');
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openCamera();
      } else {
        Alert.alert('permission denied');
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const uploadImageToStore = async () => {
    setLoading(true);
    const reference = storage().ref(imageDetail.assets[0].fileName);
    const pathToFile = imageDetail.assets[0].uri;

    const userDetail = JSON.parse(await AsyncStorage.getItem('userDetail'));
    // uploads file
    try {
      await reference.putFile(pathToFile);
      const url = await storage()
        .ref(imageDetail.assets[0].fileName)
        .getDownloadURL();
      console.log(url);
      firestore()
        .collection('Users')
        .doc(userDetail.userId)
        .update({
          avatar: url,
        })
        .then(res => {
          ToastAndroid.showWithGravityAndOffset(
            'Profile Changed Successfully!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        });
      const finalDetail = {...userDetail, avatar: url};
      await AsyncStorage.setItem('userDetail', JSON.stringify(finalDetail));
      setLoading(false);
      setImageDetail(null);
      navigation.navigate('setting');
    } catch (error) {
      Alert.alert(error);
    }
  };

  return (
    <View style={styles.imgEditContainer}>
      {imageDetail === null ? (
        <View
          style={{
            marginTop: 150,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dtbarluca/image/upload/v1687156916/camera_hmnu8y.png',
            }}
            style={{width: 100, height: 100, margin: 20}}
          />
          <Text>Uplode your Image from camera or from file</Text>
        </View>
      ) : (
        <View style={{margin: 50}}>
          <Image
            source={{uri: imageDetail.assets[0].uri}}
            style={{width: 300, height: 300, marginBottom: 20}}
          />
          <Button title="change profile" onPress={uploadImageToStore} />
        </View>
      )}
      <View style={styles.footerContainer}>
        <View style={styles.iconeAlign}>
          <TouchableOpacity
            style={styles.iconContainer}
            activeOpacity={0.7}
            onPress={requestPermision}>
            <FontAwsome5 name="camera" color="white" size={40} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            activeOpacity={0.9}
            onPress={openFile}>
            <FontAwsome5 name="file-image" color="white" size={40} />
          </TouchableOpacity>
        </View>
      </View>
      <Loader isLoading={isLoading} />
    </View>
  );
};

export default UploadImage;

const styles = StyleSheet.create({
  imgEditContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 80,
    padding: 16,
    alignItems: 'center',
  },
  iconeAlign: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
});
