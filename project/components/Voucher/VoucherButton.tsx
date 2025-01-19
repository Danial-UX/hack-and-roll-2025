import React from 'react';
import { Button, Input } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

const VoucherButton = ({ orderId, onVoucherApplied }: { orderId: string; onVoucherApplied: () => void }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('Voucher', { orderId, onVoucherApplied });
    };

    return (
        <Button
            title="Buy / Redeem Voucher"
            onPress={handlePress}
            buttonStyle={styles.redeembutton}
        />
    );
};

export default VoucherButton;