import { cn } from '@bem-react/classname';
import React, { FC } from 'react';
import { useFormattedAddress } from './Address.hooks';

import './Address.scss';

const CnAddress = cn('address');

interface IAddressProps {
    address: string;
}

export const Address: FC<IAddressProps> = ({ address }) => {
    const formattedAddress = useFormattedAddress(address);

    return <div className={CnAddress()}>{formattedAddress}</div>;
};
