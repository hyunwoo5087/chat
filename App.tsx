
import React, { useState, useCallback } from 'react';
import SetupScreen from './components/SetupScreen';
import ChatScreen from './components/ChatScreen';
import type { StudentData } from './types';

const App: React.FC = () => {
    const [studentData, setStudentData] = useState<StudentData | null>(null);

    const handleChatStart = useCallback((data: StudentData) => {
        setStudentData(data);
    }, []);

    const handleReset = useCallback(() => {
        setStudentData(null);
    }, []);

    return (
        // h-screen 대신 h-[100dvh]를 사용하여 모바일 브라우저의 동적 높이 대응
        <div className="relative flex items-center justify-center w-full h-[100dvh] overflow-hidden bg-[#F0F4F8]">
            {/* Animated Background Elements - 모바일에서는 블러 효과 최적화를 위해 개수나 크기 조정 */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-10 w-48 h-48 sm:w-72 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-10 w-48 h-48 sm:w-72 sm:h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
            
            {/* 모바일(p-0)에서는 꽉 찬 화면, 태블릿 이상(p-4)에서는 여백 있는 카드형 레이아웃 */}
            <div className="relative z-10 w-full h-full flex flex-col p-0 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto transition-all duration-300">
                {studentData ? (
                    <ChatScreen studentData={studentData} onReset={handleReset} />
                ) : (
                    <div className="flex-1 flex items-center justify-center overflow-y-auto py-4 px-4 sm:px-0">
                        <SetupScreen onStart={handleChatStart} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
