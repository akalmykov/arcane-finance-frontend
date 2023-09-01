import { useState, useEffect, useRef } from 'react';

export const useDeferredValue = (value: any, delay: number) => {
    const [deferredValue, setDeferredValue] = useState(value);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setDeferredValue(value);
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [value, delay]);

    return deferredValue;
};
