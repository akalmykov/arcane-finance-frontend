import { cn } from '@bem-react/classname';
import React, { FC, useMemo } from 'react';
import { ChooseToken } from '../choose-token';
import { Balance } from '../balance';
import { MaybeToken, Token } from 'shared/types';

import './InputToken.scss';

const CnInputToken = cn('inputToken');

interface IInputTokenProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    token?: MaybeToken;
    onTokenClick?: () => void;
    balance?: string | number | null;
    balanceMaxClickCallback?: () => void;
    description?: string;
}

export const InputToken: FC<IInputTokenProps> = ({
    token,
    onTokenClick,
    balance,
    balanceMaxClickCallback,
    description,
    ...inputProps
}) => {
    const footerContent = useMemo(() => {
        if ((balance === null || balance === undefined) && !description)
            return null;

        return (
            <div className={CnInputToken('row')}>
                {balance !== null && balance !== undefined ? (
                    <Balance
                        amount={balance}
                        maxClickHandler={balanceMaxClickCallback}
                    />
                ) : (
                    <div></div>
                )}
                <div className={CnInputToken('description')}>{description}</div>
            </div>
        );
    }, [balance, description, balanceMaxClickCallback]);

    return (
        <div className={CnInputToken()}>
            <div className={CnInputToken('row')}>
                <ChooseToken selectedToken={token} onClick={onTokenClick} />

                <input {...inputProps} />
            </div>
            {footerContent}
        </div>
    );
};
