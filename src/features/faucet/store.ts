import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { MaybeToken, Token } from 'shared/types';

interface FaucetState {
    token: MaybeToken;
    changeToken: (token: Token) => void;
}

export const useFaucetStore = create<FaucetState>()(
    devtools(
        immer((set) => ({
            token: null,
            changeToken: (token) =>
                set((state) => {
                    state.token = token;
                }),
        })),
    ),
);
