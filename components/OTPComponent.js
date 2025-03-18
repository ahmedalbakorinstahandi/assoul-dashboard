"use client"
import React, { useState, useEffect } from 'react';
import { TableCell } from './ui/table';

export function OTPComponent({ otp, otp_expire_at }) {
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const expireTime = new Date(otp_expire_at).getTime();
            const currentTime = new Date().getTime();
            const remainingTime = expireTime - currentTime;

            if (remainingTime > 0) {
                setTimeRemaining(remainingTime);
            } else {
                setTimeRemaining(0); // انتهت صلاحية OTP
            }
        };

        // حساب الوقت المتبقي عند تحميل المكون
        calculateTimeRemaining();

        // تحديث الوقت المتبقي كل ثانية
        const intervalId = setInterval(() => {
            calculateTimeRemaining();
        }, 1000);

        // تنظيف الـ interval عند إلغاء المكون
        return () => clearInterval(intervalId);
    }, [otp_expire_at]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <div>
            {timeRemaining > 0 ? (
                <>
                    <div style={{ alignItems: "center" }} className='flex flex-col align-middle justify-center items-end justify-items-center'>
                        <span className='text-nowrap '>{otp}</span>

                        <span className='bg-orange-100 text-orange-500 px-2 py-1 rounded-full'>{formatTime(timeRemaining)} </span>
                    </div>
                </>
            ) : (
                <span className='text-nowrap'>رمز الدخول منتهي</span>
            )}
        </div>
    );
};

