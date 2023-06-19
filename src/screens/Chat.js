import React, {useState, useCallback, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';

const Chat = ({route}) => {
  console.log(route.params, 'params');
  const [messages, setMessages] = useState([]);
  const [isLoading, setloading] = useState(false);

  const reciverName = route.params.data.name;
  const reciverId = route.params.data.userId;
  const userId = route.params.id;
  const userAvatar = route.params.avatar;

  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(userId + reciverId)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    setloading(true);
    subscriber.onSnapshot(querysnapshot => {
      const allMessages = querysnapshot.docs.map(item => {
        return {...item._data, createdAt: Date.parse(new Date())};
      });
      setMessages(allMessages);
      setloading(false);
    });

    return () => subscriber();
  }, []);

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const myMessage = {
      ...msg,
      sendBy: userId,
      sendTo: reciverId,

      createdAt: Date.parse(msg.createdAt),
    };
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, myMessage),
    );
    firestore()
      .collection('chats')
      .doc('' + userId + reciverId)
      .collection('messages')
      .add(myMessage);

    firestore()
      .collection('chats')
      .doc('' + reciverId + userId)
      .collection('messages')
      .add(myMessage);
  }, []);
  const bubbleStyle = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: '#ffffff',
          },
          left: {
            color: 'white',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#544f4f',
          },
        }}
      />
    );
  };
  const inputStyle = props => {
    return (
      <InputToolbar
        renderComposer={props1 => (
          <Composer {...props1} textInputStyle={{color: '#fdfdfd'}} />
        )}
        {...props}
        containerStyle={{
          backgroundColor: 'transparent',
          color: 'red',
        }}
      />
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      {messages.length === 0 && (
        <View style={styles.emptyMsg}>
          <Image
            style={{width: 100, height: 100}}
            source={require('../images/mail-box.png')}
          />
          <Text>
            start your conversation with{' '}
            <Text
              style={{
                fontWeight: 900,

                fontFamily: 'Montserrat-Light',
              }}>
              {reciverName}
            </Text>
          </Text>
        </View>
      )}
      <GiftedChat
        renderSend={sendProps => {
          <TouchableOpacity {...sendProps}>
            <Image source={require('../images/user.png')} />
          </TouchableOpacity>;
        }}
        isCustomViewBottom={true}
        alwaysShowSend={true}
        renderInputToolbar={inputStyle}
        renderBubble={bubbleStyle}
        timeTextStyle={{color: 'red'}}
        messages={messages}
        onSend={messages => onSend(messages)}
        renderUsername={user => console.log(user, 'is user')}
        user={{
          _id: userId,
          avatar:
            userAvatar === null
              ? 'https://res.cloudinary.com/dtbarluca/image/upload/v1686832069/user_jreqhj.png'
              : userAvatar,
        }}
      />
      <Loader isLoading={isLoading} />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  emptyMsg: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
