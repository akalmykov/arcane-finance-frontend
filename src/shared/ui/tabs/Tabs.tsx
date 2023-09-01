import { FC, useCallback } from 'react';
import { cn } from '@bem-react/classname';

import './Tabs.scss';

const CnTabs = cn('tabs');

interface ITabsProps {
    tabs?: { title: string; value: string }[];
    value?: string;
    onItemClick?: (value: string) => void;
}

export const Tabs: FC<ITabsProps> = ({
    tabs = [],
    value = null,
    onItemClick,
}) => {
    const itemClickHandler = useCallback(
        (value: string) => {
            return () => {
                onItemClick && onItemClick(value);
            };
        },
        [onItemClick],
    );

    return (
        <div className={CnTabs()}>
            {tabs.map((tab, index) => (
                <div
                    onClick={itemClickHandler(tab.value)}
                    className={CnTabs('item', {
                        selected: value === tab.value,
                    })}
                    key={index}
                >
                    {tab.title}
                </div>
            ))}
        </div>
    );
};
