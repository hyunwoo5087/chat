import type { Chat } from '@google/genai';

export interface Avatar {
    emoji: string;
    name: string;
    description: string;
}

export interface StudentData {
    school: string;
    grade: string;
    class: string;
    studentNumber: string; // [추가] 학생 번호 - 종단 추적용 식별자
    avatar: Avatar;
    sessionId: string;     // 형식: 학교_학년_반_번호 (동일 학생 재접속 시 동일 ID)
    xp: number;
    level: number;
    badges: string[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    condition: string;
}

export interface Message {
    role: 'user' | 'model';
    content: string;
    timestamp: string;
    analysisData?: AnalysisData;
}

/**
 * [핵심 개선] DOK 측정 대상 분리
 *
 * question_dok_level: 학생이 던진 '질문' 자체의 인지적 복잡도
 *   - 어떤 종류의 사고를 요구하는 질문인가를 측정
 *
 * answer_dok_level: 학생이 작성한 '답변 내용'의 인지적 깊이
 *   - 실제로 어느 수준의 사고를 수행했는가를 측정
 *   - XP 계산, 배지 지급, 연구 데이터 분석의 기준값
 *
 * dok_level: answer_dok_level과 동일 (UI/배지 로직 하위 호환용)
 */
export interface AnalysisData {
    dok_level: number;               // answer_dok_level 별칭 (UI 호환용)
    question_dok_level: number;      // 질문의 DOK 수준
    answer_dok_level: number;        // 답변의 DOK 수준 (핵심 측정값)
    dok_reasoning: string;           // 분석 근거 설명
    answer_quality_feedback: string; // 학생 답변에 대한 교육적 피드백
    keris_major: string;
    keris_sub: string;
}

export interface JournalEntry {
    learned: string;
    pledge: string;
    timestamp: string;
}

export interface StreamUpdate {
    text: string;
    isComplete: boolean;
    analysisData?: AnalysisData;
}

export interface GeminiService {
    chat: Chat | null;
    initializeChat: (avatarName: string, priorDokLevel?: number) => Promise<boolean>;
    sendMessage: (message: string, avatarName: string) => Promise<{ chatResponse: string; analysisData: AnalysisData; }>;
    sendMessageStream: (message: string, avatarName: string) => AsyncGenerator<StreamUpdate, void, unknown>;
    analyzeStudentThinkingLevel: (message: string) => Promise<number>;
    getJournalPraise: (avatarName: string, learned: string, pledge: string) => Promise<string>;
    getHint: (avatarName: string, lastAiMessage: string) => Promise<string>;
}

export interface InteractionLog {
    sessionId: string;
    timestamp: string;
    studentData: Omit<StudentData, 'sessionId'>;
    userMessage: string;
    modelResponse: Message;
    turnNumber?: number;      // [추가] 해당 세션의 대화 순번 (1부터 시작)
    hintUsed?: boolean;       // [추가] 이 턴에서 힌트를 사용했는지 여부
    responseTimeMs?: number;  // [추가] 사용자 입력 → AI 응답 완료까지 소요 시간(ms)
}

export interface JournalLog {
    sessionId: string;
    timestamp: string;
    studentData: Omit<StudentData, 'sessionId'>;
    journalEntry: JournalEntry;
}

export interface AnalyticsService {
    logInteraction: (log: InteractionLog) => Promise<void>;
    logJournal: (log: JournalLog) => Promise<void>;
}