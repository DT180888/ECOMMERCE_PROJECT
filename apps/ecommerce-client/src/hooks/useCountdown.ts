import { useState, useEffect } from 'react';

const getRemainingTime = (expiry: string | null) => {
    if (!expiry) return null;
    const now = new Date();
    const expiryDate = new Date(expiry);
    const diff = expiryDate.getTime() - now.getTime();

    if (diff <= 0) return { expired: true, minutes: 0, seconds: 0 };

    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return { expired: false, minutes, seconds };
};

export const useCountdown = (expiryIso: string | null) => {
    const [time, setTime] = useState(getRemainingTime(expiryIso));

    useEffect(() => {
        if (!expiryIso || (time && time.expired)) {
            return;
        }

        const interval = setInterval(() => {
            const newTime = getRemainingTime(expiryIso);
            setTime(newTime);

            if (newTime?.expired) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryIso, time?.expired]);

    return time;
};
