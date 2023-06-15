import React, {useState, useCallback, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import {View, StyleSheet} from 'react-native';

const Chat = ({route}) => {
  const senderId = (route.params.const[(messages, setMessages)] = useState([]));
  console.log(route.params.data, 'this is roiu');
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello kumaran',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
        pending: true,
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
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
      <GiftedChat
        renderInputToolbar={inputStyle}
        renderBubble={bubbleStyle}
        timeTextStyle={{color: 'red'}}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});
