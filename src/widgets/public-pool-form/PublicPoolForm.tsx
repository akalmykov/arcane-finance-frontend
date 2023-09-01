import { cn } from '@bem-react/classname';
import { useModalStore } from 'features/modal';
import { useTradeStore } from 'features/trade';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAleoWallet } from 'shared/contexts/aleo-wallet-provider';
import { Button } from 'shared/ui/button';
import { InputToken } from 'shared/ui/input-token';
import { SwapButton } from 'shared/ui/swap-button';
import { fetchPublicBalance, fetchPublicPairs } from 'shared/api/aleo';
import { useQuery } from 'react-query';
import { FaucetType, Token } from 'shared/types';
import { fromDecimals, toDecimals } from 'shared/utils';
import { config } from 'shared/config';
import { FaucetBanner } from 'shared/ui/faucet-banner/FaucetBanner';

import './PublicPoolForm.scss';
import { useWallet } from 'shared/hooks/useWallet';

const CnPublicPoolForm = cn('publicPoolForm');

export const PublicPoolForm: FC = () => {
    const { fromToken, toToken, swapTokens } = useTradeStore();
    const { showModal } = useModalStore();
    const [amount, setAmount] = useState('');
    const { publicAddLiquidity, publicBalance } = useWallet()();

    const { data: publicPair } = useQuery({
        queryFn: () =>
            fromToken &&
            toToken &&
            fetchPublicPairs((config[fromToken].pools as any)[toToken]),
        queryKey: 'publicPairs',
        enabled: Boolean(fromToken && toToken),
        refetchInterval: 10_000,
    });

    const reserves = useMemo(() => {
        if (!publicPair || !fromToken || !toToken) return null;

        return {
            [fromToken]: publicPair[config[fromToken].reserves[toToken] as any],
            [toToken]: publicPair[config[toToken].reserves[fromToken] as any],
        } as any;
    }, [publicPair, fromToken, toToken]);

    const fromTokenBalance = useMemo(() => {
        if (!fromToken) return null;

        if (!publicBalance || !publicBalance[fromToken]) return '0';

        return fromDecimals(
            publicBalance[fromToken],
            config[fromToken].decimals,
        );
    }, [publicBalance, fromToken]);

    const toTokenBalance = useMemo(() => {
        if (!toToken) return null;

        if (!publicBalance || !publicBalance[toToken]) return '0';

        return fromDecimals(publicBalance[toToken], config[toToken].decimals);
    }, [publicBalance, toToken]);

    const { amountOut, amountIn, price } = useMemo(() => {
        if (!reserves || !fromToken || !toToken) return {};

        const amountInWithFee =
            Number(toDecimals(Number(amount), config[fromToken].decimals)) *
            0.997;

        const reserveIn = Number(reserves[fromToken]);
        const reserveOut = Number(reserves[toToken]);

        const amountOut =
            ((amountInWithFee * reserveOut) / (reserveIn + amountInWithFee)) *
            0.99;

        const price = amountOut / amountInWithFee;

        return {
            amountIn: amountInWithFee,
            amountOut,
            price,
        };
    }, [amount, fromToken, toToken, reserves]);

    const formattedAmountOut = useMemo(() => {
        if (!amountOut || !toToken) return '';

        return fromDecimals(amountOut, config[toToken].decimals).toFixed(3);
    }, [amountOut, toToken]);

    const amountChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(Number(e.target.value))) {
            setAmount(e.target.value);
        }
    };

    const tokenClickCallback = useCallback(
        (type: string) => {
            return () => {
                showModal({
                    modalType: 'chooseTradeToken',
                    modalState: {
                        type,
                    },
                });
            };
        },
        [showModal],
    );

    const submitClickHandler = useCallback(() => {
        if (publicAddLiquidity) {
            publicAddLiquidity(amount, formattedAmountOut, fromToken, toToken);
        }
    }, [publicAddLiquidity, fromToken, toToken, amount, formattedAmountOut]);

    const buttonContent = useMemo(() => {
        if (!fromToken || !toToken) {
            return <Button disabled>Select token</Button>;
        }

        if (!amount) {
            return <Button disabled>Enter amount</Button>;
        }

        if (Number(amount) > Number(fromTokenBalance)) {
            return <Button disabled>Not enough balance</Button>;
        }

        if (Number(formattedAmountOut) > Number(toTokenBalance)) {
            return <Button disabled>Not enough balance</Button>;
        }

        return <Button onClick={submitClickHandler}>Pool</Button>;
    }, [
        amount,
        fromToken,
        toToken,
        fromTokenBalance,
        toTokenBalance,
        formattedAmountOut,
        submitClickHandler,
    ]);

    return (
        <>
            <div className={CnPublicPoolForm('token')}>
                <InputToken
                    token={fromToken}
                    balance={fromTokenBalance}
                    placeholder="0"
                    value={amount}
                    onChange={amountChangeHandler}
                    onTokenClick={tokenClickCallback('from')}
                    balanceMaxClickCallback={() => {}}
                />
                <SwapButton onClick={swapTokens} />
                <InputToken
                    token={toToken}
                    disabled
                    value={formattedAmountOut}
                    onTokenClick={tokenClickCallback('to')}
                    balance={toTokenBalance}
                    placeholder="0"
                />
            </div>

            <div className={CnPublicPoolForm('details')}>
                {!isNaN(Number(price)) && (
                    <div className={CnPublicPoolForm('detailsItem')}>
                        <div>Price:</div>
                        <div>{price?.toFixed(7)}</div>
                    </div>
                )}
                <div className={CnPublicPoolForm('detailsItem')}>
                    <div>Gas fee:</div>
                    <div>$7.50</div>
                </div>
            </div>

            <div className={CnPublicPoolForm('footer')}>{buttonContent}</div>
        </>
    );
};
