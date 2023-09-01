import { cn } from '@bem-react/classname';
import { Icons } from 'assets';
import { FC } from 'react';
import { Navigation } from 'shared/ui/navigation';
import { Wallet } from 'widgets/wallet';

import './Header.scss';

const CnHeader = cn('header');

export const Header: FC = () => {
    return (
        <div className={CnHeader()}>
            <div className={CnHeader('left')}>
                <Icons.Logo className={CnHeader('logo')} />

                <Navigation />
            </div>

            <Wallet />
        </div>
    );
};
