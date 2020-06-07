import React, { useState, useEffect } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import ibge from '../../services/ibge';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    ibge.get<IBGEUFResponse[]>('localidades/estados').then(response => {
      setUfs(response.data.map(uf => uf.sigla));
    });
  }, []);

  useEffect(() => {
    if (selectedUf === null) {
      return;
    }
    ibge.get<IBGECityResponse[]>(`localidades/estados/${selectedUf}/municipios`).then(response => {
      setCities(response.data.map(city => city.nome));
    });
  }, [selectedUf]);

  const handleSelectUf = (value: string) => {
    if (value !== selectedUf) {
      setSelectedCity(null);
    }
    setSelectedUf(value);
  };

  const handleSelectCity = (value: string) => {
    setSelectedCity(value);
  };

  const handleNavigateToPoints = () => {
    navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
  };
  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>
      <View style={styles.footer}>
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          style={styles}
          onValueChange={handleSelectUf}
          placeholder={{ label: 'Selecione uma UF', value: null }}
          items={ufs.map(uf => ({ label: uf, value: uf }))}
          value={selectedUf}
        />
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          style={styles}
          onValueChange={handleSelectCity}
          placeholder={{ label: 'Selecione uma cidade', value: null }}
          disabled={!selectedUf || cities.length < 1}
          items={cities.map(city => ({ label: city, value: city }))}
          value={selectedCity}
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24} />
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
