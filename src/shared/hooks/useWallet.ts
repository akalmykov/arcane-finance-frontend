import { useWalletStore } from 'features/wallet';
import { useAleoWallet } from 'shared/contexts/aleo-wallet-provider';
import { usePuzzleWallet } from 'shared/contexts/puzzle-wallet-provider/PuzzleWalletProvider.hooks';

export const useWallet = () => {
    const selectedWallet = useWalletStore((state) => state.selectedWallet);

    if (selectedWallet === 'aleo') {
        return useAleoWallet;
    } else {
        return usePuzzleWallet;
    }
};
