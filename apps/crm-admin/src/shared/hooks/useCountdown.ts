// useCountdown.ts
import { useState, useEffect } from 'react';

// Hàm tính toán thời gian còn lại
const getRemainingTime = (expiry: string | null) => {
    if (!expiry) return null;
    const now = new Date();
    const expiryDate = new Date(expiry);
    const diff = expiryDate.getTime() - now.getTime(); // Tính theo milliseconds

    if (diff <= 0) return { expired: true, minutes: 0, seconds: 0 };

    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return { expired: false, minutes, seconds };
};

export const useCountdown = (expiryIso: string | null) => {
    // Khởi tạo trạng thái ban đầu
    const [time, setTime] = useState(getRemainingTime(expiryIso));

    useEffect(() => {
        // Nếu không có thời gian hết hạn hoặc đã hết hạn, dừng lại
        if (!expiryIso || (time && time.expired)) {
            return;
        }

        // Thiết lập interval chạy mỗi giây
        const interval = setInterval(() => {
            const newTime = getRemainingTime(expiryIso);
            setTime(newTime);

            if (newTime?.expired) {
                clearInterval(interval); // Dừng đếm ngược khi hết hạn
            }
        }, 1000);

        // Cleanup function để xóa interval khi component unmount
        return () => clearInterval(interval);
    }, [expiryIso, time?.expired]);

    return time;
};