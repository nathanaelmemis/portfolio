import { useState, useEffect } from "react";

export interface MousePosition {
    x: number;
    y: number;
}

export const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return mousePosition;
}