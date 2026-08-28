export const APP_NAME = "MedAce AI";
export const APP_NAME_URDU = "میڈ ایس";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/",
  QUIZ: "/quiz",
  QUIZ_RESULTS: "/quiz/results",
  STUDY_PLAN: "/study-plan",
  HISTORY: "/history",
  PROFILE: "/profile",
} as const;

export const NAV_ITEMS = [
  { label: "ڈیش بورڈ", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "کوئز", href: ROUTES.QUIZ, icon: "Brain" },
  { label: "مطالعہ کا منصوبہ", href: ROUTES.STUDY_PLAN, icon: "CalendarDays" },
  { label: "تاریخ", href: ROUTES.HISTORY, icon: "History" },
  { label: "پروفائل", href: ROUTES.PROFILE, icon: "User" },
] as const;

export const MDCAT_SUBJECTS = [
  { id: "biology", label: "حیاتیات", labelEn: "Biology" },
  { id: "chemistry", label: "کیمیا", labelEn: "Chemistry" },
  { id: "physics", label: "طبیعیات", labelEn: "Physics" },
  { id: "english", label: "انگریزی", labelEn: "English" },
] as const;

export const BIOLOGY_TOPICS = [
  { id: "cell-biology", label: "خلیاتی حیاتیات" },
  { id: "genetics", label: "وراثیات" },
  { id: "evolution", label: "ارتقاء" },
  { id: "ecology", label: "ماحولیات" },
  { id: "human-physiology", label: "انسانی فعلیات" },
  { id: "plant-physiology", label: "نباتاتی فعلیات" },
  { id: "microbiology", label: "خردحیاتیات" },
  { id: "biotechnology", label: "حیاتیاتی ٹیکنالوجی" },
  { id: "molecular-biology", label: "مالیکیولر حیاتیات" },
  { id: "animal-diversity", label: "حیوانی تنوع" },
] as const;

export const QUESTION_COUNTS = [10, 20, 30] as const;

export const DIFFICULTY_LEVELS = [
  { id: "easy", label: "آسان" },
  { id: "medium", label: "درمیانہ" },
  { id: "hard", label: "مشکل" },
] as const;
