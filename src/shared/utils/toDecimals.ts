import BigNumber from 'bignumber.js';

export const toDecimals = (amount: number, decimals: number) =>
    BigNumber(amount)
        .multipliedBy(10 ** decimals)
        .toNumber();
