import type { Avatar, Badge } from './types';

export const AVATARS: Avatar[] = [
    {
        emoji: '🤖',
        name: '픽셀',
        description: '안녕! 나는 픽셀이야! 🤖💻 컴퓨터처럼 정확하고 체계적으로 설명해줄게!',
    },
    {
        emoji: '🐶',
        name: '토토',
        description: '안녕안녕! 나는 토토! 🐶✨ 뭐든지 신나게 배우는 게 최고야! 재미있게 놀면서 배우자!',
    },
    {
        emoji: '🧙‍♀️',
        name: '미라',
        description: '안녕하구나... 나는 미라란다 🧙‍♀️🌙 신비로운 디지털 마법의 세계를 부드럽게 안내해줄게.',
    },
    {
        emoji: '👨‍🚀',
        name: '제트',
        description: '안녕! 우주 탐험가 제트야! 👨‍🚀🚀 슈웅~! 디지털 세상을 우주처럼 신나게 탐험하자고!',
    },
];

// [개선] KERIS 4대 영역별로 각 5개씩 균등 배분 (총 20개)
// 영역별 주제가 균등하게 출현해야 역량 분포 연구에 편향이 생기지 않음
export const TOPIC_SUGGESTIONS: string[] = [
    // ── 영역 1: 디지털 기기와 소프트웨어 활용 (7개) ──────────
    "코딩은 무엇이고, 왜 배워야 할까?",
    "인공지능은 어떻게 그림과 음악을 만들까?",
    "스마트폰과 컴퓨터의 차이점은 무엇일까?",
    "앱(App)은 어떻게 만들어질까?",
    "유튜브 추천 알고리즘은 어떤 원리로 작동할까?",
    "메타버스는 가상 현실과 어떻게 다를까?",
    "컴퓨터는 어떻게 0과 1로만 대화할까?",

    // ── 영역 2: 디지털 정보 활용과 제작 (7개) ──────────────
    "가짜 뉴스와 진짜 뉴스는 어떻게 구별할 수 있을까?",
    "인터넷에서 정보를 찾을 때 어떤 점을 주의해야 할까?",
    "데이터와 정보는 어떻게 다를까?",
    "디지털 콘텐츠를 만들 때 저작권은 왜 중요할까?",
    "인터넷 밈(meme)은 왜 빠르게 퍼질까?",
    "검색 엔진은 어떻게 가장 좋은 결과를 찾아낼까?",
    "빅데이터는 우리 생활을 어떻게 바꿀까?",

    // ── 영역 3: 디지털 소통과 문제 해결 (7개) ──────────────
    "온라인에서 친구와 다퉜을 때 어떻게 화해할 수 있을까?",
    "온라인 게임에서 지켜야 할 예절은 무엇일까?",
    "나쁜 댓글을 보거나 받으면 어떻게 대처해야 할까?",
    "온라인에서 모르는 사람이 말을 걸면 어떻게 해야 할까?",
    "디지털 도구를 사용해서 학교 문제를 해결한다면?",
    "화상 회의를 할 때 지켜야 할 매너는 무엇일까?",
    "디지털 협업 도구로 친구와 함께 숙제하는 방법은?",

    // ── 영역 4: 디지털 윤리와 정보보호 (7개) ──────────────
    "내 개인정보에는 어떤 것들이 포함될까?",
    "사이버 폭력이란 무엇이고 왜 나쁠까?",
    "컴퓨터 바이러스는 왜 생기고 어떻게 막을 수 있을까?",
    "디지털 발자국이란 무엇이고 왜 조심해야 할까?",
    "스마트폰을 건강하게 사용하는 방법은 무엇일까?",
    "딥페이크 기술의 위험성과 대처 방법은?",
    "비밀번호를 안전하게 만드는 나만의 규칙은?",
];

export const LEVEL_THRESHOLDS = [0, 80, 200, 400, 700, 1100];

/**
 * 레벨별 명칭과 설명 — DOK 단계와 대응
 * Level 1-2: DOK 1-2 (기초 탐구)
 * Level 3-4: DOK 3 (전략적 사고)
 * Level 5-6: DOK 4 (확장적 사고)
 */
export const LEVEL_META: Record<number, { name: string; subtitle: string; color: string }> = {
    1: { name: '디지털 새싹',    subtitle: '디지털 세상을 탐험하기 시작했어요!',             color: 'from-green-400 to-emerald-500' },
    2: { name: '정보 탐정',      subtitle: '비교하고 분류하는 법을 익히고 있어요!',           color: 'from-blue-400 to-cyan-500' },
    3: { name: '논리 탐구자',    subtitle: '이유를 찾고 원인을 분석하기 시작했어요!',         color: 'from-violet-400 to-purple-500' },
    4: { name: '인과 분석가',    subtitle: '증거로 주장하고 결과를 예측할 수 있어요!',        color: 'from-orange-400 to-red-500' },
    5: { name: '비판적 사고가',  subtitle: '여러 관점을 비교하고 논거를 만들 수 있어요!',    color: 'from-pink-500 to-rose-600' },
    6: { name: '디지털 통찰가',  subtitle: '최고 수준의 확장적 사고에 도달했어요! 🏆',       color: 'from-yellow-400 to-orange-500' },
};

export const BADGES: Badge[] = [
    // ── 첫 발걸음 ──────────────────────────────────────────────────────
    { id: 'first_chat',     name: '첫 걸음',        description: 'AI 튜터와 첫 대화를 시작했어요!',              icon: '🐣', condition: '첫 메시지 전송' },
    { id: 'curious_5',      name: '호기심 대장',     description: '5번 이상 질문을 던졌어요!',                    icon: '🧐', condition: '메시지 5회 전송' },
    { id: 'curious_20',     name: '질문 중독',       description: '무려 20번이나 탐구했어요!',                    icon: '🔭', condition: '메시지 20회 전송' },

    // ── DOK 사고 수준 배지 ─────────────────────────────────────────────
    { id: 'dok2_first',     name: '비교왕',          description: '처음으로 비교·분류 사고를 보여줬어요!',        icon: '⚖️', condition: 'DOK 2단계 첫 달성' },
    { id: 'logic_detective',name: '논리 탐정',        description: '이유와 근거를 찾아 깊게 생각했어요!',          icon: '🕵️', condition: 'DOK 3단계 달성' },
    { id: 'creative_wizard',name: '통찰 마법사',      description: '여러 관점을 통합해 논거를 만들었어요!',        icon: '🧙', condition: 'DOK 4단계 달성' },
    { id: 'dok3_streak',    name: '깊이 탐구자',      description: '3번 연속으로 깊은 사고를 보여줬어요!',         icon: '🔥', condition: 'DOK 3 이상 3회 연속' },
    { id: 'no_hint_dok3',   name: '혼자 해냈어!',     description: '힌트 없이 스스로 DOK 3 사고에 도달했어요!',   icon: '💪', condition: '힌트 없이 DOK 3 달성' },
    { id: 'no_hint_dok4',   name: '천재 탐구자',      description: '힌트 없이 혼자서 최고 수준의 사고를 해냈어요!',icon: '🧠', condition: '힌트 없이 DOK 4 달성' },

    // ── KERIS 4개 영역 탐험 배지 ──────────────────────────────────────
    { id: 'keris_device',   name: '기기 전문가',     description: '디지털 기기·소프트웨어 영역을 탐구했어요!',    icon: '💻', condition: '영역 1 주제 탐구' },
    { id: 'keris_info',     name: '정보 탐험가',     description: '디지털 정보 활용·제작 영역을 탐구했어요!',     icon: '📊', condition: '영역 2 주제 탐구' },
    { id: 'keris_comm',     name: '소통 달인',        description: '디지털 소통·문제 해결 영역을 탐구했어요!',     icon: '💬', condition: '영역 3 주제 탐구' },
    { id: 'keris_ethics',   name: '윤리 수호자',     description: '디지털 윤리·정보보호 영역을 탐구했어요!',      icon: '🛡️', condition: '영역 4 주제 탐구' },
    { id: 'keris_all',      name: '디지털 만능인',   description: 'KERIS 4개 영역을 모두 탐구했어요!',            icon: '🌐', condition: '4개 영역 모두 탐구' },

    // ── 꾸준함 배지 ────────────────────────────────────────────────────
    { id: 'journal_first',  name: '기록 시작',        description: '처음으로 학습 일기를 썼어요!',                 icon: '✍️', condition: '학습 일기 1회 작성' },
    { id: 'journal_3',      name: '꾸준한 기록자',    description: '학습 일기를 3번이나 작성했어요!',              icon: '📓', condition: '학습 일기 3회 작성' },
    { id: 'journal_5',      name: '성찰 챔피언',      description: '학습 일기를 5번 작성한 대단한 탐구자!',        icon: '📚', condition: '학습 일기 5회 작성' },

    // ── 레벨 도달 배지 ─────────────────────────────────────────────────
    { id: 'level_3',        name: '논리의 문',        description: '레벨 3 논리 탐구자에 도달했어요!',             icon: '🔓', condition: '레벨 3 달성' },
    { id: 'level_6',        name: '디지털 통찰가',    description: '최고 레벨에 도달한 진정한 탐구자!',            icon: '🎓', condition: '레벨 6 달성' },
];