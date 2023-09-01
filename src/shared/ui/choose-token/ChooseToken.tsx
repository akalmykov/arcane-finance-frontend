import { cn } from '@bem-react/classname';
import { FC } from 'react';
import { MaybeToken } from 'shared/types';
import { Icons } from 'assets';
import { iconByToken } from 'shared/consts/mappers';

import './ChooseToken.scss';

const CnChooseToken = cn('chooseToken');

interface IChooseToken {
    selectedToken: MaybeToken;
    onClick?: () => void;
}

export const ChooseToken: FC<IChooseToken> = ({ selectedToken, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={CnChooseToken({ selected: !!selectedToken })}
        >
            {selectedToken ? (
                <div className={CnChooseToken('token')}>
                    <div className={CnChooseToken('token-icon')}>
                        {iconByToken[selectedToken]}
                    </div>
                    <div className={CnChooseToken('token-label')}>
                        {selectedToken}
                    </div>
                </div>
            ) : (
                <div className={CnChooseToken('choose')}>Choose token</div>
            )}

            <div className={CnChooseToken('action')}>
                <Icons.AngleDown />
            </div>
        </div>
    );
};
