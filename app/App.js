import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

export default function App() {
  const [token, setToken] = useState('');
  const [channelId, setChannelId] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const notificationHandler = useCallback(
    async (remoteMessage) => {
      if (remoteMessage.notification) {
        /* eslint-disable no-console */
        console.log(JSON.stringify(remoteMessage));

        const { title, body } = remoteMessage.notification;
        await notifee.displayNotification({
          title,
          body,
          android: {
            channelId,
          },
        });
      }
    },
    [channelId],
  );

  const subscribe = useCallback(async () => {
    try {
      if (token.length > 0) {
        setDisabled(true);

        await axios.post(
          process.env.EXPO_PUBLIC_SUBSCRIPTION_URL,
          {
            token,
          },
          {
            headers: {
              'x-api-key': apiKey,
            },
          },
        );

        Alert.alert('Ready to receive notification!');
      }
    } catch (err) {
      console.log(err);
      Alert.alert(err.message);
    } finally {
      setDisabled(false);
    }
  }, [apiKey, token]);

  useEffect(() => {
    messaging()
      .getToken()
      .then((deviceToken) => {
        console.log(deviceToken);
        setToken(deviceToken);
      });
  }, []);

  useEffect(() => {
    if (token) {
      notifee
        .createChannel({
          id: 'default',
          name: 'Default Channel',
        })
        .then((defaultChannelId) => {
          setChannelId(defaultChannelId);
        });
    }
  }, [token]);

  useEffect(() => {
    if (channelId) {
      messaging().onMessage(notificationHandler);
    }
  }, [channelId]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Retrieving the device token.</Text>
      <Text style={styles.code}>
        {token || 'Failed to get the device token'}
      </Text>
      {channelId && (
        <>
          <Text>Provide an API Key and press the send button.</Text>
          <TextInput
            value={apiKey}
            onChangeText={setApiKey}
            style={styles.input}
            placeholder="GsvTS5VrBhKNqanESpQRTEm33SZThuj"
          />
          <Button title="Send" disabled={disabled} onPress={subscribe} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  code: {
    backgroundColor: '#eee',
    borderRadius: 15,
    color: '#333',
    marginVertical: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  input: {
    borderColor: '#eee',
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    textAlign: 'center',
    width: '98%',
  },
});
