import { FC, useMemo } from 'react';
import {
    WalletProvider,
    WalletContext,
} from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import {
    DecryptPermission,
    WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';
import { WalletContextProvider } from 'aleo-wallet-hooks';

export const AleoProvider: FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const wallets = useMemo(
        () => [
            new LeoWalletAdapter({
                appName: 'Leo Wallet',
            }),
        ],
        [],
    );

    return (
        <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={WalletAdapterNetwork.Testnet}
            autoConnect
        >
            <WalletContextProvider context={WalletContext}>
                {children}
            </WalletContextProvider>
        </WalletProvider>
    );
};
