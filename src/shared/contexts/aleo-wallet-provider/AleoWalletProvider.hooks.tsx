import { createContext, useContext } from 'react';

export const AleoWalletContext = createContext<any>({});

export const useAleoWallet = () => useContext(AleoWalletContext);
