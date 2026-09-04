# MedAce AI

An adaptive prep coach for MDCAT (Medical and Dental College Admission Test), Pakistan's high-stakes pre-medical entrance exam. MedAce AI keeps the exam experience authentic — English interface, English MCQs — while adding an Urdu explanation layer for students who understand a concept better in Urdu than in English.

---

## The Problem

Millions of students prepare for MDCAT every year, and the exam decides who gets into medical school in Pakistan. Despite the stakes, most students are left to prepare with:

- **Expensive, urban-concentrated tutoring.** Quality MDCAT coaching is clustered in major cities and priced out of reach for most families. Students outside these hubs get a fraction of the same support.
- **No real personalization.** Existing apps and question banks throw the same content at every student. Nobody tells a student *what* they keep getting wrong, *why*, or what to study next — so hours of practice go into topics they've already mastered while real gaps stay unaddressed.
- **A language gap that isn't the exam's fault, but is still real.** MDCAT is conducted entirely in English, and that's not going to change — nor should it. But many students, especially those from Urdu-medium schooling backgrounds, can read an English MCQ just fine yet lose precision when the *explanation* of a concept is also delivered in dense, academic English. The concept doesn't fully land, even when the question technically makes sense to them. Existing prep tools don't address this at all.

The result: students grind through generic practice with no feedback loop, no map of their own weaknesses, and — for a large segment — an explanation layer that isn't built for how they actually think through a hard concept.

## What We're Solving

MedAce AI is built to mirror the real exam experience, not abstract away from it — and to add exactly one high-leverage layer on top: understanding.

- **Same exam, same language.** The interface and every MCQ are in English, exactly as students will encounter on test day. No translation of exam content, no shortcuts that create a gap between practice and the real thing.
- **Explanations in plain, code-mixed Urdu — when a student needs them.** When a student is stuck or repeatedly getting a concept wrong, they can get the explanation broken down in the Urdu-English mix students actually think and study in (technical terms like "enzyme" or "osmosis" stay as-is; the reasoning around them is explained in Urdu). This isn't a language toggle for its own sake — it's there to build the underlying concept, not just help them memorize English phrasing.
- **Adaptive weak-spot tracking.** The app tracks where each student is actually going wrong — by topic, by concept, by pattern of mistakes — and directs future practice there instead of serving random questions. Struggling with a specific topic repeatedly can also be the trigger that surfaces the Urdu explanation, tying the language layer directly into the adaptive engine rather than treating it as a separate feature.

---

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Google Gemini
GEMINI_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

```

## License

Private — All rights reserved.
