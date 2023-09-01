import { cn } from '@bem-react/classname';
import { FC, useState } from 'react';
import { Switch } from 'shared/ui/switch';
import { Title } from 'shared/ui/title';
import { TradeFormType } from './TradeForm.types';
import { PublicSwapForm } from 'widgets/public-swap-form';
import { PublicPoolForm } from 'widgets/public-pool-form';
import { FaucetBanner } from 'shared/ui/faucet-banner/FaucetBanner';
import { FaucetType } from 'shared/types';

import './TradeForm.scss';

const CnTradeForm = cn('tradeForm');

export const TradeForm: FC = () => {
    const [formType, setFormType] = useState(TradeFormType.POOL);

    return (
        <div className={CnTradeForm()}>
            <div className={CnTradeForm('header')}>
                <Title>Trade</Title>

                {/* <Icons.Gear /> */}
            </div>

            <Switch
                value={formType}
                onChange={setFormType}
                items={[
                    {
                        text: 'Swap',
                        value: TradeFormType.SWAP,
                    },
                    {
                        text: 'Limit',
                        value: TradeFormType.LIMIT,
                        disabled: true,
                    },
                    {
                        text: 'Pool',
                        value: TradeFormType.POOL,
                        disabled: false,
                    },
                ]}
            />

            {formType === TradeFormType.SWAP && <PublicSwapForm />}
            {formType === TradeFormType.POOL && <PublicPoolForm />}

            <FaucetBanner state={{ type: FaucetType.PUBLIC }} link="/faucet" />
        </div>
    );
};
