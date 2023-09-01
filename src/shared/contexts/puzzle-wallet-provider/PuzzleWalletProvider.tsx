import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletName } from '@demox-labs/aleo-wallet-adapter-leo';
import {
    PuzzleWalletContext,
    usePuzzleExecute,
} from './PuzzleWalletProvider.hooks';
import {
    Transaction,
    WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';
import { Token } from 'shared/types';
import { config } from 'shared/config';
import { fromDecimals, toDecimals } from 'shared/utils';
import { useWait } from 'aleo-wallet-hooks';
import { useModalStore } from 'features/modal';
import { tokenFromTokenId } from './PuzzleWalletProvider.mappers';
import { useQuery } from 'react-query';
import {
    fetchPublicPairs,
    fetchPrivateSwapData,
    fetchPublicBalance,
} from 'shared/api/aleo';
import { useAccount, useConnect, useRecords } from '@puzzlehq/sdk';
import { Icons } from 'assets';
import { getObjectValueByKey } from 'shared/utils/getObjectValueByKey';
import { useWalletStore } from 'features/wallet';

const TRANSACTION_FEE = 5_500_000;

export const PuzzleWalletProvider: FC<any> = ({ children }) => {
    // const {
    //     publicKey,
    //     select,
    //     wallet,
    //     requestRecords,
    //     requestTransaction,
    //     transactionStatus,
    // } = useWallet();
    const { account } = useAccount();
    const publicKey = useMemo(() => account?.address ?? null, [account]);

    const [balance, setBalance] = useState<any>({});

    const { data: publicBalance, refetch: refetchPublicBalance } = useQuery({
        queryKey: ['publicBalance', publicKey],
        queryFn: () => publicKey && fetchPublicBalance(publicKey),
        enabled: !!publicKey,
        refetchInterval: 10_000,
    });

    const { request: fetchBalance, records } = useRecords({
        filter: { program_id: config.private.contract, type: 'unspent' },
        formatted: true,
    });

    useEffect(() => {
        if (records && publicKey) {
            fetchBalanceByContract();
        }
    }, [records, publicKey]);

    const fetchBalanceByContract = useCallback(async () => {
        try {
            if (publicKey && records) {
                const balance = records.reduce((acc: any, record: any) => {
                    const newAcc = JSON.parse(JSON.stringify(acc));

                    const { data } = record;

                    const tokenId = data.token_id.replace('.private', '');
                    const token = tokenFromTokenId[tokenId];
                    const amount = Number(
                        data.amount.replace('u128.private', ''),
                    );

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
        } catch (err) {}
    }, [publicKey, records]);

    const showModal = useModalStore((state) => state.showModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const setSelectedWallet = useWalletStore(
        (state) => state.setSelectedWallet,
    );

    const { connect: puzzleConnect } = useConnect();

    const connect = useCallback(async () => {
        try {
            closeModal();

            await puzzleConnect();

            setSelectedWallet('puzzle');
        } catch (err) {}
    }, [puzzleConnect, closeModal, setSelectedWallet]);

    const {
        execute: privateSwapExecute,
        waitForResult: privateSwapWaitForResult,
    } = usePuzzleExecute(config.private.contract, config.private.swap);

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

                privateSwapExecute(inputs);

                await privateSwapWaitForResult();

                // const aleoTransaction = Transaction.createTransaction(
                //     publicKey,
                //     WalletAdapterNetwork.Testnet,
                //     config.private.contract,
                //     config.private.swap,
                //     inputs,
                //     TRANSACTION_FEE,
                // );

                // if (requestTransaction) {
                //     const txId = await requestTransaction(aleoTransaction);
                //     await wait(txId);
                // }

                fetchBalance();
                // await fetchBalanceByContract(config.private.contract);
            }
        } catch (error) {
            console.log(JSON.stringify(error), 'MY ERROR');
        } finally {
            closeModal();
        }
    };

    const {
        execute: publicSwapExecute,
        waitForResult: publicSwapWaitForResult,
    } = usePuzzleExecute(config.public.contract, config.public.swap);

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

                publicSwapExecute(inputs);

                await publicSwapWaitForResult();

                // const aleoTransaction = Transaction.createTransaction(
                //     publicKey,
                //     WalletAdapterNetwork.Testnet,
                //     config.public.contract,
                //     config.public.swap,
                //     inputs,
                //     7_500_000,
                // );

                // if (requestTransaction) {
                //     const txId = await requestTransaction(aleoTransaction);

                //     await wait(txId);

                // }

                await refetchPublicBalance();
            }
        } catch (error) {
        } finally {
            closeModal();
        }
    };

    const {
        execute: privateFaucetExecute,
        waitForResult: privateFaucetWaitForResult,
    } = usePuzzleExecute(config.private.contract, config.private.mint);

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

                    privateFaucetExecute(inputs);

                    await privateFaucetWaitForResult();

                    // if (requestTransaction) {
                    //     const txId = await requestTransaction(aleoTransaction);

                    //     await wait(txId);
                    // }

                    // await fetchBalanceByContract(config.private.contract);

                    fetchBalance();
                }
            } catch (error) {
            } finally {
                closeModal();
            }
        },
        [
            closeModal,
            publicKey,
            showModal,
            fetchBalance,
            privateFaucetExecute,
            privateFaucetWaitForResult,
        ],
    );

    const {
        execute: publicFaucetExecute,
        waitForResult: publicFaucetWaitForResult,
    } = usePuzzleExecute(config.public.contract, config.public.mint);

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

                    publicFaucetExecute(inputs);

                    await publicFaucetWaitForResult();

                    // const aleoTransaction = Transaction.createTransaction(
                    //     publicKey,
                    //     WalletAdapterNetwork.Testnet,
                    //     config.public.contract,
                    //     config.public.mint,
                    //     inputs,
                    //     TRANSACTION_FEE,
                    // );

                    // if (requestTransaction) {
                    //     const txId = await requestTransaction(aleoTransaction);

                    //     await wait(txId);

                    // }

                    await refetchPublicBalance();
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
            showModal,
            refetchPublicBalance,
            publicFaucetExecute,
            publicFaucetWaitForResult,
        ],
    );

    const {
        execute: publicAddLiquidityExecute,
        waitForResult: publicAddLiquidityWaitForResult,
    } = usePuzzleExecute(config.public.contract, config.public.addLiquidity);

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

                    publicAddLiquidityExecute(inputs);

                    await publicAddLiquidityWaitForResult();

                    // const aleoTransaction = Transaction.createTransaction(
                    //     publicKey,
                    //     WalletAdapterNetwork.Testnet,
                    //     config.public.contract,
                    //     config.public.addLiquidity,
                    //     inputs,
                    //     9_000_000,
                    // );

                    // if (requestTransaction) {
                    //     const txId = await requestTransaction(aleoTransaction);

                    //     await wait(txId);

                    await refetchPublicBalance();
                    // }
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
            showModal,
            refetchPublicBalance,
            publicAddLiquidityExecute,
            publicAddLiquidityWaitForResult,
        ],
    );

    return (
        <PuzzleWalletContext.Provider
            value={{
                connect,
                address: publicKey,
                icon: <Icons.Puzzle />,
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
        </PuzzleWalletContext.Provider>
    );
};
