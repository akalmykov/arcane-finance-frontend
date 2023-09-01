import { FC } from 'react';
import { BaseLayout } from 'shared/ui/base-layout';
import { Header } from 'widgets/header';
import { AleoProvider } from './providers/AleoProvider';
import { AleoWalletProvider } from 'shared/contexts/aleo-wallet-provider';
import { Router } from './providers/Router';
import { BrowserRouter } from 'react-router-dom';
import { Modal } from 'widgets/modal';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PuzzleProvider } from './providers/PuzzleProvider';
import { PuzzleWalletProvider } from 'shared/contexts/puzzle-wallet-provider';

const client = new QueryClient();

export const App: FC = () => {
    return (
        <QueryClientProvider client={client}>
            <BrowserRouter>
                <AleoProvider>
                    <AleoWalletProvider>
                        <PuzzleProvider>
                            <PuzzleWalletProvider>
                                <BaseLayout>
                                    <Modal />
                                    <Header />
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginTop: 48,
                                        }}
                                    >
                                        <Router />
                                    </div>
                                </BaseLayout>
                            </PuzzleWalletProvider>
                        </PuzzleProvider>
                    </AleoWalletProvider>
                </AleoProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};
