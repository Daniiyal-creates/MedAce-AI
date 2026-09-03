import fs from "fs";
import path from "path";

const TEXTBOOKS_DIR = path.join(process.cwd(), "rag", "textbooks");

/**
 * Finds and reads the textbook extracted file for a given chapter number (1-15)
 */
export function getTextbookContextForChapter(chapterNum: number, maxChars = 8000): string {
  try {
    if (!fs.existsSync(TEXTBOOKS_DIR)) {
      return "";
    }

    const files = fs.readdirSync(TEXTBOOKS_DIR);
    // Find file starting with Chapter_<chapterNum>_ or Chapter_<chapterNum>
    const match = files.find((file) => {
      const lower = file.toLowerCase();
      return (
        lower.startsWith(`chapter_${chapterNum}_`) ||
        lower.startsWith(`chapter_${chapterNum}.`) ||
        lower.startsWith(`chapter_${chapterNum} `)
      );
    });

    if (!match) return "";

    const filePath = path.join(TEXTBOOKS_DIR, match);
    const content = fs.readFileSync(filePath, "utf-8");

    if (!content) return "";

    // Return a rich sample from the textbook file
    if (content.length <= maxChars) {
      return content;
    }

    // Pick a random or balanced starting window across subtopics
    const randomOffset = Math.floor(Math.random() * Math.max(0, content.length - maxChars));
    return content.slice(randomOffset, randomOffset + maxChars);
  } catch (err) {
    console.error(`Error reading textbook for chapter ${chapterNum}:`, err);
    return "";
  }
}
