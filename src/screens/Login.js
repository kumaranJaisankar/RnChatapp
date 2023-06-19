import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AppColors from '../colors/AppColors';
import firebase from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [passView, setPassSlashEye] = useState(true);

  const [isLoading, setLoading] = useState(false);

  const loginUser = () => {
    setLoading(true);
    firebase()
      .collection('Users')
      .where('email', '==', name)
      .where('password', '==', password)
      .get()
      .then(snapShot => {
        setLoading(false);
        if (snapShot.docs !== []) {
          const dataObject = snapShot.docs[0].data();

          goToHomePage(
            dataObject.name,
            dataObject.email,
            dataObject.userId,
            dataObject.avatar,
            dataObject.phNumber,
          );
        } else {
          Alert.alert('error', 'user not avaliable, plz create your accout');
        }
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('Warning', 'Wrong email or password');
      });
  };
  const goToHomePage = async (name, email, userId, avatar, phNumber) => {
    const userObj = {name, email, userId, avatar, phNumber};
    try {
      await AsyncStorage.setItem('userDetail', JSON.stringify(userObj));
      navigation.push('mainScreen');
    } catch (error) {
      Alert.alert(error);
    }
  };
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await AsyncStorage.getItem('userDetail');
        if (response !== null) {
          navigation.navigate('chatPage');
        }
      } catch (error) {
        Alert.alert(error, 'Try Again');
      }
    };
    fetchDetail();
    // createChannels();
  }, []);
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.text}>Login</Text>
      <View style={{margin: 50}}>
        <TextInput
          clearButtonMode="while-editing"
          style={styles.input}
          placeholder="Username or Email"
          placeholderTextColor="#c0b4b4"
          value={name}
          onChangeText={val => setName(val)}
        />

        <View style={styles.inputCon}>
          <TextInput
            secureTextEntry={passView}
            style={{flex: 1}}
            placeholder="Password"
            placeholderTextColor="#c0b4b4"
            value={password}
            onChangeText={val => setPassword(val)}
          />
          <FontAwesome
            name={passView ? 'eye-slash' : 'eye'}
            color={passView ? '#ded2d2ab' : 'white'}
            size={25}
            style={{paddingRight: 10}}
            onPress={() => setPassSlashEye(!passView)}
          />
        </View>

        <Text style={{textAlign: 'right', color: '#5bb0e1', marginTop: 2}}>
          Forget Password?
        </Text>
        <TouchableOpacity style={styles.loginBtn} onPress={loginUser}>
          <Text style={{color: AppColors.light, fontWeight: 900, fontSize: 20}}>
            Login
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={{color: 'white'}}>
          Don't have a account?
          <Text
            style={{fontWeight: 800}}
            onPress={() => navigation.navigate('signup')}>
            {' '}
            Sign up
          </Text>
        </Text>
      </View>
      <Loader isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: AppColors.dark,
    flex: 1,
  },
  text: {
    color: AppColors.light,
    fontWeight: 500,
    fontSize: 40,
    alignSelf: 'center',
    marginTop: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.light,
    paddingLeft: 20,
    borderRadius: 10,
    color: 'white',
    marginTop: 20,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 0,
  },
  loginBtn: {
    backgroundColor: AppColors.mainColor,
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  inputCon: {
    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,

    paddingLeft: 20,
    borderRadius: 10,
    color: 'white',
    marginTop: 20,
    borderColor: 'white',
  },
});

export default Login;
