import { StyleSheet } from 'react-native';
import Order from './Order';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 85,
    height: 85,
    marginRight: 16,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // space between name and price
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    fontSize: 14,
    marginVertical: 8,
  },
  cost: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalCost: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  //category of menu items
  categoryContainer: {
    padding: 16,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'column',
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: '#ffc89a',
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  selectedCategoryButton: {
    backgroundColor: '#ff9e4d',
  },
  categoryScrollView: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  
  //order quantity setters
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    padding: 0, 
    backgroundColor: '#ff9e4d',
  },

  // order confirmation
  ordercontainer: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  ordername: { fontSize: 18, fontWeight: '600' },
  quantity: { fontSize: 16, color: 'gray' },
  ordercost: { fontSize: 16, color: '#ff9e4d' },
  errorText: { fontSize: 16, fontWeight: 'bold' },

  // order confirmation button 
  confirmButton: { backgroundColor: '#ff9e4d', padding: 16, borderRadius: 8, marginTop: 16, marginBottom: 50 },

  orderListContainer: { maxHeight: 200 },

  voucherInfo: { fontSize: 16, color: 'gray', marginBottom: 16 },
});