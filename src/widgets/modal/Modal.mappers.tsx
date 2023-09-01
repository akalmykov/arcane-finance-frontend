import { ChooseFaucetTokenModal } from './ui/ChooseFaucetTokenModal';
import { ChooseSwapTokenModal } from './ui/ChooseSwapTokenModal';
import { ChooseTradeTokenModal } from './ui/ChooseTradeTokenModal';
import { ConnectWalletModal } from './ui/ConnectWalletModal';
import { TransactionLoader } from './ui/TransactionLoader';

export const contentFromModalType: Record<string, React.ReactNode | undefined> =
    {
        chooseSwapToken: <ChooseSwapTokenModal />,
        chooseFaucetToken: <ChooseFaucetTokenModal />,
        transactionLoader: <TransactionLoader />,
        chooseTradeToken: <ChooseTradeTokenModal />,
        connectWallet: <ConnectWalletModal />,
    };
