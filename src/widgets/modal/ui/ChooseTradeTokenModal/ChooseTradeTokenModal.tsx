import { FC, useCallback, useMemo } from 'react';
import { cn } from '@bem-react/classname';
import { Icons } from 'assets';
import { Token as IToken } from 'shared/types';
import { iconByToken } from 'shared/consts/mappers';
import { useModalStore } from 'features/modal';
import { tokens } from './ChooseTradeTokenModal.constants';
import { useTradeStore } from 'features/trade';

import './ChooseTradeTokenModal.scss';

const CnChooseTradeTokenModal = cn('chooseTradeTokenModal');

export const ChooseTradeTokenModal: FC = () => {
    const closeModal = useModalStore((state) => state.closeModal);
    const modalState = useModalStore((state) => state.state);

    const changeFromToken = useTradeStore((state) => state.changeFromToken);
    const changeToToken = useTradeStore((state) => state.changeToToken);
    const fromToken = useTradeStore((state) => state.fromToken);
    const toToken = useTradeStore((state) => state.toToken);

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
        <div className={CnChooseTradeTokenModal()}>
            <div className={CnChooseTradeTokenModal('title')}>Choose token</div>

            <div className={CnChooseTradeTokenModal('search')}>
                <Icons.Search />
                <input placeholder="Search" />
            </div>

            <div className={CnChooseTradeTokenModal('content')}>
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

const CnToken = cn('chooseTradeTokenModalToken');

const Token: FC<ITokenProps> = ({ token, selected, onClick }) => {
    return (
        <div onClick={onClick} className={CnToken({ selected })}>
            <div className={CnToken('icon')}>{iconByToken[token]}</div>
            <div className={CnToken('label')}>{token}</div>
        </div>
    );
};
