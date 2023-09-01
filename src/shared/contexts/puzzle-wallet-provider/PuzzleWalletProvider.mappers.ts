import { Token } from 'shared/types';

export const tokenFromTokenId: Record<string, Token> = {
    '1u64': Token.USDT,
    '2u64': Token.USDC,
    '3u64': Token.WBTC,
    '4u64': Token.WETH,
};
