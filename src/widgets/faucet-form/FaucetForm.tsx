import { cn } from '@bem-react/classname';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { InputToken } from 'shared/ui/input-token';
import { Button } from 'shared/ui/button';
import { useFaucetStore } from 'features/faucet';
import { useModalStore } from 'features/modal';
import { useAleoWallet } from 'shared/contexts/aleo-wallet-provider';
import { useBalance } from 'aleo-wallet-hooks';
import { config } from 'shared/config';
import { fromDecimals } from 'shared/utils';
import { Title } from 'shared/ui/title';
import { Switch } from 'shared/ui/switch';
import { FaucetType } from 'shared/types';
import { useLocation } from 'react-router-dom';
import { useWalletStore } from 'features/wallet';
import { useWallet } from 'shared/hooks/useWallet';

import './FaucetForm.scss';

const CnFaucetForm = cn('faucetForm');

export const FaucetForm: FC = () => {
    const { balance, publicFaucet, privateFaucet, publicBalance } =
        useWallet()();
    const [amount, setAmount] = useState('');
    const { state } = useLocation();
    const token = useFaucetStore((state) => state.token);
    const [faucetType, setFaucetType] = useState(
        state?.type ?? FaucetType.PRIVATE,
    );

    const amountChangeCallback = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!isNaN(Number(e.target.value))) {
                if (Number(e.target.value) >= 1000) {
                    setAmount('1000');
                } else {
                    setAmount(e.target.value);
                }
            }
        },
        [],
    );

    const fromattedBalance = useMemo(() => {
        if (faucetType === FaucetType.PUBLIC) {
            if (!publicBalance || !token) return '0';

            if (!publicBalance[token]) return '0';

            return fromDecimals(
                Number(publicBalance[token]),
                config[token].decimals,
            );
        }

        return token && balance[token] ? balance[token]?.balance ?? '0' : '0';
    }, [balance, token, faucetType, publicBalance]);

    const showModal = useModalStore((state) => state.showModal);

    const tokenClickCallback = useCallback(() => {
        showModal({
            modalType: 'chooseFaucetToken',
            modalState: {},
        });
    }, [showModal]);

    const submitClickCallback = useCallback(async () => {
        try {
            if (token && amount) {
                if (faucetType === FaucetType.PUBLIC) {
                    await publicFaucet(amount, token);
                } else {
                    await privateFaucet(amount, token);
                }
            }
        } catch {}
    }, [publicFaucet, privateFaucet, faucetType, amount, token]);

    const buttonContent = useMemo(() => {
        if (!token) return <Button disabled>Select token</Button>;

        if (!amount) return <Button disabled>Enter amount</Button>;

        return <Button onClick={submitClickCallback}>Claim</Button>;
    }, [token, amount, submitClickCallback]);

    return (
        <div className={CnFaucetForm()}>
            <div className={CnFaucetForm('header')}>
                <Title>Faucet</Title>
            </div>
            <div className={CnFaucetForm('content')}>
                <Switch
                    value={faucetType}
                    onChange={setFaucetType}
                    items={[
                        {
                            text: 'Public',
                            value: 'public',
                        },
                        {
                            text: 'Private',
                            value: 'private',
                        },
                    ]}
                />

                <div className={CnFaucetForm('label')}>
                    Enter amount to mint
                </div>

                <InputToken
                    onTokenClick={tokenClickCallback}
                    token={token}
                    balance={fromattedBalance}
                    description="Test token, no real value"
                    placeholder="0"
                    value={amount}
                    onChange={amountChangeCallback}
                />
            </div>

            {buttonContent}
        </div>
    );
};
