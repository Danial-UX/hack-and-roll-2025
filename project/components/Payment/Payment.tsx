import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Assuming React Navigation is being used

interface PaymentOption {
  id: string;
  label: string;
  icon?: string;
}

interface PaymentOptionsProps {
  orderId: string;
  totalCost: number;
  onPaymentSuccess: () => void; // Add the onPaymentSuccess prop
}

const paymentMethods: PaymentOption[] = [
  { id: 'card', label: 'Credit/Debit Card', icon: 'card-outline' },
  { id: 'paypal', label: 'PayPal', icon: 'logo-paypal' },
  { id: 'apple', label: 'Apple Pay', icon: 'logo-apple' },
  { id: 'google', label: 'Google Pay', icon: 'logo-google' },
];

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  orderId,
  totalCost,
  onPaymentSuccess, // Destructure the onPaymentSuccess prop
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigation = useNavigation();

  const handleSelectOption = (id: string) => {
    setSelectedOption(id);
    setIsConfirmed(true);

    // Simulate a delay for confirmation display
    setTimeout(() => {
      setIsConfirmed(false);
      onPaymentSuccess(); // Call onPaymentSuccess when payment is successful
      navigation.navigate('Home'); // Redirect to the Home screen
    }, 2000); // 2-second delay
  };

  const renderOption = ({ item }: { item: PaymentOption }) => {
    const isSelected = item.id === selectedOption;

    return (
      <TouchableOpacity
        style={[styles.optionContainer, isSelected && styles.selectedOption]}
        onPress={() => handleSelectOption(item.id)}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={item.icon as any}
            size={24}
            color={isSelected ? '#fff' : '#ff9e4d'}
          />
        </View>
        <Text style={[styles.label, isSelected && styles.selectedLabel]}>
          {item.label}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    );
  };

  if (isConfirmed) {
    return (
      <View style={styles.confirmationContainer}>
        <Ionicons name="checkmark-circle-outline" size={64} color="#4CAF50" />
        <Text style={styles.confirmationText}>Payment Confirmed!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Method</Text>
      <Text style={styles.info}>Order ID: {orderId}</Text>
      <Text style={styles.info}>Total Cost: ${totalCost.toFixed(2)}</Text>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={renderOption}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  iconContainer: {
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#ff9e4d',
  },
  selectedLabel: {
    color: '#fff',
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  confirmationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 16,
  },
});

export default PaymentOptions;
