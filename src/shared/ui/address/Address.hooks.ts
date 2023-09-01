import { useMemo } from 'react';

export const useFormattedAddress = (address: string) => {
    const formattedAddress = useMemo(() => {
        if (!address) return '';

        return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
    }, [address]);

    return formattedAddress;
};
