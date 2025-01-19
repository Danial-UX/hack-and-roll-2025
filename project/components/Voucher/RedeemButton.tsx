import React, { useState } from 'react';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { Alert } from 'react-native';
import { styles } from './styles';

const RedeemButton = ({
  cost,
  id,
  orderId,
  voucher_id,
}: {
  cost: number;
  id: string;
  orderId: string;
  voucher_id: number;
}) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true); // Show a loading indicator
    try {
      // Fetch user points
      const { data, error } = await supabase
        .from('users')
        .select('points')
        .eq('id', id)
        .single();

      if (error) throw new Error('Error fetching user points.');

      if (data?.points < cost) {
        Alert.alert('Insufficient Points', 'You do not have enough points to redeem this voucher.');
        setIsLoading(false);
        return;
      }

      // Deduct points from the user
      const { error: updateError } = await supabase
        .from('users')
        .update({ points: data.points - cost })
        .eq('id', id);

      if (updateError) throw new Error('Error updating user points.');

      // Update the active voucher in the order
      const { error: voucherError } = await supabase
        .from('Orders_testing')
        .update({ active_voucher: voucher_id })
        .eq('id', orderId);

      if (voucherError) throw new Error('Error applying voucher to the order.');

      // Navigate back to the Order page and refresh the state
      Alert.alert('Success', 'Voucher redeemed successfully!');
      navigation.navigate('Order', { orderId });
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false); // Stop the loading indicator
    }
  };

  return (
    <Button
      title={isLoading ? 'Processing...' : 'Buy Voucher'}
      onPress={handlePress}
      buttonStyle={styles.button}
      disabled={isLoading} // Disable the button while loading
    />
  );
};

export default RedeemButton;
