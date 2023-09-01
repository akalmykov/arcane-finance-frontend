import { cn } from '@bem-react/classname';
import { FC } from 'react';
import { Chart } from 'widgets/chart';
import { TradeForm } from 'widgets/trade-form';
import { TradeHistory } from 'widgets/trade-history';

import './Trade.scss';

const CnTrade = cn('trade');

export const Trade: FC = () => {
    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                }}
            >
                <div className={CnTrade('chart')}>
                    <Chart />
                </div>
                <div>
                    <TradeForm />
                </div>
            </div>
            {/* <TradeHistory /> */}
        </div>
    );
};
