import { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  PaperProvider,
  Appbar,
  Card,
  Button,
  Text,
  Snackbar,
} from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [contador, setContador] = useState(0);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('contador').then((data) => {
      if (data !== null) setContador(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('contador', JSON.stringify(contador));
  }, [contador]);

  const pedirPermiso = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setMensaje(status === 'granted' ? 'Permiso concedido' : 'Permiso denegado');
  };

  const enviarNotificacion = async () => {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Hola, mundito', body: 'Primera notifikeichon' },
      trigger: null,
    });
    setMensaje('Notificacion sendiada');
  };

  const notificarContador = async () => {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Contadorcito', body: `Valor actual es: ${contador}` },
      trigger: null,
    });
    setMensaje(`Notificacion con valor ${contador}`);
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Notificaciones" subtitle="Expo + AsyncStorage" />
      </Appbar.Header>

      <View style={{ padding: 16, gap: 16 }}>
        <Card>
          <Card.Title title="Contador" />
          <Card.Content>
            <Text variant="displayLarge" style={{ textAlign: 'center' }}>
              {contador}
            </Text>
          </Card.Content>
          <Card.Actions style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button onPress={() => setContador(Math.max(0, contador - 1))}>
              -
            </Button>
            <Button mode="contained" onPress={() => setContador(contador + 1)}>
              +
            </Button>
            <Button onPress={() => setContador(0)}>Reset</Button>
          </Card.Actions>
        </Card>

        <Card>
          <Card.Title title="Notificaciones" />
          <Card.Actions style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button icon="bell" onPress={pedirPermiso} >
              Permiso
            </Button>
            <Button mode="contained" icon="send" onPress={enviarNotificacion}>
              Send
            </Button>
            <Button mode="contained-tonal" icon="counter" onPress={notificarContador}>
              Contador
            </Button>
          </Card.Actions>
        </Card>
      </View>

      <Snackbar visible={!!mensaje} onDismiss={() => setMensaje('')} duration={2000}>
        {mensaje}
      </Snackbar>
    </PaperProvider>
  );
}
