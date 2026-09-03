import fs from "fs";
import path from "path";
import { supabaseAdmin } from "../src/lib/supabase/admin";
import { generateEmbedding } from "../src/lib/ai/gemini";

// Helper to load .env or .env.local when script is run directly via CLI
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      content.split("\n").forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[key]) process.env[key] = value.trim();
        }
      });
    }
  }
}

loadEnv();

interface TextbookChunkInput {
  chapter: string;
  chapter_num: number;
  chunk_index: number;
  content: string;
  token_count: number;
  embedding: number[];
}

/**
 * Clean text content by removing OCR artifacts and extra whitespace
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Chunk text into segments of targetTokenSize with overlap
 */
function chunkText(text: string, targetChunkChars = 2500, overlapChars = 400): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split("\n\n");
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if ((currentChunk + "\n\n" + paragraph).length <= targetChunkChars) {
      currentChunk = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;
    } else {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      // Keep overlap from previous chunk
      const tail = currentChunk.slice(-overlapChars);
      currentChunk = `${tail}\n\n${paragraph}`.trim();
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Extract chapter number and formatted chapter name from filename
 */
function parseFilename(filename: string): { chapterNum: number; chapterName: string } {
  // Example: Chapter_1_Digestive_System_of_Man_extracted.txt
  const numMatch = filename.match(/Chapter_(\d+)_/i);
  const chapterNum = numMatch ? parseInt(numMatch[1], 10) : 0;

  const rawName = filename
    .replace(/^Chapter_\d+_/i, "")
    .replace(/_extracted\.txt$/i, "")
    .replace(/_/g, " ")
    .trim();

  return {
    chapterNum,
    chapterName: rawName || `Chapter ${chapterNum}`,
  };
}

async function ingestTextbooks() {
  console.log("🚀 Starting MedAce AI Textbook RAG Ingestion Pipeline...");

  const textbooksDir = path.join(process.cwd(), "rag", "textbooks");
  if (!fs.existsSync(textbooksDir)) {
    console.error(`❌ Directory not found: ${textbooksDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(textbooksDir)
    .filter((f) => f.endsWith(".txt"))
    .sort();

  console.log(`📚 Found ${files.length} textbook chapter file(s).`);

  let totalChunksIngested = 0;

  for (const file of files) {
    const filePath = path.join(textbooksDir, file);
    const { chapterNum, chapterName } = parseFilename(file);
    const rawContent = fs.readFileSync(filePath, "utf-8");

    console.log(`\n📖 Processing Chapter ${chapterNum}: "${chapterName}" (${file})...`);

    const cleaned = cleanText(rawContent);
    const textChunks = chunkText(cleaned);

    console.log(`   └─ Generated ${textChunks.length} chunks.`);

    const chunkRecords: TextbookChunkInput[] = [];

    for (let i = 0; i < textChunks.length; i++) {
      const content = textChunks[i];
      const approxTokenCount = Math.round(content.length / 4);

      let embedding: number[] | null = null;
      let attempts = 0;
      while (attempts < 5) {
        try {
          attempts++;
          console.log(`   └─ Embed chunk ${i + 1}/${textChunks.length}...`);
          embedding = await generateEmbedding(content);
          break;
        } catch (err: any) {
          if (err?.status === 429 || err?.message?.includes("429")) {
            console.log(`      ⚠️ Rate limit 429 hit. Waiting 5s before retry (attempt ${attempts}/5)...`);
            await new Promise((res) => setTimeout(res, 5000));
          } else {
            console.error(`   ❌ Failed embedding chunk ${i + 1} of ${file}:`, err);
            break;
          }
        }
      }

      if (embedding) {
        chunkRecords.push({
          chapter: chapterName,
          chapter_num: chapterNum,
          chunk_index: i,
          content,
          token_count: approxTokenCount,
          embedding,
        });
      }

      // Delay 1.5s between chunks to respect free tier rate limit
      await new Promise((res) => setTimeout(res, 1500));
    }

    if (chunkRecords.length > 0) {
      console.log(`   └─ Upserting ${chunkRecords.length} chunks into Supabase DB...`);
      const { error } = await supabaseAdmin.from("textbook_chunks").upsert(chunkRecords, {
        onConflict: "id",
      });

      if (error) {
        console.error(`   ❌ Supabase upsert error for ${file}:`, error.message);
      } else {
        totalChunksIngested += chunkRecords.length;
        console.log(`   ✅ Ingested Chapter ${chapterNum} successfully.`);
      }
    }
  }

  console.log(`\n🎉 Ingestion Pipeline Complete! Ingested a total of ${totalChunksIngested} chunks across all chapters.`);
}

ingestTextbooks().catch((err) => {
  console.error("❌ Fatal error in ingestion pipeline:", err);
  process.exit(1);
});
