import { cn } from '@bem-react/classname';
import { FC, useCallback, useMemo, useState, useEffect } from 'react';
import { Icons } from 'assets';
import { useSwapStore } from 'features/swap';
import { Button } from 'shared/ui/button';
import { useAleoWallet } from 'shared/contexts/aleo-wallet-provider';
import { InputToken } from 'shared/ui/input-token';
import { useModalStore } from 'features/modal';
import { FaucetType, MaybeToken } from 'shared/types';
import { useBalance } from 'aleo-wallet-hooks';
import { config } from 'shared/config';
import { fromDecimals, toDecimals } from 'shared/utils';
import { Title } from 'shared/ui/title';
import { SwapButton } from 'shared/ui/swap-button';
import { useQuery } from 'react-query';
import { fetchPrivateSwapData } from 'shared/api/aleo';
import { getObjectValueByKey } from 'shared/utils/getObjectValueByKey';
import { useDeferredValue } from 'shared/hooks';
import { Link } from 'react-router-dom';
import { FaucetBanner } from 'shared/ui/faucet-banner/FaucetBanner';

import './Swap.scss';
import { useWallet } from 'shared/hooks/useWallet';

const CnSwap = cn('swap');

export const Swap: FC = () => {
    const { fromToken, toToken, swapTokens } = useSwapStore((state) => state);
    const { swap, balance, privateSwap } = useWallet()();
    const [amount, setAmount] = useState('');
    const deferredAmount = useDeferredValue(amount, 500);

    const { data, refetch } = useQuery({
        queryKey: ['swapData', fromToken, toToken, deferredAmount],
        queryFn: () =>
            fromToken &&
            toToken &&
            fetchPrivateSwapData(
                config[fromToken].id,
                config[toToken].id,
                toDecimals(Number(amount), config[fromToken].decimals),
            ),
        enabled: false,
    });

    useEffect(() => {
        if (fromToken && toToken) {
            refetch();
        }
    }, [fromToken, toToken, refetch, deferredAmount]);

    const { price, amountOut } = useMemo(() => {
        if (!data || !fromToken || !toToken) return { price: null };

        const amountOut = getObjectValueByKey('amount_out', data.quote);
        const amountIn = getObjectValueByKey('amount_in', data.quote);

        const nAmountOut = fromDecimals(
            Number(amountOut),
            config[toToken].decimals,
        );

        const nAmountIn = fromDecimals(
            Number(amountIn),
            config[fromToken].decimals,
        );

        const price = nAmountOut / nAmountIn;

        return {
            price,
            amountOut: nAmountOut,
            amountIn: nAmountIn,
        };
    }, [data, fromToken, toToken]);

    const showModal = useModalStore((state) => state.showModal);

    const fromTokenBalance = useMemo(() => {
        if (!fromToken) return null;

        return balance[fromToken]?.balance;
    }, [balance, fromToken]);

    const toTokenBalance = useMemo(() => {
        if (!toToken) return null;

        return balance[toToken]?.balance;
    }, [balance, toToken]);

    const amountChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(Number(e.target.value))) {
            setAmount(e.target.value);
        }
    };

    const maxClickHandler = useCallback(() => {
        if (fromTokenBalance) {
            setAmount(fromTokenBalance);
        }
    }, [fromTokenBalance]);

    const fromattedFromBalance = useMemo(() => {
        if (!fromToken) return null;

        return fromTokenBalance ?? '0';
    }, [fromTokenBalance, fromToken]);

    const fromattedToBalance = useMemo(() => {
        if (!toToken) return null;

        return toTokenBalance ?? '0';
    }, [toTokenBalance, toToken]);

    const tokenClickCallback = useCallback(
        (type: 'from' | 'to', token: MaybeToken) => {
            return () => {
                showModal({
                    modalState: { type, selectedToken: token },
                    modalType: 'chooseSwapToken',
                });
            };
        },
        [showModal],
    );

    const swapClickHandler = useCallback(() => {
        try {
            if (privateSwap) {
                privateSwap(fromToken, toToken, amount);
            }
        } catch {}
    }, [privateSwap, fromToken, toToken, amount]);

    const buttonContent = useMemo(() => {
        if (!amount) {
            return <Button disabled>Enter amount</Button>;
        }

        if (Number(amount) > Number(fromTokenBalance)) {
            return <Button disabled>Not enough balance</Button>;
        }

        if (!fromToken || !toToken) {
            return <Button disabled>Select token</Button>;
        }

        return <Button onClick={swapClickHandler}>Swap</Button>;
    }, [amount, fromTokenBalance, swapClickHandler, fromToken, toToken]);

    const priceContent = useMemo(() => {
        if (!price || !fromToken || !toToken) return null;

        return (
            <div
                className={CnSwap('price')}
            >{`1 ${fromToken?.toUpperCase()} = ${price.toFixed(
                5,
            )} ${toToken?.toUpperCase()}`}</div>
        );
    }, [price, fromToken, toToken]);

    return (
        <div className={CnSwap()}>
            <div className={CnSwap('header')}>
                <Title>Private Swap</Title>
                {/* <div className={CnSwap('slippage')}>
                    <Icons.Gear />
                </div> */}
            </div>

            <div className={CnSwap('content')}>
                <InputToken
                    token={fromToken}
                    onTokenClick={tokenClickCallback('from', fromToken)}
                    balance={fromattedFromBalance}
                    value={amount}
                    onChange={amountChangeHandler}
                    balanceMaxClickCallback={maxClickHandler}
                    placeholder="0"
                />
                <SwapButton onClick={swapTokens} />
                <InputToken
                    value={amountOut}
                    disabled
                    token={toToken}
                    onTokenClick={tokenClickCallback('to', toToken)}
                    balance={fromattedToBalance}
                    placeholder="0"
                />
            </div>

            {priceContent}

            <div className={CnSwap('action')}>{buttonContent}</div>

            <FaucetBanner state={{ type: FaucetType.PRIVATE }} link="/faucet" />
        </div>
    );
};
