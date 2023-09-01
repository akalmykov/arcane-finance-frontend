import { FC } from 'react';
import { PuzzleWalletProvider, PuzzleWeb3Modal } from '@puzzlehq/sdk';

export const PuzzleProvider: FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <>
            <PuzzleWalletProvider>{children}</PuzzleWalletProvider>
            <PuzzleWeb3Modal
                dAppName="Your dApp Name"
                dAppDescription="Answers to all your privacy needs."
                dAppUrl="localhost:3000"
                dAppIconURL="https://link.to/assets/your_logo.png"
            />
        </>
    );
};
