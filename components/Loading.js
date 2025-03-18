"use client"
import React from 'react';
import Lottie from 'lottie-react';
import animationData from '@/public/loading.json'; // Adjust the path to your Lottie JSON file

export default function Loading() {
    return (
        <div className="flex h-[70vh] items-center justify-center">
            <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
        </div>
    );
}

