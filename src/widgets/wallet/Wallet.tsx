import { cn } from '@bem-react/classname';
import { FC, useCallback } from 'react';
import { Address } from 'shared/ui/address';
import { useWallet } from 'shared/hooks/useWallet';

import './Wallet.scss';
import { useModalStore } from 'features/modal';

const CnWallet = cn('wallet');

export const Wallet: FC = () => {
    const { address, icon } = useWallet()();
    const showModal = useModalStore((store) => store.showModal);

    const connectClickCallback = useCallback(() => {
        showModal({
            modalState: {},
            modalType: 'connectWallet',
        });
    }, [showModal]);

    return (
        <div
            onClick={connectClickCallback}
            className={CnWallet({ connected: !!address })}
        >
            {address ? (
                <>
                    {icon}

                    <Address address={address} />
                </>
            ) : (
                'Connect wallet'
            )}
        </div>
    );
};
