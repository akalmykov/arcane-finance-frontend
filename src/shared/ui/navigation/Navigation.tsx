import { cn } from '@bem-react/classname';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './Navigation.scss';

const CnNavigation = cn('navigation');

export const Navigation: FC = () => {
    const location = useLocation();

    return (
        <div className={CnNavigation()}>
            <Link
                to="/"
                className={CnNavigation('item', {
                    selected: location.pathname === '/',
                })}
            >
                Private Swap
            </Link>
            <Link
                to="/trade"
                className={CnNavigation('item', {
                    selected: location.pathname === '/trade',
                })}
            >
                Trade
            </Link>
            <Link
                to="/faucet"
                className={CnNavigation('item', {
                    selected: location.pathname === '/faucet',
                })}
            >
                Faucet
            </Link>
            {/* <Link to="/" className={CnNavigation('item', { disabled: true })}>
                Pools
            </Link> */}
        </div>
    );
};
