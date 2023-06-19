import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
let id = '';
let avatar = '';
const ChatPage = ({navigation, route}) => {
  const isFocused = useIsFocused();

  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [render, setRender] = useState(true);

  useEffect(() => {
    getUsers();
    return () => console.log('cleanup');
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      const fromAsyncStore = await AsyncStorage.getItem('userDetail');

      const userDetail = JSON.parse(fromAsyncStore);
      id = userDetail.userId;
      avatar = userDetail.avatar;
      firestore()
        .collection('Users')
        .where('email', '!=', userDetail.email)
        .get()
        .then(res => {
          if (res.docs !== []) {
            setAllUsers(res.docs);
          }
        });
      setLoading(false);
    } catch (error) {
      Alert.alert(error);
    }
  };

  return (
    <View style={styles.chatConatiner}>
      <FlatList
        keyExtractor={(_, index) => index.toString()}
        data={allUsers}
        renderItem={({item, index}) => {
          const userAvatar = item.data().avatar;
          const itemSerilize = {...item.data()};

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.userContainer}
              onPress={() =>
                navigation.navigate('chat', {
                  data: itemSerilize,
                  id: id,
                  avatar: avatar,
                })
              }>
              <View>
                {userAvatar === null ? (
                  <Image
                    style={{width: 40, height: 40}}
                    source={require('../images/user.png')}
                  />
                ) : (
                  <Image
                    style={{width: 40, height: 40, borderRadius: 20}}
                    source={{uri: userAvatar}}
                  />
                )}
                <View style={styles.activeProfile}></View>
              </View>
              <View>
                <Text
                  style={{color: 'white', fontSize: 17, fontWeight: 'bold'}}>
                  {item.data().name}
                </Text>
                <Text style={{color: '#a59a9a', fontSize: 12}}>
                  {item.data().email}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <Loader isLoading={isLoading} />
    </View>
  );
};
const styles = StyleSheet.create({
  chatConatiner: {
    backgroundColor: 'black',
    flex: 1,
    paddingTop: 20,
  },
  userContainer: {
    width: Dimensions.get('window').width - 50,
    height: 60,
    backgroundColor: '#453f3f',
    borderWidth: 0.6,
    margin: 10,
    alignSelf: 'center',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  activeProfile: {
    width: 8,
    height: 8,
    backgroundColor: '#03fd03',
    borderRadius: 10,
    position: 'relative',
    top: -10,
    alignSelf: 'flex-end',
  },
});

export default ChatPage;
