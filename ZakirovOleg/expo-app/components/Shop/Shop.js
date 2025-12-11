import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from './styles';

const PRODUCTS = [
  { id: '1', name: 'Молоко', price: 120 },
  { id: '2', name: 'Хлеб', price: 100 },
  { id: '3', name: 'Сыр', price: 80 },
  { id: '4', name: 'Яйца', price: 100 },
  { id: '5', name: 'Масло', price: 85 },
  { id: '6', name: 'Кефир', price: 80 },
  { id: '7', name: 'Сметана', price: 80 },
  { id: '8', name: 'Йогурт', price: 50 },
  { id: '9', name: 'Колбаса', price: 200 },
  { id: '10', name: 'Сахар', price: 150 },
];

export default function Shop() {
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    for (const p of PRODUCTS) initial[p.id] = 0;
    return initial;
  });

  const totalAmount = PRODUCTS.reduce((sum, p) => {
    return sum + p.price * (quantities[p.id] || 0);
  }, 0);

  const increment = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrement = (id) => {
    setQuantities((prev) => {
      const nextValue = Math.max(0, (prev[id] || 0) - 1);
      return { ...prev, [id]: nextValue };
    });
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.nameCell, styles.headerText]}>Товар</Text>
      <Text style={[styles.cell, styles.priceCell, styles.headerText]}>Цена</Text>
      <Text style={[styles.cell, styles.qtyCell, styles.headerText, styles.qtyHeaderText]}>
        Количество
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const qty = quantities[item.id] || 0;
    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text>
        <Text style={[styles.cell, styles.priceCell]}>
          {item.price.toFixed(2)}₽
        </Text>
        <View
          style={[
            styles.cell,
            styles.qtyCell,
            styles.qtyControls,
          ]}
        >
          <TouchableOpacity style={styles.btn} onPress={() => decrement(item.id)}>
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{qty}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => increment(item.id)}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.table}>
        {renderHeader()}
        <FlatList
          data={PRODUCTS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 8 }}
        />
      </View>
      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Итого:</Text>
        <Text style={styles.totalValue}>{totalAmount.toFixed(2)}₽</Text>
      </View>
    </View>
  );
}


