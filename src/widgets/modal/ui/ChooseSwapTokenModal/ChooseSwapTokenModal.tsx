import { FC, useCallback, useMemo } from 'react';
import { cn } from '@bem-react/classname';
import { Icons } from 'assets';
import { Token as IToken } from 'shared/types';
import { iconByToken } from 'shared/consts/mappers';
import { useModalStore } from 'features/modal';
import { tokens } from './ChooseSwapTokenModal.constants';
import { useSwapStore } from 'features/swap';

import './ChooseSwapTokenModal.scss';

const CnChooseSwapTokenModal = cn('chooseSwapTokenModal');

export const ChooseSwapTokenModal: FC = () => {
    const closeModal = useModalStore((state) => state.closeModal);
    const modalState = useModalStore((state) => state.state);
    const changeFromToken = useSwapStore((state) => state.changeFromToken);
    const changeToToken = useSwapStore((state) => state.changeToToken);
    const fromToken = useSwapStore((state) => state.fromToken);
    const toToken = useSwapStore((state) => state.toToken);

    const tokenClickCallback = useCallback(
        (token: IToken) => {
            return () => {
                if (modalState?.type === 'from') {
                    changeFromToken(token);
                } else {
                    changeToToken(token);
                }

                closeModal();
            };
        },
        [changeFromToken, changeToToken, modalState, closeModal],
    );

    const selectedToken = useMemo(
        () => (modalState?.type === 'from' ? fromToken : toToken),
        [modalState, toToken, fromToken],
    );

    return (
        <div className={CnChooseSwapTokenModal()}>
            <div className={CnChooseSwapTokenModal('title')}>Choose token</div>

            <div className={CnChooseSwapTokenModal('search')}>
                <Icons.Search />
                <input placeholder="Search" />
            </div>

            <div className={CnChooseSwapTokenModal('content')}>
                {tokens.map((token) => (
                    <Token
                        token={token}
                        key={token}
                        selected={token === selectedToken}
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

const CnToken = cn('chooseSwapTokenModalToken');

const Token: FC<ITokenProps> = ({ token, selected, onClick }) => {
    return (
        <div onClick={onClick} className={CnToken({ selected })}>
            <div className={CnToken('icon')}>{iconByToken[token]}</div>
            <div className={CnToken('label')}>{token}</div>
        </div>
    );
};
