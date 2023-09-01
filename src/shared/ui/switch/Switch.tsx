import { cn } from '@bem-react/classname';
import { FC } from 'react';

import './Switch.scss';

const CnSwitch = cn('switch');

interface ISwitchItem {
    text: string;
    value: any;
    disabled?: boolean;
}

interface ISwitchProps {
    items: ISwitchItem[];
    onChange?: (value: any) => void;
    value?: any;
}

export const Switch: FC<ISwitchProps> = ({ items, onChange, value = null }) => {
    const itemClickHandler = (item: ISwitchItem) => {
        return () => {
            onChange && item.disabled !== true && onChange(item.value);
        };
    };

    return (
        <div className={CnSwitch()}>
            {items.map((item) => (
                <SwitchItem
                    selected={item.value === value}
                    onClick={itemClickHandler(item)}
                    width={Math.round(100 / items.length) - 1}
                    key={item.value}
                    {...item}
                />
            ))}
        </div>
    );
};

const CnSwitchItem = cn('switchItem');

interface ISwitchItemProps extends ISwitchItem {
    selected: boolean;
    onClick: () => void;
    width: number;
}

const SwitchItem: FC<ISwitchItemProps> = ({
    text,
    width,
    selected,
    onClick,
    disabled = false,
}) => {
    return (
        <div
            onClick={onClick}
            style={{ width: `${width}%` }}
            className={CnSwitchItem({ selected, disabled })}
        >
            {text}
        </div>
    );
};
