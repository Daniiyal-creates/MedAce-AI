import type {
  Topic,
  Question,
  QuizSession,
  WeakTopic,
  StudyPlan,
  DashboardStats,
  RecentSession,
  UserProfile,
} from "@/types/quiz";

/* ===========================
   TOPICS — 15 MDCAT Biology Chapters
   =========================== */
export const mockTopics: Topic[] = [
  { id: "ch1", chapterNum: 1, name: "Digestive System of Man", category: "Human Physiology", subtopicsCount: 12, accuracy: 72, isWeak: false },
  { id: "ch2", chapterNum: 2, name: "Blood Circulatory System of Man", category: "Human Physiology", subtopicsCount: 14, accuracy: 58, isWeak: true },
  { id: "ch3", chapterNum: 3, name: "Respiratory System of Man", category: "Human Physiology", subtopicsCount: 10, accuracy: 81 },
  { id: "ch4", chapterNum: 4, name: "Urinary System of Man", category: "Human Physiology", subtopicsCount: 9, accuracy: 45, isWeak: true },
  { id: "ch5", chapterNum: 5, name: "Nervous System of Man", category: "Human Physiology", subtopicsCount: 18, accuracy: 38, isWeak: true },
  { id: "ch6", chapterNum: 6, name: "Endocrine System of Man", category: "Human Physiology", subtopicsCount: 11, accuracy: 67 },
  { id: "ch7", chapterNum: 7, name: "Skeletal System of Man", category: "Human Physiology", subtopicsCount: 10, accuracy: 75 },
  { id: "ch8", chapterNum: 8, name: "Thermoregulation & Homeostasis", category: "Human Physiology", subtopicsCount: 7, accuracy: 85 },
  { id: "ch9", chapterNum: 9, name: "Immunity", category: "Modern Topics", subtopicsCount: 12, accuracy: 52, isWeak: true },
  { id: "ch10", chapterNum: 10, name: "Biotechnology", category: "Modern Topics", subtopicsCount: 13, accuracy: 63 },
  { id: "ch11", chapterNum: 11, name: "Biostatistics & Data Handling", category: "Modern Topics", subtopicsCount: 8 },
  { id: "ch12", chapterNum: 12, name: "Structural & Computational Biology", category: "Modern Topics", subtopicsCount: 6 },
  { id: "ch13", chapterNum: 13, name: "Climate Change", category: "Modern Topics", subtopicsCount: 7, accuracy: 90 },
  { id: "ch14", chapterNum: 14, name: "Selected Topics", category: "Modern Topics", subtopicsCount: 9, accuracy: 70 },
  { id: "ch15", chapterNum: 15, name: "Pharmacological Drugs", category: "Pharmacology", subtopicsCount: 10, accuracy: 42, isWeak: true },
];

/* ===========================
   WEAK TOPICS
   =========================== */
export const mockWeakTopics: WeakTopic[] = [
  { topic: "Nervous System of Man", chapterNum: 5, weaknessScore: 82, errorCount: 24, attemptCount: 45 },
  { topic: "Pharmacological Drugs", chapterNum: 15, weaknessScore: 75, errorCount: 18, attemptCount: 32 },
  { topic: "Urinary System of Man", chapterNum: 4, weaknessScore: 68, errorCount: 15, attemptCount: 28 },
  { topic: "Blood Circulatory System of Man", chapterNum: 2, weaknessScore: 61, errorCount: 13, attemptCount: 30 },
  { topic: "Immunity", chapterNum: 9, weaknessScore: 55, errorCount: 11, attemptCount: 25 },
];

/* ===========================
   DASHBOARD STATS
   =========================== */
export const mockDashboardStats: DashboardStats = {
  totalQuestions: 342,
  questionsThisWeek: 45,
  accuracyRate: 64,
  sessionsCompleted: 28,
  studyStreak: 5,
};

/* ===========================
   RECENT SESSIONS
   =========================== */
export const mockRecentSessions: RecentSession[] = [
  { id: "s1", topic: "Nervous System of Man", score: 4, totalQuestions: 10, date: "2026-08-29" },
  { id: "s2", topic: "Digestive System of Man", score: 8, totalQuestions: 10, date: "2026-08-28" },
  { id: "s3", topic: "Pharmacological Drugs", score: 5, totalQuestions: 10, date: "2026-08-28" },
  { id: "s4", topic: "Respiratory System of Man", score: 9, totalQuestions: 10, date: "2026-08-27" },
  { id: "s5", topic: "Immunity", score: 6, totalQuestions: 10, date: "2026-08-26" },
];

/* ===========================
   MOCK QUESTIONS — Nervous System
   =========================== */
export const mockQuestions: Question[] = [
  {
    id: "q1",
    sessionId: "session-1",
    questionText: "Which of the following is the basic functional unit of the nervous system?",
    optionA: "Nephron",
    optionB: "Neuron",
    optionC: "Hepatocyte",
    optionD: "Chondrocyte",
    correctAnswer: "B",
    explanationEn: "The neuron is the basic structural and functional unit of the nervous system. It is specialized to transmit nerve impulses from one part of the body to another. Nephrons are kidney units, hepatocytes are liver cells, and chondrocytes are cartilage cells.",
    explanationUr: "Neuron nervous system ki bunyadi structural aur functional unit hai. Ye body ke ek hissay se doosre hissay tak nerve impulses transmit karne ke liye specialized hota hai. Nephron kidney ki unit hai, hepatocytes liver cells hain, aur chondrocytes cartilage cells hain.",
    difficulty: "Easy",
    topic: "Nervous System of Man",
  },
  {
    id: "q2",
    sessionId: "session-1",
    questionText: "The resting membrane potential of a neuron is primarily maintained by:",
    optionA: "Calcium pumps",
    optionB: "Sodium-potassium pump",
    optionC: "Chloride channels",
    optionD: "Magnesium transporters",
    correctAnswer: "B",
    explanationEn: "The resting membrane potential (approximately -70mV) is maintained by the Na+/K+ ATPase pump, which actively transports 3 Na+ ions out and 2 K+ ions into the cell, creating an electrochemical gradient across the membrane.",
    explanationUr: "Resting membrane potential (taqreeban -70mV) Na+/K+ ATPase pump ke zariye maintain hota hai, jo actively 3 Na+ ions bahar aur 2 K+ ions cell ke andar transport karta hai, membrane ke across electrochemical gradient banata hai.",
    difficulty: "Medium",
    topic: "Nervous System of Man",
  },
  {
    id: "q3",
    sessionId: "session-1",
    questionText: "During depolarization of a neuron, which event occurs first?",
    optionA: "K+ channels open",
    optionB: "Na+ voltage-gated channels open",
    optionC: "Na+/K+ pump stops working",
    optionD: "Myelin sheath dissolves",
    correctAnswer: "B",
    explanationEn: "During depolarization, voltage-gated Na+ channels open first in response to a threshold stimulus. This allows rapid influx of Na+ ions into the cell, causing the membrane potential to rise from -70mV toward +30mV. K+ channels open later during repolarization.",
    explanationUr: "Depolarization ke dauran, voltage-gated Na+ channels sab se pehle threshold stimulus ke response mein khulte hain. Is se Na+ ions tezi se cell ke andar aate hain, jis se membrane potential -70mV se +30mV ki taraf barhta hai. K+ channels baad mein repolarization ke dauran khulte hain.",
    difficulty: "Medium",
    topic: "Nervous System of Man",
  },
  {
    id: "q4",
    sessionId: "session-1",
    questionText: "Saltatory conduction occurs in:",
    optionA: "Non-myelinated neurons",
    optionB: "Myelinated neurons",
    optionC: "All neurons equally",
    optionD: "Only sensory neurons",
    correctAnswer: "B",
    explanationEn: "Saltatory conduction occurs in myelinated neurons where the nerve impulse 'jumps' from one Node of Ranvier to the next. The myelin sheath acts as an insulator, preventing ion flow except at the nodes. This makes conduction significantly faster than in non-myelinated neurons.",
    explanationUr: "Saltatory conduction myelinated neurons mein hota hai jahan nerve impulse ek Node of Ranvier se doosre tak 'jump' karta hai. Myelin sheath insulator ka kaam karti hai, nodes ke ilawa ion flow ko prevent karti hai. Is se conduction non-myelinated neurons ke muqable mein bohat tez hoti hai.",
    difficulty: "Easy",
    topic: "Nervous System of Man",
  },
  {
    id: "q5",
    sessionId: "session-1",
    questionText: "The synaptic cleft is the gap between:",
    optionA: "Two neurons' cell bodies",
    optionB: "Axon terminal and dendrite/cell body of the next neuron",
    optionC: "Myelin sheath and axon",
    optionD: "Schwann cells",
    correctAnswer: "B",
    explanationEn: "The synaptic cleft is a narrow gap (approximately 20-40nm) between the presynaptic axon terminal and the postsynaptic membrane (dendrite or cell body) of the next neuron. Neurotransmitters are released into this space to transmit the signal chemically.",
    explanationUr: "Synaptic cleft ek tang gap (taqreeban 20-40nm) hai jo presynaptic axon terminal aur postsynaptic membrane (dendrite ya cell body) ke beech hota hai. Neurotransmitters is space mein release hote hain taake signal chemically transmit ho sake.",
    difficulty: "Easy",
    topic: "Nervous System of Man",
  },
  {
    id: "q6",
    sessionId: "session-1",
    questionText: "Which neurotransmitter is primarily associated with Alzheimer's disease when deficient?",
    optionA: "Dopamine",
    optionB: "Serotonin",
    optionC: "Acetylcholine",
    optionD: "GABA",
    correctAnswer: "C",
    explanationEn: "Acetylcholine deficiency is primarily associated with Alzheimer's disease. The degeneration of cholinergic neurons in the basal forebrain leads to reduced acetylcholine levels, contributing to memory impairment and cognitive decline characteristic of the disease.",
    explanationUr: "Acetylcholine ki kami primarily Alzheimer's disease se associated hai. Basal forebrain mein cholinergic neurons ka degeneration acetylcholine levels ko kam karta hai, jo memory impairment aur cognitive decline ka sabab banta hai jo is bimari ki khasiyat hai.",
    difficulty: "Hard",
    topic: "Nervous System of Man",
  },
  {
    id: "q7",
    sessionId: "session-1",
    questionText: "The autonomic nervous system is divided into:",
    optionA: "Somatic and visceral divisions",
    optionB: "Sympathetic and parasympathetic divisions",
    optionC: "Central and peripheral divisions",
    optionD: "Cranial and spinal divisions",
    correctAnswer: "B",
    explanationEn: "The autonomic nervous system (ANS) is divided into the sympathetic division (fight-or-flight response) and the parasympathetic division (rest-and-digest response). These two divisions generally have opposing effects on target organs, maintaining homeostasis.",
    explanationUr: "Autonomic nervous system (ANS) do divisions mein divided hai: sympathetic division (fight-or-flight response) aur parasympathetic division (rest-and-digest response). Ye dono divisions aam taur par target organs par mukhalif asraat rakhti hain, homeostasis maintain karti hain.",
    difficulty: "Easy",
    topic: "Nervous System of Man",
  },
  {
    id: "q8",
    sessionId: "session-1",
    questionText: "Which part of the brain is primarily responsible for maintaining homeostasis, including body temperature regulation?",
    optionA: "Cerebrum",
    optionB: "Cerebellum",
    optionC: "Hypothalamus",
    optionD: "Medulla oblongata",
    correctAnswer: "C",
    explanationEn: "The hypothalamus is the primary center for homeostasis regulation. It controls body temperature, hunger, thirst, sleep-wake cycles, and links the nervous system to the endocrine system via the pituitary gland. It acts as the body's thermostat.",
    explanationUr: "Hypothalamus homeostasis regulation ka primary center hai. Ye body temperature, bhook, pyaas, sleep-wake cycles ko control karta hai, aur pituitary gland ke zariye nervous system ko endocrine system se jodta hai. Ye body ke thermostat ka kaam karta hai.",
    difficulty: "Medium",
    topic: "Nervous System of Man",
  },
  {
    id: "q9",
    sessionId: "session-1",
    questionText: "A reflex arc requires a minimum of how many neurons?",
    optionA: "One",
    optionB: "Two",
    optionC: "Three",
    optionD: "Four",
    correctAnswer: "C",
    explanationEn: "A simple reflex arc requires a minimum of three neurons: a sensory neuron (detects the stimulus), an intermediate/relay neuron (in the spinal cord, processes the signal), and a motor neuron (carries the response signal to the effector organ).",
    explanationUr: "Ek simple reflex arc ke liye kam az kam teen neurons chahiye: sensory neuron (stimulus detect karta hai), intermediate/relay neuron (spinal cord mein signal process karta hai), aur motor neuron (response signal effector organ tak le jata hai).",
    difficulty: "Medium",
    topic: "Nervous System of Man",
  },
  {
    id: "q10",
    sessionId: "session-1",
    questionText: "Which diagnostic technique uses magnetic fields and radio waves to produce detailed images of the brain?",
    optionA: "EEG (Electroencephalography)",
    optionB: "CT Scan (Computed Tomography)",
    optionC: "MRI (Magnetic Resonance Imaging)",
    optionD: "X-ray",
    correctAnswer: "C",
    explanationEn: "MRI uses strong magnetic fields and radio waves to generate detailed cross-sectional images of the brain and other body structures. Unlike CT scans which use X-rays, MRI does not involve ionizing radiation, making it safer for repeated use. EEG records electrical activity, not structural images.",
    explanationUr: "MRI strong magnetic fields aur radio waves use karta hai brain aur doosri body structures ki detailed cross-sectional images banane ke liye. CT scans ke bar-aks jo X-rays use karta hai, MRI mein ionizing radiation involve nahi hoti, is liye ye repeated use ke liye zyada safe hai. EEG electrical activity record karta hai, structural images nahi.",
    difficulty: "Easy",
    topic: "Nervous System of Man",
  },
];

/* ===========================
   MOCK QUIZ SESSION
   =========================== */
export const mockQuizSession: QuizSession = {
  id: "session-1",
  topic: "Nervous System of Man",
  chapterNum: 5,
  difficulty: "Mixed",
  numQuestions: 10,
  score: null,
  totalQuestions: 10,
  status: "in-progress",
  createdAt: "2026-08-30T10:00:00Z",
  questions: mockQuestions,
  answers: [],
};

/* ===========================
   COMPLETED SESSION (for results page)
   =========================== */
export const mockCompletedSession: QuizSession = {
  id: "session-done",
  topic: "Nervous System of Man",
  chapterNum: 5,
  difficulty: "Mixed",
  numQuestions: 10,
  score: 7,
  totalQuestions: 10,
  status: "completed",
  createdAt: "2026-08-30T09:00:00Z",
  timeTakenMs: 480000,
  questions: mockQuestions,
  answers: [
    { questionId: "q1", selectedAnswer: "B", isCorrect: true, timeTakenMs: 15000 },
    { questionId: "q2", selectedAnswer: "B", isCorrect: true, timeTakenMs: 22000 },
    { questionId: "q3", selectedAnswer: "A", isCorrect: false, timeTakenMs: 35000 },
    { questionId: "q4", selectedAnswer: "B", isCorrect: true, timeTakenMs: 12000 },
    { questionId: "q5", selectedAnswer: "B", isCorrect: true, timeTakenMs: 18000 },
    { questionId: "q6", selectedAnswer: "A", isCorrect: false, timeTakenMs: 45000 },
    { questionId: "q7", selectedAnswer: "B", isCorrect: true, timeTakenMs: 10000 },
    { questionId: "q8", selectedAnswer: "C", isCorrect: true, timeTakenMs: 28000 },
    { questionId: "q9", selectedAnswer: "C", isCorrect: true, timeTakenMs: 20000 },
    { questionId: "q10", selectedAnswer: "C", isCorrect: true, timeTakenMs: 14000 },
  ],
};

/* ===========================
   STUDY PLAN
   =========================== */
export const mockStudyPlan: StudyPlan = {
  id: "plan-1",
  weekNumber: 4,
  rationale:
    "Based on your weak areas in Nervous System, Pharmacological Drugs, and Urinary System, this week focuses on intensive practice in these topics while maintaining your strengths in Thermoregulation and Respiratory System.",
  insights: [
    "You've improved 15% in Digestive System this week",
    "Nervous System needs the most attention — only 38% accuracy so far",
    "Try to complete at least 2 sessions per day for optimal progress",
    "Your best performance was in Climate Change (90% accuracy)",
  ],
  days: [
    { day: "Monday", date: "Aug 25", topics: ["Nervous System of Man"], estimatedMinutes: 45, status: "completed", difficulty: "Medium", questionCount: 15 },
    { day: "Tuesday", date: "Aug 26", topics: ["Pharmacological Drugs"], estimatedMinutes: 40, status: "completed", difficulty: "Medium", questionCount: 10 },
    { day: "Wednesday", date: "Aug 27", topics: ["Urinary System of Man"], estimatedMinutes: 35, status: "completed", difficulty: "Easy", questionCount: 10 },
    { day: "Thursday", date: "Aug 28", topics: ["Blood Circulatory System of Man"], estimatedMinutes: 40, status: "completed", difficulty: "Medium", questionCount: 10 },
    { day: "Friday", date: "Aug 29", topics: ["Immunity", "Nervous System of Man"], estimatedMinutes: 50, status: "completed", difficulty: "Hard", questionCount: 15 },
    { day: "Saturday", date: "Aug 30", topics: ["Nervous System of Man", "Pharmacological Drugs"], estimatedMinutes: 55, status: "today", difficulty: "Mixed", questionCount: 20 },
    { day: "Sunday", date: "Aug 31", topics: ["Revision — All Weak Topics"], estimatedMinutes: 60, status: "upcoming", difficulty: "Mixed", questionCount: 20 },
  ],
};

/* ===========================
   USER PROFILE
   =========================== */
export const mockUserProfile: UserProfile = {
  id: "user-1",
  fullName: "Ahmed Khan",
  email: "ahmed.khan@example.com",
  memberSince: "2026-07-15",
  totalQuestions: 342,
  totalSessions: 28,
  overallAccuracy: 64,
  bestTopic: "Climate Change",
  worstTopic: "Nervous System of Man",
  longestStreak: 12,
  chapterPerformance: [
    { chapter: "Nervous System of Man", accuracy: 38 },
    { chapter: "Pharmacological Drugs", accuracy: 42 },
    { chapter: "Urinary System of Man", accuracy: 45 },
    { chapter: "Immunity", accuracy: 52 },
    { chapter: "Blood Circulatory System", accuracy: 58 },
    { chapter: "Biotechnology", accuracy: 63 },
    { chapter: "Endocrine System", accuracy: 67 },
    { chapter: "Selected Topics", accuracy: 70 },
    { chapter: "Digestive System", accuracy: 72 },
    { chapter: "Skeletal System", accuracy: 75 },
    { chapter: "Respiratory System", accuracy: 81 },
    { chapter: "Thermoregulation", accuracy: 85 },
    { chapter: "Climate Change", accuracy: 90 },
  ],
};
