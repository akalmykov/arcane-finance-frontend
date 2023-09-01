import { FC } from 'react';
import { Routes, Route } from 'react-router';
import { Swap } from 'pages/swap';
import { Faucet } from 'pages/faucet';
import { Trade } from 'pages/trade';

export const Router: FC<any> = () => {
    return (
        <Routes>
            <Route path="/" element={<Swap />} />
            <Route path="/faucet" element={<Faucet />} />
            <Route path="/trade" element={<Trade />} />
        </Routes>
    );
};
