import { cn } from '@bem-react/classname';
import { FC } from 'react';

import './Balance.scss';

const CnBalance = cn('balance');

interface IBalanceProps {
    amount: string | number;
    maxClickHandler?: () => void;
}

export const Balance: FC<IBalanceProps> = ({ amount, maxClickHandler }) => {
    return (
        <div className={CnBalance()}>
            Balance: {amount}
            {maxClickHandler && (
                <div onClick={maxClickHandler} className={CnBalance('max')}>
                    MAX
                </div>
            )}
        </div>
    );
};
