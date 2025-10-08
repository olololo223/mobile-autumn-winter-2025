import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../styles';

const IMAGES = [
  {
    id: '1',
    source: require('../images/animals/kitten.jpg'),
    type: 'animals',
    label: 'Kitten',
  },
  {
    id: '2',
    source: require('../images/animals/dog.jpg'),
    type: 'animals',
    label: 'Dog',
  },
  {
    id: '3',
    source: require('../images/fruits/apple.jpg'),
    type: 'fruits',
    label: 'Apple',
  },
  {
    id: '4',
    source: require('../images/fruits/orange.jpg'),
    type: 'fruits',
    label: 'Orange',
  },
  {
    id: '5',
    source: require('../images/people/artist.jpg'),
    type: 'people',
    label: 'Artist',
  },
  {
    id: '6',
    source: require('../images/people/athlete.jpg'),
    type: 'people',
    label: 'Athlete',
  },
];

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'animals', label: 'Животные' },
  { key: 'fruits', label: 'Фрукты' },
  { key: 'people', label: 'Люди' },
];

export default function Gallery() {
  const [activeType, setActiveType] = useState('all');

  const filtered = useMemo(() => {
    if (activeType === 'all') return IMAGES;
    return IMAGES.filter((item) => item.type === activeType);
  }, [activeType]);

  const renderItem = ({ item }) => (
    <View style={styles.galleryCard}>
      <Image
        source={item.source}
        style={styles.galleryImage}
        resizeMode="cover"
      />
      <Text style={styles.galleryCaption}>{item.label}</Text>
    </View>
  );

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    FILTERS.map((f) => ({ label: f.label, value: f.key }))
  );

  return (
    <View style={styles.galleryContainer}>
      <View style={styles.galleryPickerWrap}>
        <Text style={styles.galleryPickerLabel}>Тип:</Text>
        <DropDownPicker
          open={open}
          value={activeType}
          items={items}
          setOpen={setOpen}
          setValue={setActiveType}
          setItems={setItems}
          containerStyle={{ flex: 1 }}
          zIndex={1000}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.galleryRow}
        contentContainerStyle={styles.galleryList}
        renderItem={renderItem}
      />
    </View>
  );
}

