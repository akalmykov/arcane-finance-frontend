import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

interface IShowModalPayload {
    modalState: any;
    modalType: string;
}
interface ModalState {
    modalType: null | string;
    state: any;
    showModal: (modalState: IShowModalPayload) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>()(
    devtools(
        immer((set) => ({
            show: false,
            state: {},
            modalType: '',
            showModal: (payload) =>
                set((state) => {
                    state.state = payload.modalState;
                    state.modalType = payload.modalType;
                }),
            closeModal: () =>
                set((state) => {
                    state.modalType = null;
                }),
        })),
    ),
);
