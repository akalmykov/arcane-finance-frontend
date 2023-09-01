import { cn } from '@bem-react/classname';
import { Icons } from 'assets';
import { useModalStore } from 'features/modal';
import { FC, useCallback, useMemo } from 'react';
import { contentFromModalType } from './Modal.mappers';

import './Modal.scss';
import { closableModals } from './Modal.constants';

const CnModal = cn('modal');

export const Modal: FC = () => {
    const closeModal = useModalStore((state) => state.closeModal);

    const closeClickCallback = useCallback(() => {
        closeModal();
    }, [closeModal]);

    const modalType = useModalStore((state) => state.modalType);

    const { isModalShow, content } = useMemo(() => {
        const content = modalType
            ? contentFromModalType[modalType] ?? null
            : null;

        const isModalShow = Boolean(content);

        return {
            isModalShow,
            content,
        };
    }, [modalType]);

    const isCloseShow = useMemo(
        () => (modalType ? closableModals.includes(modalType) : false),
        [modalType],
    );

    return (
        <div className={CnModal({ show: isModalShow })}>
            <div className={CnModal('content')}>
                {isCloseShow && (
                    <div
                        onClick={closeClickCallback}
                        className={CnModal('close')}
                    >
                        <Icons.Close />
                    </div>
                )}
                {content}
            </div>
        </div>
    );
};
