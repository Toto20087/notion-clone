import { useState, useEffect } from 'react';

export const useScrollTop = (treshhold = 10) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {

        const handleScroll = ( ) => {
            if (window.scrollY > treshhold) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        }


        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [treshhold]);

    return scrolled;
}