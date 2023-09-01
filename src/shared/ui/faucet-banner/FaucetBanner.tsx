import { cn } from '@bem-react/classname';
import { Icons } from 'assets';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import './FaucerBanner.scss';

const CnFaucetBanner = cn('faucetBanner');

interface IFaucetBannerProps {
    link?: string;
    state?: any;
}

export const FaucetBanner: FC<IFaucetBannerProps> = ({
    link = '',
    state = {},
}) => {
    return (
        <Link state={state} to={link} className={CnFaucetBanner()}>
            <div className={CnFaucetBanner('left')}>
                <div className={CnFaucetBanner('title')}>
                    Testnet token faucet
                </div>
                <div className={CnFaucetBanner('subtitle')}>
                    Claim token on Aleo Testnet
                </div>
            </div>

            <Icons.ArrowRight />
        </Link>
    );
};
