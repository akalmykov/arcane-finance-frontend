import { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Tabs } from 'shared/ui/tabs';

import './TradeHistory.scss';

const CnTradeHistory = cn('tradeHistory');

export const TradeHistory: FC = () => {
    return (
        <div className={CnTradeHistory()}>
            <div className={CnTradeHistory('content')}>
                <Tabs
                    tabs={[
                        {
                            title: 'Transactions',
                            value: 'Transactions',
                        },
                        {
                            title: 'Limit order',
                            value: 'Limit order',
                        },
                        {
                            title: 'Range positions',
                            value: 'Range positions',
                        },
                    ]}
                    value="Transactions"
                />
            </div>
        </div>
    );
};
