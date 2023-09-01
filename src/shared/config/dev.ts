import { Token } from 'shared/types';

export const devConfig = {
    private: {
        contract: 'rfq_v000003.aleo',
        mint: 'mint_private',
        swap: 'quote_swap',
    },
    public: {
        contract: 'arcane_ammswap_000003.aleo',
        mint: 'mint_public',
        swap: 'swap_exact_tokens_for_tokens',
        addLiquidity: 'add_liquidity',
        mappings: {
            balance_keys: 'user_balance_keys',
            balances: 'balances',
            pools: 'pools',
        },
    },
    [Token.USDT]: {
        id: '1',
        get privateKey() {
            return `${this.id}u64`;
        },
        get privateId() {
            return `${this.privateKey}.private`;
        },
        get publicField() {
            return `${this.id}field`;
        },
        decimals: 6,
        pools: {
            [Token.WBTC]:
                '7272793623780849601025599264504435830603006198223398755991931069927075891304field',
            [Token.USDC]:
                '3130363935161052217091678569603581698680581101624659434159697904938492787471field',
            [Token.WETH]: '',
        },
        reserves: {
            [Token.USDC]: 'reserve_a',
            [Token.USDT]: 'reserve_a',
            [Token.WETH]: 'reserve_a',
            [Token.WBTC]: 'reserve_a',
        },
        mappings: {
            pair: '3130363935161052217091678569603581698680581101624659434159697904938492787471field',
        },
    },
    [Token.USDC]: {
        id: '2',
        get privateKey() {
            return `${this.id}u64`;
        },
        get privateId() {
            return `${this.privateKey}.private`;
        },
        get publicField() {
            return `${this.id}field`;
        },
        decimals: 6,
        pools: {
            [Token.WBTC]:
                '2118626344297382192766379980355059762283352909403788412540671520938965377860field',
            [Token.USDT]:
                '3130363935161052217091678569603581698680581101624659434159697904938492787471field',
            [Token.WETH]: '',
        },
        reserves: {
            [Token.USDC]: 'reserve_a',
            [Token.USDT]: 'reserve_b',
            [Token.WETH]: 'reserve_a',
            [Token.WBTC]: 'reserve_a',
        },
        mappings: {
            pair: '3130363935161052217091678569603581698680581101624659434159697904938492787471field',
        },
    },
    [Token.WBTC]: {
        id: '3',
        get privateKey() {
            return `${this.id}u64`;
        },
        get privateId() {
            return `${this.privateKey}.private`;
        },
        get publicField() {
            return `${this.id}field`;
        },
        decimals: 6,
        pools: {
            [Token.WBTC]:
                '7272793623780849601025599264504435830603006198223398755991931069927075891304field',
            [Token.USDT]:
                '3130363935161052217091678569603581698680581101624659434159697904938492787471field',
            [Token.WETH]: '',
        },
        reserves: {
            [Token.USDC]: 'reserve_b',
            [Token.USDT]: 'reserve_b',
            [Token.WETH]: 'reserve_a',
            [Token.WBTC]: 'reserve_a',
        },
    },
    [Token.WETH]: {
        id: '4',
        get privateKey() {
            return `${this.id}u64`;
        },
        get privateId() {
            return `${this.privateKey}.private`;
        },
        get publicField() {
            return `${this.id}field`;
        },
        decimals: 6,
        pools: {
            [Token.WBTC]:
                '7272793623780849601025599264504435830603006198223398755991931069927075891304field',
            [Token.USDT]:
                '3130363935161052217091678569603581698680581101624659434159697904938492787471field',
            [Token.WETH]: '',
        },
        reserves: {
            [Token.USDC]: 'reserve_b',
            [Token.USDT]: 'reserve_b',
            [Token.WETH]: 'reserve_b',
            [Token.WBTC]: 'reserve_b',
        },
    },
};
