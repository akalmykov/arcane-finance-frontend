import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useExecuteProgram } from '@puzzlehq/sdk';

export const PuzzleWalletContext = createContext<any>({});

export const usePuzzleWallet = () => useContext(PuzzleWalletContext);

export const usePuzzleExecute = (programId: string, functionName: string) => {
    const [inputs, setInputs] = useState([]);
    const [canExecute, setCanExecute] = useState(false);

    const {
        execute: puzzleExecute,
        loading,
        transactionId,
        error,
        ...other
    } = useExecuteProgram({
        programId,
        functionName,
        inputs,
    });

    const execute = useCallback((inputs: any) => {
        setInputs(inputs);
        setCanExecute(true);
    }, []);

    const waitForResult = async () => {
        await new Promise((resolve) => setTimeout(resolve, 30_000));

        // return new Promise((resolve, reject) => {
        //     const interval = setInterval(() => {
        //         console.log('interval', loading, transactionId, error);
        //         if (!loading && transactionId) {
        //             resolve(transactionId);

        //             clearInterval(interval);
        //         }

        //         if (error) {
        //             reject(error);

        //             clearInterval(interval);
        //         }
        //     }, 1000);
        // });
    };

    useEffect(() => {
        if (canExecute) {
            puzzleExecute();

            setCanExecute(false);
        }
    }, [canExecute, inputs, puzzleExecute]);

    return { execute, waitForResult, loading, transactionId, error, ...other };
};
