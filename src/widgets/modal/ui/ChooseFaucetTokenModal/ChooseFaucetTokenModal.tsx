import { FC, useCallback, useMemo } from 'react';
import { cn } from '@bem-react/classname';
import { Icons } from 'assets';
import { Token as IToken } from 'shared/types';
import { iconByToken } from 'shared/consts/mappers';
import { useModalStore } from 'features/modal';
import { tokens } from './ChooseFaucetTokenModal.constants';
import { useFaucetStore } from 'features/faucet';

import './ChooseFaucetTokenModal.scss';

const CnChooseFaucetTokenModal = cn('chooseFaucetTokenModal');

export const ChooseFaucetTokenModal: FC = () => {
    const closeModal = useModalStore((state) => state.closeModal);
    const { token: faucetToken, changeToken } = useFaucetStore();

    const tokenClickCallback = useCallback(
        (token: IToken) => {
            return () => {
                changeToken(token);

                closeModal();
            };
        },
        [changeToken, closeModal],
    );

    return (
        <div className={CnChooseFaucetTokenModal()}>
            <div className={CnChooseFaucetTokenModal('title')}>
                Choose token
            </div>

            <div className={CnChooseFaucetTokenModal('search')}>
                <Icons.Search />
                <input placeholder="Search" />
            </div>

            <div className={CnChooseFaucetTokenModal('content')}>
                {tokens.map((token) => (
                    <Token
                        token={token}
                        key={token}
                        selected={token === faucetToken}
                        onClick={tokenClickCallback(token)}
                    />
                ))}
            </div>
        </div>
    );
};

interface ITokenProps {
    token: IToken;
    selected?: boolean;
    onClick?: () => void;
}

const CnToken = cn('chooseFaucetTokenModalToken');

const Token: FC<ITokenProps> = ({ token, selected, onClick }) => {
    return (
        <div onClick={onClick} className={CnToken({ selected })}>
            <div className={CnToken('icon')}>{iconByToken[token]}</div>
            <div className={CnToken('label')}>{token}</div>
        </div>
    );
};
