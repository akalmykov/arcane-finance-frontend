import { FC, useCallback, useEffect, useState } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletName } from '@demox-labs/aleo-wallet-adapter-leo';
import { AleoWalletContext } from './AleoWalletProvider.hooks';
import {
    Transaction,
    WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';
import { Token } from 'shared/types';
import { config } from 'shared/config';
import { fromDecimals, toDecimals } from 'shared/utils';
import { useWait } from 'aleo-wallet-hooks';
import { useModalStore } from 'features/modal';
import { tokenFromTokenId } from './AleoWalletProvider.mappers';
import { useQuery } from 'react-query';
import {
    fetchPublicPairs,
    fetchPrivateSwapData,
    fetchPublicBalance,
} from 'shared/api/aleo';
import { useWalletStore } from 'features/wallet';

const TRANSACTION_FEE = 5_500_000;

export const AleoWalletProvider: FC<any> = ({ children }) => {
    const {
        publicKey,
        select,
        wallet,
        requestRecords,
        requestTransaction,
        transactionStatus,
    } = useWallet();
    const [balance, setBalance] = useState<any>({});

    const { data: publicBalance, refetch: refetchPublicBalance } = useQuery({
        queryKey: ['publicBalance', publicKey],
        queryFn: () => publicKey && fetchPublicBalance(publicKey),
        enabled: !!publicKey,
        refetchInterval: 10_000,
    });

    const fetchBalanceByContract = useCallback(
        async (contract: string) => {
            if (publicKey && requestRecords) {
                const records = await requestRecords(contract);

                const balance = records.reduce((acc, record) => {
                    const newAcc = JSON.parse(JSON.stringify(acc));

                    const { data, spent } = record;

                    const tokenId = data.token_id.replace('.private', '');
                    const token = tokenFromTokenId[tokenId];
                    const amount = Number(
                        data.amount.replace('u128.private', ''),
                    );

                    if (spent) {
                        return newAcc;
                    }

                    if (!newAcc[token]) {
                        newAcc[token] = {
                            record,
                            tokenId,
                            balance: fromDecimals(
                                amount,
                                config[token].decimals,
                            ),
                            amount,
                        };
                    } else {
                        newAcc[token].balance += fromDecimals(
                            amount,
                            config[token].decimals,
                        );
                        newAcc[token].amount += amount;
                    }

                    return newAcc;
                }, {});

                setBalance(balance);
            }
        },
        [requestRecords, publicKey],
    );

    useEffect(() => {
        if (publicKey) {
            fetchBalanceByContract(config.private.contract);
        }
    }, [fetchBalanceByContract, publicKey]);

    const { wait, status } = useWait({
        poolingInterval: 1000,
    });

    const showModal = useModalStore((state) => state.showModal);
    const closeModal = useModalStore((state) => state.closeModal);

    const setSelectedWallet = useWalletStore(
        (state) => state.setSelectedWallet,
    );

    const connect = useCallback(() => {
        try {
            select(LeoWalletName);

            closeModal();

            setSelectedWallet('aleo');
        } catch (err) {}
    }, [select, closeModal, setSelectedWallet]);

    const privateSwap = async (
        fromToken: Token,
        toToken: Token,
        amount: number | string,
    ) => {
        try {
            showModal({
                modalType: 'transactionLoader',
                modalState: {},
            });

            const currBalance = balance[fromToken];

            if (publicKey) {
                const publicSwapData = await fetchPrivateSwapData(
                    config[fromToken].id,
                    config[toToken].id,
                    toDecimals(Number(amount), config[fromToken].decimals),
                );

                const inputs: any = [
                    currBalance.record,
                    publicSwapData.quote,
                    publicSwapData.signature,
                ];

                const aleoTransaction = Transaction.createTransaction(
                    publicKey,
                    WalletAdapterNetwork.Testnet,
                    config.private.contract,
                    config.private.swap,
                    inputs,
                    TRANSACTION_FEE,
                );

                if (requestTransaction) {
                    const txId = await requestTransaction(aleoTransaction);
                    await wait(txId);
                }

                await fetchBalanceByContract(config.private.contract);
            }
        } catch (error) {
            console.log(JSON.stringify(error), 'MY ERROR');
        } finally {
            closeModal();
        }
    };

    const publicSwap = async (
        fromToken: Token,
        toToken: Token,
        amountIn: number | string,
        amountOut: number | string,
    ) => {
        try {
            showModal({
                modalType: 'transactionLoader',
                modalState: {},
            });

            const nAmountIn = toDecimals(
                Number(amountIn),
                config[fromToken].decimals,
            );

            const nAmountOut = toDecimals(
                Number(amountOut),
                config[fromToken].decimals,
            );

            if (publicKey) {
                const inputs: any = [
                    config[fromToken].publicField,
                    config[toToken].publicField,
                    `${nAmountIn}u128`,
                    `${nAmountOut}u128`,
                    publicKey,
                ];

                const aleoTransaction = Transaction.createTransaction(
                    publicKey,
                    WalletAdapterNetwork.Testnet,
                    config.public.contract,
                    config.public.swap,
                    inputs,
                    7_500_000,
                );

                if (requestTransaction) {
                    const txId = await requestTransaction(aleoTransaction);

                    await wait(txId);

                    await refetchPublicBalance();
                }
            }
        } catch (error) {
        } finally {
            closeModal();
        }
    };

    const privateFaucet = useCallback(
        async (amount: number | string, token: Token) => {
            try {
                showModal({
                    modalType: 'transactionLoader',
                    modalState: {},
                });

                if (publicKey) {
                    const inputs = [
                        publicKey,
                        config[token].privateKey,
                        `${toDecimals(
                            Number(amount),
                            config[token].decimals,
                        )}u128`,
                    ];

                    const aleoTransaction = Transaction.createTransaction(
                        publicKey,
                        WalletAdapterNetwork.Testnet,
                        config.private.contract,
                        config.private.mint,
                        inputs,
                        TRANSACTION_FEE,
                    );

                    if (requestTransaction) {
                        const txId = await requestTransaction(aleoTransaction);

                        await wait(txId);
                    }

                    await fetchBalanceByContract(config.private.contract);
                }
            } catch (error) {
            } finally {
                closeModal();
            }
        },
        [
            closeModal,
            publicKey,
            requestTransaction,
            showModal,
            wait,
            fetchBalanceByContract,
        ],
    );

    const publicFaucet = useCallback(
        async (amount: string, token: Token) => {
            try {
                showModal({
                    modalType: 'transactionLoader',
                    modalState: {},
                });

                const nAmount = toDecimals(
                    Number(amount),
                    config[token].decimals,
                );

                if (publicKey) {
                    const inputs = [
                        config[token].publicField,
                        publicKey,
                        `${nAmount}u128`,
                    ];

                    const aleoTransaction = Transaction.createTransaction(
                        publicKey,
                        WalletAdapterNetwork.Testnet,
                        config.public.contract,
                        config.public.mint,
                        inputs,
                        TRANSACTION_FEE,
                    );

                    if (requestTransaction) {
                        const txId = await requestTransaction(aleoTransaction);

                        await wait(txId);

                        await refetchPublicBalance();
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                closeModal();
            }
        },
        [
            closeModal,
            publicKey,
            requestTransaction,
            showModal,
            wait,
            refetchPublicBalance,
        ],
    );

    const publicAddLiquidity = useCallback(
        async (
            amountIn: string,
            amountOut: string,
            tokenIn: Token,
            tokenOut: Token,
        ) => {
            try {
                showModal({
                    modalType: 'transactionLoader',
                    modalState: {},
                });

                const nAmountIn = toDecimals(
                    Number(amountIn),
                    config[tokenIn].decimals,
                );
                const nAmountOut = toDecimals(
                    Number(amountOut),
                    config[tokenOut].decimals,
                );

                if (publicKey) {
                    const inputs = [
                        config[tokenIn].publicField,
                        config[tokenOut].publicField,
                        `${nAmountIn}u128`,
                        `${nAmountOut}u128`,
                        `0u128`,
                        `0u128`,
                        publicKey,
                    ];

                    const aleoTransaction = Transaction.createTransaction(
                        publicKey,
                        WalletAdapterNetwork.Testnet,
                        config.public.contract,
                        config.public.addLiquidity,
                        inputs,
                        9_000_000,
                    );

                    if (requestTransaction) {
                        const txId = await requestTransaction(aleoTransaction);

                        await wait(txId);

                        await refetchPublicBalance();
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                closeModal();
            }
        },
        [
            closeModal,
            publicKey,
            requestTransaction,
            showModal,
            wait,
            refetchPublicBalance,
        ],
    );

    return (
        <AleoWalletContext.Provider
            value={{
                connect,
                address: publicKey,
                icon: wallet?.adapter.icon,
                balance,
                privateSwap,
                publicSwap,
                publicFaucet,
                privateFaucet,
                publicBalance,
                publicAddLiquidity,
            }}
        >
            {children}
        </AleoWalletContext.Provider>
    );
};
