import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

interface WalletState {
    selectedWallet: null | 'puzzle' | 'aleo';
    setSelectedWallet: (value: 'puzzle' | 'aleo') => void;
}

export const useWalletStore = create<WalletState>()(
    devtools(
        immer((set) => ({
            selectedWallet: null,
            setSelectedWallet: (value: 'puzzle' | 'aleo') =>
                set((state) => {
                    state.selectedWallet = value;
                }),
        })),
    ),
);
