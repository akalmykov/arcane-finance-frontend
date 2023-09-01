import { cn } from '@bem-react/classname';
import { FC } from 'react';
import Lottie from 'lottie-react';
import animationData from './TransactionLoader.animationData.json';

import './TransactionLoader.scss';

const CnTransactionLoader = cn('transactionLoader');

export const TransactionLoader: FC = () => {
    return (
        <div className={CnTransactionLoader()}>
            <Lottie animationData={animationData} />
        </div>
    );
};
