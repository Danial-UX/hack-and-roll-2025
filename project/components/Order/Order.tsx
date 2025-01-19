import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, AppState } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import ConfirmOrderButton from './ConfirmOrderButton';
import PaymentOptions from '../Payment/Payment';
import VoucherButton from '../Voucher/VoucherButton';

export default function Order() {
    const route = useRoute();
    let { orderId } = route.params as { orderId: string } || {};
    const navigation = useNavigation();
    const { orderId } = route.params || {};  // Safe destructuring

    // Ensure orderId exists
    if (!orderId) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No order provided. Please add items to your order.</Text>
            </View>
        );
    }

    const total_text = () => {
        return(<Text style={styles.totalCost}>Total: ${totalCost.toFixed(2)}</Text>)
    }

    interface OrderItem {
        menuItem_id: string;
        quantity: number;
        Menu: {
            name: string;
            cost: number;
        };
    }

    interface Voucher {
        id: number;
        name: string;
        discount: number;
    }

    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCost, setTotalCost] = useState(0);
    const [voucher, setVoucher] = useState<Voucher | null>(null);
    const [voucherApplied, setVoucherApplied] = useState(false); // Track if the voucher has been applied

    useEffect(() => {
      if (orderId) {
        const interval = setInterval(() => {
          fetchOrderDetails(); // Fetch details periodically
        }, 1000); 
        return () => clearInterval(interval);
      }
    }, [orderId, totalCost]);

    const total_text = () => {
      return(<Text style={styles.totalCost}>Total: ${totalCost.toFixed(2)}</Text>)
    }

    const calculateCostWithVoucher = async (orderId: string, totalCost: number) => {
      try {
        const {data, error} = await supabase.from('Orders_testing')
        .select('active_voucher').eq('id', orderId).single()

        if (data?.active_voucher) {
          return totalCost - 1
        }
        return totalCost

      } catch (error) {
        return totalCost
      }
    }
    
        if (orderId) fetchOrderDetails();
        
        // Handle app state changes (when app goes to background or inactive)
        const appStateListener = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                clearOrder();
            }
        });

        // Cleanup listener when component unmounts
        return () => appStateListener.remove();
    }, [orderId]);

    const applyVoucher = () => {
        setVoucher({ id: 1, name: 'Discount', discount: 1 });  // Hardcode voucher details
        setVoucherApplied(true);  // Set the voucher as applied
        
        // Immediately reduce totalCost by $1
        setTotalCost(prevCost => prevCost - 1);
    };

    const fetchOrderDetails = async () => {
      try {
        const {data: status, error} = await supabase.from('Orders_testing')
              .select('payment_completed').eq('id', orderId).single()

        if (status?.payment_completed == true) {
          // clear order
          orderId = ''
        } else if (orderId != '') {
          const { data: orderItemsData, error: orderItemsError } = await supabase
            .from('OrderItems_testing')
            .select('menuItem_id, quantity')
            .eq('order_id', orderId);
    
          if (orderItemsError) throw new Error(orderItemsError.message);
    
          const menuItemsPromises = orderItemsData.map(async (orderItem) => {
            const { data: menuItemData, error: menuItemError } = await supabase
              .from('Menu')
              .select('name, cost')
              .eq('id', orderItem.menuItem_id)
              .single();
    
            if (menuItemError) throw new Error(menuItemError.message);
    
            return {
              ...orderItem,
              Menu: menuItemData,
            };
          });
    
          const menuItems = await Promise.all(menuItemsPromises);
          setOrderItems(menuItems);
          
          const totalCost = menuItems.reduce((sum, item) => {
            return sum + (item.Menu.cost * item.quantity);
          }, 0);

          const finalTotalCost = await calculateCostWithVoucher(orderId, totalCost)

          setTotalCost(finalTotalCost);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
        setLoading(true);

        try {
            const {data: status, error} = await supabase.from('Orders_testing')
            .select('payment_completed').eq('id', orderId).single()
            if (status?.payment_completed == true) {
                // clear order
                orderId = ''
              } else if (orderId != '') {
                const { data: orderItemsData, error: orderItemsError } = await supabase
                  .from('OrderItems_testing')
                  .select('menuItem_id, quantity')
                  .eq('order_id', orderId);
          
                if (orderItemsError) throw new Error(orderItemsError.message);
          
                const menuItemsPromises = orderItemsData.map(async (orderItem) => {
                  const { data: menuItemData, error: menuItemError } = await supabase
                    .from('Menu')
                    .select('name, cost')
                    .eq('id', orderItem.menuItem_id)
                    .single();
          
                  if (menuItemError) throw new Error(menuItemError.message);
          
                  return {
                    ...orderItem,
                    Menu: menuItemData,
                  };
                });
          
                const menuItems = await Promise.all(menuItemsPromises);
                setOrderItems(menuItems);
                
                const baseTotalCost = menuItems.reduce((sum, item) => {
                  return sum + (item.Menu.cost * item.quantity);
                }, 0);
                
                // If voucher is applied, reduce the cost
                const finalTotalCost = voucherApplied ? baseTotalCost - 1 : baseTotalCost;
                setTotalCost(finalTotalCost);
              }
            } catch (error) {
              console.error('Error fetching order details:', error);
            } finally {
              setLoading(false);
            }
    };

    // Clear the order state
    const clearOrder = () => {
        setOrderItems([]);
        setVoucher(null);
        setTotalCost(0);
        setVoucherApplied(false); // Reset voucher state
    };

    // Complete the order and update backend
    const completeOrder = async () => {
        try {
            clearOrder();  // Clear order locally
            Alert.alert('Success', 'Order completed!');
            navigation.navigate('Home');  // Navigate to home after completion
        } catch (error) {
            console.error('Error completing order:', error);
            Alert.alert('Error', 'Failed to complete the order.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#ff9e4d" />;
    }

    return (
        <View style={styles.ordercontainer}>
            <Text style={styles.title}>Please confirm your order.</Text>
            <Text style={styles.subtitle}>Order ID: {orderId}</Text>
            <FlatList
                data={orderItems}
                keyExtractor={(item) => item.menuItem_id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.ordername}>{item.Menu.name}</Text>
                        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                        <Text style={styles.ordercost}>Cost: ${item.Menu.cost * item.quantity}</Text>
                    </View>
                )}
            />
            <Text style={styles.totalCost}>Total: ${totalCost.toFixed(2)}</Text>
            <VoucherButton orderId={orderId} onVoucherApplied={applyVoucher} />
            <Text style={styles.voucherInfo}>
                {voucherApplied ? `$1 OFF applied` : 'No voucher applied'}
            </Text>
            <PaymentOptions orderId={orderId} totalCost={totalCost} onPaymentSuccess={completeOrder} />
        </View>
    );
}
