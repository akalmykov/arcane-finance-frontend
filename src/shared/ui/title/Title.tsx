import { cn } from '@bem-react/classname';
import React, { FC } from 'react';

import './Title.scss';

const CnTitle = cn('title');

interface ITitleProps {
    children?: React.ReactNode;
}

export const Title: FC<ITitleProps> = ({ children }) => {
    return <div className={CnTitle()}>{children}</div>;
};
