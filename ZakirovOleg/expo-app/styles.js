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
    authContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    authScrollContent: {
      padding: 16,
      paddingBottom: 16,
    },
    authCard: {
      borderWidth: 1,
      borderColor: '#e5e5e5',
      borderRadius: 10,
      backgroundColor: '#fafafa',
      padding: 16,
      marginBottom: 16,
    },
    authCardTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 12,
    },
    authField: {
      marginBottom: 8,
    },
    authFieldLabel: {
      fontSize: 14,
      color: '#777',
    },
    authFieldValue: {
      fontSize: 16,
      fontWeight: '600',
    },
    authFieldValueSmall: {
      fontSize: 12,
      color: '#999',
    },
    authSection: {
      marginTop: 24,
    },
    authSectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
    },
    authUserCard: {
      borderWidth: 1,
      borderColor: '#e5e5e5',
      borderRadius: 8,
      backgroundColor: '#fff',
      padding: 12,
      marginBottom: 8,
    },
    authUserCardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    authUserCardInfo: {
      flex: 1,
    },
    authUserCardName: {
      fontSize: 16,
      fontWeight: '600',
    },
    authUserCardEmail: {
      fontSize: 14,
      color: '#777',
      marginTop: 2,
    },
    authUserCardRole: {
      fontSize: 12,
      color: '#999',
      marginTop: 4,
    },
    authPagination: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#e5e5e5',
    },
    authPaginationText: {
      fontSize: 16,
    },
    authLoadingContainer: {
      padding: 16,
      alignItems: 'center',
    },
    authErrorContainer: {
      padding: 16,
    },
    authErrorText: {
      color: 'red',
      marginBottom: 8,
    },
    authEmptyContainer: {
      padding: 16,
      alignItems: 'center',
    },
    authEmptyText: {
      color: '#777',
    },
    authFormContainer: {
      marginBottom: 24,
    },
    authFormTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 16,
      textAlign: 'center',
    },
    authFormInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      fontSize: 16,
    },
    authFormButton: {
      backgroundColor: '#000000',
      borderRadius: 10,
      padding: 16,
      alignItems: 'center',
      marginBottom: 12,
    },
    authFormButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
    authFormLink: {
      marginTop: 12,
      alignItems: 'center',
    },
    authFormLinkText: {
      color: '#007AFF',
      fontSize: 14,
    },
    authFormSwitch: {
      marginTop: 16,
      alignItems: 'center',
    },
    authFormSwitchText: {
      color: '#007AFF',
      fontSize: 14,
    },
    authButtonBlue: {
      backgroundColor: '#007AFF',
    },
  });