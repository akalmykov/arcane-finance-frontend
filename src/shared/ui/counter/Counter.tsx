import { cn } from '@bem-react/classname';
import React, { FC, useCallback, useRef } from 'react';
import { Icons } from 'assets';

import './Counter.scss';

const CnCounter = cn('counter');

interface CnCounterProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export const Counter: FC<CnCounterProps> = ({
    header,
    footer,
    value,
    ...inputProps
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const increment = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.stepUp();
        }
    }, [inputRef]);

    const decrement = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.stepDown();
        }
    }, [inputRef]);

    return (
        <div className={CnCounter()}>
            <div className={CnCounter('head')}>{header}</div>

            <div className={CnCounter('content')}>
                <div onClick={decrement} className={CnCounter('action')}>
                    <Icons.Minus />
                </div>

                <div className={CnCounter('field')}>
                    <input
                        {...inputProps}
                        ref={inputRef}
                        value={value}
                        type="number"
                    />
                </div>

                <div onClick={increment} className={CnCounter('action')}>
                    <Icons.Plus />
                </div>
            </div>

            <div className={CnCounter('foot')}>{footer}</div>
        </div>
    );
};
