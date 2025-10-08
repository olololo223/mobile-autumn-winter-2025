import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // Gallery styles
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
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 40,
      paddingHorizontal: 16,
    },
    tabBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f7f7f7',
      borderWidth: 1,
      borderColor: '#e5e5e5',
      borderRadius: 8,
      padding: 6,
      marginBottom: 12,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 6,
      alignItems: 'center',
    },
    tabButtonActive: {
      backgroundColor: '#000',
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
    },
    tabTextActive: {
      color: '#fff',
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 16,
      textAlign: 'center',
    },
    table: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#fafafa',
    },
    headerRow: {
      backgroundColor: '#f0f0f0',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    cell: {
      paddingHorizontal: 4,
    },
    nameCell: {
      flex: 2,
    },
    priceCell: {
      flex: 1,
      textAlign: 'right',
    },
    qtyCell: {
      flex: 2,
    },
    headerText: {
      fontWeight: '700',
    },
    qtyControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 10,
    },
    btn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 22,
    },
    // Large buttons (used in Stopwatch)
    btnLg: {
      minWidth: 110,
      height: 48,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnLgText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 22,
    },
    qtyText: {
      minWidth: 28,
      textAlign: 'center',
      fontSize: 16,
    },
    separator: {
      height: 1,
      backgroundColor: '#e6e6e6',
    },
    totalBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      backgroundColor: '#f9f9f9',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '600',
    },
    totalValue: {
      fontSize: 18,
      fontWeight: '700',
    },
  });