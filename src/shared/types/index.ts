export enum Token {
    USDT = 'usdt',
    USDC = 'usdc',
    WETH = 'weth',
    WBTC = 'wbtc',
}

export type MaybeToken = Token | null | undefined;

export enum FaucetType {
    PRIVATE = 'private',
    PUBLIC = 'public',
}
