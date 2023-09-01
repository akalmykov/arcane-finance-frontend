import { cn } from '@bem-react/classname';
import { FC } from 'react';
import { Icons } from 'assets';

import './SwapButton.scss';

const CnSwapButton = cn('swapButton');

interface ISwapButtonProps {
    onClick?: () => void;
}

export const SwapButton: FC<ISwapButtonProps> = ({ onClick }) => {
    return (
        <div onClick={onClick} className={CnSwapButton()}>
            <Icons.ArrowDown />
        </div>
    );
};
