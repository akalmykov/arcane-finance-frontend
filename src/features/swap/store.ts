import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { Token } from 'shared/types';

interface SwapState {
    fromToken: Token | null;
    toToken: Token | null;
    changeFromToken: (token: Token) => void;
    changeToToken: (token: Token) => void;
    swapTokens: () => void;
}

export const useSwapStore = create<SwapState>()(
    devtools(
        immer((set) => ({
            fromToken: null,
            toToken: null,
            changeFromToken: (token: Token) =>
                set((state) => {
                    if (state.toToken === token) {
                        state.toToken = state.fromToken;
                    }

                    state.fromToken = token;
                }),
            changeToToken: (token: Token) =>
                set((state) => {
                    if (state.fromToken === token) {
                        state.fromToken = state.toToken;
                    }

                    state.toToken = token;
                }),
            swapTokens: () =>
                set((state) => {
                    const { fromToken, toToken } = state;

                    state.fromToken = toToken;
                    state.toToken = fromToken;
                }),
        })),
    ),
);
