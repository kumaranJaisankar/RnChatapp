import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React from 'react';

const Loader = props => {
  const {isLoading} = props;
  return (
    <Modal visible={isLoading} transparent>
      <View style={styles.mainScreen}>
        <View style={styles.loderContainer}>
          <ActivityIndicator size={'large'} color={'white'} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  mainScreen: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loderContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000045',
  },
});
