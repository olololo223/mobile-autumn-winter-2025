import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

export default function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedMs((ms) => ms + 100);
      }, 100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const reset = () => {
    setIsRunning(false);
    setElapsedMs(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const display = `${String(minutes).padStart(2, '0')}:` +
    `${String(seconds % 60).padStart(2, '0')}.` +
    `${String(Math.floor((elapsedMs % 1000) / 100))}`;

  useEffect(() => {
    let isActive = true;
    async function loadWeather() {
      try {
        setWeatherLoading(true);
        setWeatherError(null);
        const url =
          'https://api.open-meteo.com/v1/forecast' +
          '?latitude=62.0281&longitude=129.7326&current_weather=true';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather request failed');
        const json = await res.json();
        if (!isActive) return;
        setWeather(json.current_weather || null);
      } catch (e) {
        if (!isActive) return;
        setWeatherError('Не удалось загрузить погоду');
      } finally {
        if (isActive) setWeatherLoading(false);
      }
    }
    loadWeather();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <View>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 48, fontWeight: '700' }}>{display}</Text>
      </View>
      <View
        style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}
      >
        <TouchableOpacity
          style={styles.btnLg}
          onPress={start}
          disabled={isRunning}
        >
          <Text style={styles.btnLgText}>Старт</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnLg}
          onPress={stop}
          disabled={!isRunning}
        >
          <Text style={styles.btnLgText}>Стоп</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnLg} onPress={reset}>
          <Text style={styles.btnLgText}>Сброс</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
          Погода (Якутск)
        </Text>
        {weatherLoading ? (
          <Text>Загрузка...</Text>
        ) : weatherError ? (
          <Text>{weatherError}</Text>
        ) : weather ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: '#e5e5e5',
              borderRadius: 10,
              backgroundColor: '#fafafa',
              padding: 12,
            }}
          >
            <Text style={{ fontSize: 16 }}>
              Температура: {weather.temperature}°C
            </Text>
            <Text style={{ fontSize: 16 }}>
              Ветер: {weather.windspeed} км/ч
            </Text>
            <Text style={{ fontSize: 12, color: '#777', marginTop: 4 }}>
              Обновлено: {weather.time}
            </Text>
          </View>
        ) : (
          <Text>Нет данных о погоде</Text>
        )}
      </View>
    </View>
  );
}


