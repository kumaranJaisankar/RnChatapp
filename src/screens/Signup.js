import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useState, useRef} from 'react';
import AppColors from '../colors/AppColors';
// import {ScrollView} from 'react-native-gesture-handler';
import firebase from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';

const Signup = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phNumer, setPhNumber] = useState('');
  const [password, setPassword] = useState('');
  const [conformPass, setConformPassword] = useState('');
  const [isOpen, setOpenKey] = useState(null);
  const [isScroll, setScroll] = useState(false);
  const [confPassView, setSlashEye] = useState(true);
  const [passView, setPassSlashEye] = useState(true);

  const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
    setOpenKey(true);
    setScroll(false);
  });
  const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
    setOpenKey(false);
    setScroll(false);
  });
  const scrollRef = useRef();

  if (isOpen === false) {
    scrollRef.current.scrollTo({
      y: 0,
      animated: true,
    });
  }

  const [isLoading, setLoading] = useState(false);

  // regester user
  const regesterUser = () => {
    const userId = uuid.v4();
    setLoading(true);
    firebase()
      .collection('Users')
      .doc(userId)
      .set({
        name: name,
        email: email,
        phNumber: phNumer,
        password: password,
        userId: userId,
        avatar: null,
      })
      .then(val => {
        setLoading(false);
        navigation.navigate('login');
      })
      .catch(error => {
        setLoading(false);
        Alert.alert(error);
      });
  };
  const iSdisabled =
    name.length !== 0 &&
    email.length !== 0 &&
    phNumer.length !== 0 &&
    password.length !== 0 &&
    conformPass.length !== 0;
  const [verifyPass, setVerify] = useState(false);

  const conformPassVerification = val => {
    setConformPassword(val);
    const verfy = txt => {
      password.includes(txt) ? setVerify(false) : setVerify(true);
    };
    verfy(val);
    console.log(password.includes(conformPass));
  };
  return (
    <ScrollView
      scrollEnabled={isScroll}
      ref={scrollRef}
      style={styles.loginContainer}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.text}>Signup</Text>

      <Text style={{color: AppColors.light, textAlign: 'center'}}>
        create your account
      </Text>
      <View style={{margin: 50}}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#c0b4b4"
          value={name}
          onChangeText={val => setName(val)}
        />
        <TextInput
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#c0b4b4"
          value={email}
          onChangeText={val => setEmail(val)}
        />
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="Mobile no."
          placeholderTextColor="#c0b4b4"
          value={phNumer}
          onChangeText={val => setPhNumber(val)}
        />

        <View style={[{borderColor: 'white'}, styles.passwordCon]}>
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

        <View
          style={[
            {borderColor: verifyPass ? 'red' : 'white'},
            styles.passwordCon,
          ]}>
          <TextInput
            secureTextEntry={confPassView}
            style={{flex: 1}}
            placeholder="Conform Password"
            placeholderTextColor="#c0b4b4"
            value={conformPass}
            onChangeText={conformPassVerification}
          />
          <FontAwesome
            name={confPassView ? 'eye-slash' : 'eye'}
            color={confPassView ? '#ded2d2ab' : 'white'}
            size={25}
            style={{paddingRight: 10}}
            onPress={() => setSlashEye(!confPassView)}
          />
        </View>
        {verifyPass && (
          <Text style={{color: 'red'}}>*Password not matching </Text>
        )}

        <TouchableOpacity
          disabled={!iSdisabled}
          style={[
            {backgroundColor: iSdisabled ? AppColors.mainColor : '#3e96a99d'},
            styles.loginBtn,
          ]}
          onPress={() => regesterUser()}>
          <Text
            style={{
              color: !iSdisabled ? '#ded2d2ab' : 'white',
              fontWeight: 900,
              fontSize: 20,
            }}>
            Signup
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={{color: 'white'}}>
          already have account?
          <Text
            style={{fontWeight: 800}}
            onPress={() => navigation.navigate('login')}>
            {' '}
            Login
          </Text>
        </Text>
      </View>
      <Loader isLoading={isLoading} />
    </ScrollView>
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
    marginTop: 75,
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
    bottom: 50,
  },
  loginBtn: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  passwordCon: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,

    paddingLeft: 20,
    borderRadius: 10,
    color: 'white',
    marginTop: 20,
  },
});

export default Signup;
