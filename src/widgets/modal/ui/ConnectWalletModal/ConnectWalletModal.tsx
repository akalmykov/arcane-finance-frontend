import { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Icons } from 'assets';

import './ConnectWalletModal.scss';
import { useAleoWallet } from 'shared/contexts/aleo-wallet-provider';
import { usePuzzleWallet } from 'shared/contexts/puzzle-wallet-provider/PuzzleWalletProvider.hooks';

const CnConnectWalletModal = cn('connectWalletModal');

export const ConnectWalletModal: FC = () => {
    const { connect: aleoConnect } = useAleoWallet();
    const { connect: puzzleConnect } = usePuzzleWallet();

    return (
        <div className={CnConnectWalletModal()}>
            <div className={CnConnectWalletModal('title')}>Connect wallet</div>

            <div className={CnConnectWalletModal('content')}>
                <div
                    onClick={puzzleConnect}
                    className={CnConnectWalletModal('item')}
                >
                    <Icons.Puzzle />

                    <div>Puzzle Wallet</div>
                </div>

                <div
                    onClick={aleoConnect}
                    className={CnConnectWalletModal('item')}
                >
                    <Icons.Leo />

                    <div>Leo Wallet</div>
                </div>
            </div>
        </div>
    );
};
