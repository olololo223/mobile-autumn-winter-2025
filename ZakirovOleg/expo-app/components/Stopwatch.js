import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

export default function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef(null);

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
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}.${String(Math.floor((elapsedMs % 1000) / 100))}`;

  return (
    <View>
      <Text style={styles.title}>Секундомер</Text>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 48, fontWeight: '700' }}>{display}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
        <TouchableOpacity style={styles.btnLg} onPress={start} disabled={isRunning}>
          <Text style={styles.btnLgText}>Старт</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnLg} onPress={stop} disabled={!isRunning}>
          <Text style={styles.btnLgText}>Стоп</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnLg} onPress={reset}>
          <Text style={styles.btnLgText}>Сброс</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


