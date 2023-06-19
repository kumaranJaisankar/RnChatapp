import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDetails = () => {
  const [userDeatils, setDetails] = useState({});

  useEffect(() => {
    const fromLoacalStore = async () => {
      const respose = JSON.parse(await AsyncStorage.getItem('userDetail'));

      setDetails(respose);
    };
    fromLoacalStore();
  }, []);

  return (
    <View>
      <View style={styles.detailContainer}>
        <Text>Name</Text>
        <View style={styles.innerStyle}>
          <Text style={styles.textStyle}>{userDeatils.name}</Text>
        </View>
      </View>
      <View style={styles.detailContainer}>
        <Text>Email</Text>
        <View style={styles.innerStyle}>
          <Text style={styles.textStyle}>{userDeatils.email}</Text>
        </View>
      </View>
      <View style={styles.detailContainer}>
        <Text>Phone</Text>
        <View style={styles.innerStyle}>
          <Text style={styles.textStyle}>{userDeatils.phNumber}</Text>
        </View>
      </View>
    </View>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  detailContainer: {
    width: Dimensions.get('window').width,

    paddingHorizontal: 10,
    marginBottom: 20,
  },
  innerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  textStyle: {
    color: 'white',
    fontSize: 22,
  },
});
