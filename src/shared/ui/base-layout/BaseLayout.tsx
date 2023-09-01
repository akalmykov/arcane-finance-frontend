import { cn } from '@bem-react/classname';
import React, { FC } from 'react';

import './BaseLayout.scss';

const CnBaseLayout = cn('baseLayout');

interface IBaseLayoutProps {
    children: React.ReactNode;
}

export const BaseLayout: FC<IBaseLayoutProps> = ({ children }) => {
    return <div className={CnBaseLayout()}>{children}</div>;
};
