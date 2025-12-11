import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  galleryContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  galleryPickerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  galleryPickerLabel: {
    color: '#555',
    fontSize: 14,
  },
  galleryList: {
    padding: 12,
  },
  galleryRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  galleryCard: {
    width: '48%',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
  },
  galleryImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },
  galleryCaption: {
    padding: 8,
    fontSize: 14,
    color: '#333',
  },
});

