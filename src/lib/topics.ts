import type { Topic } from "@/types/quiz";

/**
 * Static catalog of the 15 MDCAT Biology chapters.
 * Kept in its own tiny module (separate from the heavy quiz mock fixtures in
 * `mock-data.ts`) so pages that only need the topic list don't pull large
 * question fixtures into the client bundle.
 */
export const mdcTopics: Topic[] = [
  { id: "ch1", chapterNum: 1, name: "Digestive System of Man", category: "Human Physiology", subtopicsCount: 12 },
  { id: "ch2", chapterNum: 2, name: "Blood Circulatory System of Man", category: "Human Physiology", subtopicsCount: 14 },
  { id: "ch3", chapterNum: 3, name: "Respiratory System of Man", category: "Human Physiology", subtopicsCount: 10 },
  { id: "ch4", chapterNum: 4, name: "Urinary System of Man", category: "Human Physiology", subtopicsCount: 9 },
  { id: "ch5", chapterNum: 5, name: "Nervous System of Man", category: "Human Physiology", subtopicsCount: 18 },
  { id: "ch6", chapterNum: 6, name: "Endocrine System of Man", category: "Human Physiology", subtopicsCount: 11 },
  { id: "ch7", chapterNum: 7, name: "Skeletal System of Man", category: "Human Physiology", subtopicsCount: 10 },
  { id: "ch8", chapterNum: 8, name: "Thermoregulation & Homeostasis", category: "Human Physiology", subtopicsCount: 7 },
  { id: "ch9", chapterNum: 9, name: "Immunity", category: "Modern Topics", subtopicsCount: 12 },
  { id: "ch10", chapterNum: 10, name: "Biotechnology", category: "Modern Topics", subtopicsCount: 13 },
  { id: "ch11", chapterNum: 11, name: "Biostatistics & Data Handling", category: "Modern Topics", subtopicsCount: 8 },
  { id: "ch12", chapterNum: 12, name: "Structural & Computational Biology", category: "Modern Topics", subtopicsCount: 6 },
  { id: "ch13", chapterNum: 13, name: "Climate Change", category: "Modern Topics", subtopicsCount: 7 },
  { id: "ch14", chapterNum: 14, name: "Selected Topics", category: "Modern Topics", subtopicsCount: 9 },
  { id: "ch15", chapterNum: 15, name: "Pharmacological Drugs", category: "Pharmacology", subtopicsCount: 10 },
];
