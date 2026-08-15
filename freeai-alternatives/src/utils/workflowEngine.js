// ============================================================
// FreeAI Alternatives — Workflow Finder Engine
// ------------------------------------------------------------
// Pure, deterministic recommendation logic. Every tool id,
// name, URL, price status and description comes from the
// existing database in ../data/tools.js — nothing is invented.
// The `why` texts and `ease` scores are editorial guidance
// (recommendation logic), not tool data.
// ============================================================

import { tools } from '../data/tools.js'

const byId = new Map(tools.map((t) => [t.id, t]))

// Canonical pipeline order — steps are displayed in this
// sequence (research before writing before publishing, etc.).
const ORDER = {
  research: 1, 'pdf-analysis': 2, summarize: 3, writing: 4, script: 5, voiceover: 6,
  'video-create': 7, 'video-edit': 8, subtitles: 9, thumbnail: 10, 'image-gen': 11,
  'image-edit': 12, design: 13, presentation: 14, marketing: 15, grammar: 16,
  paraphrase: 17, translate: 18, language: 19, 'coding-chat': 20, 'coding-build': 21,
  math: 22, exam: 23, meetings: 24, brainstorm: 25, 'local-ai': 26, models: 27, chat: 28,
}

// Higher = better when "prioritize free tools" is applied.
const FREE_RANK = {
  'Completely Free': 3,
  'Open Source': 3,
  'Free Tier': 2,
  'Free Account Required': 1,
  'Free with Limits': 1,
  'Limited Free': 0,
}

// Intents: keyword -> curated candidates (ordered by default
// preference; scoring may reorder based on free status, ease
// and explicit tool mentions in the user's request).
const INTENTS = [
  {
    key: 'research',
    label: 'Research & Collect Information',
    emoji: '🔎',
    keywords: [
      'research', 'investigate', 'look up', 'find information', 'learn about', 'gather',
      'collect info', 'fact-check', 'sources', 'assignment', 'answer a question',
      'explore a topic', 'check facts', 'citations',
    ],
    candidates: [
      { id: 'perplexity', why: 'Cited, web-grounded answers keep your research accurate and easy to verify.', ease: 3 },
      { id: 'kimi', why: 'Built for web research and long documents — good for digging deep into a topic.', ease: 2 },
      { id: 'consensus', why: 'Answers questions directly from published studies, so claims are evidence-backed.', ease: 2 },
      { id: 'gemini', why: 'A general assistant with real Google Search grounding and a huge context window.', ease: 2 },
      { id: 'notebooklm', why: 'Collects and cross-references your own sources alongside web research.', ease: 2 },
      { id: 'semantic-scholar', why: 'The best starting point for academic papers and scholarly sources.', ease: 1 },
      { id: 'elicit', why: 'Designed for systematic literature reviews with structured findings.', ease: 1 },
    ],
  },
  {
    key: 'summarize',
    label: 'Summarize the Documents',
    emoji: '📄',
    keywords: ['summarize', 'summary', 'condense', 'key points', 'digest', 'long document', 'extract the main'],
    candidates: [
      { id: 'notebooklm', why: 'Purpose-built for condensing documents into clear, source-grounded summaries.', ease: 3 },
      { id: 'kimi', why: 'Handles long documents and returns clean, focused summaries.', ease: 2 },
      { id: 'claude', why: 'Known for careful, high-quality long-document analysis and writing.', ease: 2 },
      { id: 'gemini', why: 'Large context window lets it summarize very long documents in one go.', ease: 2 },
      { id: 'chatgpt', why: 'A familiar assistant that summarizes pasted text quickly on the free plan.', ease: 2 },
    ],
  },
  {
    key: 'pdf-analysis',
    label: 'Analyze the PDF',
    emoji: '📑',
    keywords: ['pdf', 'analyze a document', 'document analysis', 'read a paper', 'research paper', 'scan a document'],
    candidates: [
      { id: 'notebooklm', why: 'Upload your PDF and it answers questions directly from the document with citations.', ease: 3 },
      { id: 'kimi', why: 'Reads long documents and papers, then answers questions about them.', ease: 2 },
      { id: 'claude', why: 'Uploads files and analyzes long documents with careful, structured answers.', ease: 2 },
      { id: 'gemini', why: 'Uploads files and handles very long PDFs thanks to its 1M-token context window.', ease: 2 },
      { id: 'consensus', why: 'Finds and reads relevant studies so your analysis is evidence-based.', ease: 1 },
    ],
  },
  {
    key: 'presentation',
    label: 'Build the Presentation',
    emoji: '📊',
    keywords: ['presentation', 'slides', 'slide deck', 'pitch deck', 'powerpoint', 'keynote', 'present'],
    candidates: [
      { id: 'gamma', why: 'Purpose-built for turning an outline into a complete slide deck in minutes.', ease: 3 },
      { id: 'canva', why: 'Huge library of presentation templates with drag-and-drop editing.', ease: 2 },
      { id: 'chatgpt', why: 'Great for drafting the outline, talking points and speaker notes first.', ease: 2 },
      { id: 'claude', why: 'Writes strong outlines and narrative flow for a polished presentation.', ease: 2 },
    ],
  },
  {
    key: 'writing',
    label: 'Write the Content',
    emoji: '✍️',
    keywords: ['write', 'writing', 'essay', 'article', 'blog', 'draft', 'essay', 'email', 'story', 'poem', 'content'],
    candidates: [
      { id: 'claude', why: 'Its strongest skill is high-quality, natural writing across any format.', ease: 3 },
      { id: 'chatgpt', why: 'A reliable everyday writing assistant for essays, emails and drafts.', ease: 3 },
      { id: 'copy-ai', why: 'Focused on marketing and business copy that is ready to publish.', ease: 2 },
      { id: 'gemini', why: 'A capable general assistant for drafting and refining content.', ease: 2 },
      { id: 'deepseek', why: 'A completely free option that writes well, with no hard message cap.', ease: 1 },
    ],
  },
  {
    key: 'grammar',
    label: 'Polish the Writing',
    emoji: '✏️',
    keywords: ['grammar', 'proofread', 'editing', 'rewrite', 'polish', 'punctuation', 'spelling', 'mistakes'],
    candidates: [
      { id: 'grammarly', why: 'The best-known proofreader — grammar, spelling, clarity and tone in one pass.', ease: 3 },
      { id: 'quillbot', why: 'Rewrites and polishes sentences while fixing grammar along the way.', ease: 2 },
      { id: 'chatgpt', why: 'Can proofread any pasted text and explain the corrections it makes.', ease: 1 },
    ],
  },
  {
    key: 'paraphrase',
    label: 'Paraphrase & Avoid Plagiarism',
    emoji: '🔁',
    keywords: ['paraphrase', 'reword', 'rephrase', 'avoid plagiarism', 'own words', 'citation'],
    candidates: [
      { id: 'quillbot', why: 'Its core feature is fast, natural paraphrasing with citation help.', ease: 3 },
      { id: 'grammarly', why: 'Rewrites sentences and improves flow while keeping your meaning.', ease: 2 },
      { id: 'claude', why: 'Rephrases text in your own style with careful, natural wording.', ease: 1 },
    ],
  },
  {
    key: 'translate',
    label: 'Translate the Text',
    emoji: '🌐',
    keywords: ['translate', 'translation', 'another language', 'in french', 'in spanish', 'in german', 'in japanese'],
    candidates: [
      { id: 'deepl', why: 'Widely regarded as the most natural, accurate free translator.', ease: 3 },
      { id: 'quillbot', why: 'Combines translation with paraphrasing so the result reads naturally.', ease: 1 },
      { id: 'duolingo', why: 'Helps you understand and practice the language you are learning.', ease: 1 },
    ],
  },
  {
    key: 'script',
    label: 'Write the Script',
    emoji: '📝',
    keywords: ['script', 'screenplay', 'video script', 'youtube script', 'dialogue', 'narration text'],
    candidates: [
      { id: 'claude', why: 'Writes engaging scripts with natural pacing and tone.', ease: 3 },
      { id: 'chatgpt', why: 'Quickly drafts scripts in any style — funny, serious, educational.', ease: 2 },
      { id: 'invideo', why: 'Generates a full script automatically as part of its script-to-video flow.', ease: 2 },
      { id: 'copy-ai', why: 'Built for punchy, conversion-focused video and ad scripts.', ease: 2 },
    ],
  },
  {
    key: 'voiceover',
    label: 'Generate the Voiceover',
    emoji: '🎙️',
    keywords: ['voiceover', 'voice over', 'narration', 'voice', 'audio voice'],
    candidates: [
      { id: 'invideo', why: 'Its script-to-video workflow adds an AI voiceover narration automatically.', ease: 3 },
      { id: 'clipchamp', why: 'Free video editor with text-to-speech options for narration tracks.', ease: 2 },
    ],
  },
  {
    key: 'subtitles',
    label: 'Add Subtitles & Captions',
    emoji: '🎬',
    keywords: ['subtitle', 'subtitles', 'captions', 'closed captions', 'srt'],
    candidates: [
      { id: 'veed', why: 'Auto-subtitles are its signature feature — accurate and easy to style.', ease: 3 },
      { id: 'clipchamp', why: 'Free editor with automatic caption generation for your videos.', ease: 2 },
      { id: 'invideo', why: 'Adds captions while assembling your video from a script.', ease: 1 },
    ],
  },
  {
    key: 'thumbnail',
    label: 'Design the Thumbnail',
    emoji: '🖼️',
    keywords: ['thumbnail', 'youtube thumbnail', 'cover image', 'clickbait image'],
    candidates: [
      { id: 'canva', why: 'Thumbnail templates with drag-and-drop text and graphics — no design skills needed.', ease: 3 },
      { id: 'ideogram', why: 'Generates images with accurate text baked in — handy for title-heavy thumbnails.', ease: 2 },
      { id: 'imagefx', why: 'Free, high-quality image generation to use as a base for your thumbnail.', ease: 2 },
      { id: 'microsoft-designer', why: 'Quick AI-generated designs that are easy to customize.', ease: 1 },
    ],
  },
  {
    key: 'video-create',
    label: 'Create the Video',
    emoji: '🎥',
    keywords: ['youtube video', 'make a video', 'create video', 'create a video', 'video content', 'film', 'youtube channel'],
    candidates: [
      { id: 'invideo', why: 'Turns a script into a complete narrated video automatically.', ease: 3 },
      { id: 'veed', why: 'Easy online editor with subtitles, templates and quick polish.', ease: 2 },
      { id: 'clipchamp', why: 'A genuinely free editor with everything needed to assemble a video.', ease: 2 },
      { id: 'kling', why: 'Generates AI video clips you can drop into your project.', ease: 1 },
    ],
  },
  {
    key: 'video-gen',
    label: 'Generate AI Video Clips',
    emoji: '🤖',
    keywords: ['ai video', 'text to video', 'generate video', 'text-to-video', 'animation', 'ai clips'],
    candidates: [
      { id: 'kling', why: 'Daily free credits for generating realistic AI video clips.', ease: 3 },
      { id: 'luma', why: 'Strong at realistic motion from text or image prompts.', ease: 2 },
      { id: 'hailuo', why: 'Excellent with realistic human subjects and natural movement.', ease: 2 },
      { id: 'pika', why: 'Fun creative effects and easy prompt-based generation.', ease: 2 },
      { id: 'runway', why: 'Premium quality clips, though the free allowance is limited.', ease: 1 },
      { id: 'invideo', why: 'Generates full narrated videos from a script without editing.', ease: 1 },
    ],
  },
  {
    key: 'video-edit',
    label: 'Edit the Video',
    emoji: '✂️',
    keywords: ['edit video', 'video editing', 'trim', 'cut clips', 'combine clips', 'video editor'],
    candidates: [
      { id: 'clipchamp', why: 'A completely free, full-featured editor for trimming, cutting and combining clips.', ease: 3 },
      { id: 'veed', why: 'Quick online edits with subtitles and templates.', ease: 2 },
      { id: 'invideo', why: 'Assembles and edits videos from a script with templates.', ease: 1 },
    ],
  },
  {
    key: 'image-gen',
    label: 'Create the Images',
    emoji: '🎨',
    keywords: ['ai image', 'generate image', 'generate images', 'image', 'images', 'art', 'picture', 'logo', 'illustration', 'create an image', 'create images'],
    candidates: [
      { id: 'imagefx', why: 'Free, high-quality image generation straight from Google.', ease: 3 },
      { id: 'leonardo', why: 'Generous free credits and powerful creative controls.', ease: 3 },
      { id: 'ideogram', why: 'Best when you need legible text inside the generated image.', ease: 2 },
      { id: 'microsoft-designer', why: 'Simple AI image creation with easy edits.', ease: 2 },
      { id: 'craiyon', why: 'Completely free with no account required for quick casual images.', ease: 2 },
      { id: 'gemini', why: 'Built-in free image generation inside a general assistant.', ease: 1 },
      { id: 'stable-diffusion', why: 'Open-source and unlimited if you can run it locally.', ease: 1 },
      { id: 'flux', why: 'Open, photorealistic models for local generation.', ease: 1 },
    ],
  },
  {
    key: 'image-edit',
    label: 'Edit the Images',
    emoji: '🖌️',
    keywords: ['remove the background', 'remove background', 'background removal', 'edit image', 'edit a photo', 'retouch', 'enhance photo', 'resize image', 'crop'],
    candidates: [
      { id: 'canva', why: 'One-click background removal, resizing and touch-ups — all in the free editor.', ease: 3 },
      { id: 'microsoft-designer', why: 'AI-powered edits like background removal are easy to apply.', ease: 2 },
      { id: 'leonardo', why: 'Creative tools that can rework and enhance images.', ease: 1 },
    ],
  },
  {
    key: 'design',
    label: 'Design the Graphics',
    emoji: '📐',
    keywords: ['design', 'poster', 'flyer', 'banner', 'social media graphic', 'graphics', 'branding', 'infographic'],
    candidates: [
      { id: 'canva', why: 'The easiest place to design posters, flyers and social graphics with templates.', ease: 3 },
      { id: 'ideogram', why: 'Generates designs with readable text baked in.', ease: 2 },
      { id: 'microsoft-designer', why: 'Fast AI-assisted designs you can customize in minutes.', ease: 2 },
      { id: 'leonardo', why: 'More advanced creative control for original graphics.', ease: 1 },
    ],
  },
  {
    key: 'coding-chat',
    label: 'Write & Debug Code',
    emoji: '💻',
    keywords: ['write code', 'coding', 'code', 'debug', 'fix error', 'fix a bug', 'program', 'python', 'javascript', 'explain code'],
    candidates: [
      { id: 'chatgpt', why: 'Explains code, writes snippets and debugs — no install needed.', ease: 3 },
      { id: 'deepseek', why: 'A completely free assistant famous for strong coding and reasoning.', ease: 3 },
      { id: 'claude', why: 'Excellent at careful code review and debugging across languages.', ease: 2 },
      { id: 'qwen', why: 'A completely free assistant that handles coding questions well.', ease: 2 },
      { id: 'gemini', why: 'Capable coding help with a huge context window for big files.', ease: 2 },
      { id: 'github-copilot', why: 'Inline autocomplete right inside your editor once you are ready.', ease: 1 },
      { id: 'gemini-code-assist', why: 'Free high-volume autocomplete inside supported editors.', ease: 1 },
    ],
  },
  {
    key: 'coding-build',
    label: 'Build the App',
    emoji: '🏗️',
    keywords: ['build an app', 'build a website', 'build an application', 'web app', 'developer', 'ide', 'editor', 'autocomplete', 'agentic coding', 'code editor'],
    candidates: [
      { id: 'cursor', why: 'An AI-first editor that writes and refactors whole features as you go.', ease: 3 },
      { id: 'github-copilot', why: 'The most popular AI pair programmer, free tier included.', ease: 3 },
      { id: 'windsurf', why: 'Autocomplete plus agent-style work in a familiar editor.', ease: 2 },
      { id: 'cline', why: 'Open-source agentic coding that runs free in your editor.', ease: 2 },
      { id: 'gemini-code-assist', why: 'Free high-volume autocomplete for everyday coding.', ease: 2 },
      { id: 'continue', why: 'Open-source coding assistant that works with local models.', ease: 1 },
      { id: 'aider', why: 'Pairs with Git for terminal-based AI pair programming.', ease: 1 },
      { id: 'zed', why: 'A fast open-source editor with built-in AI features.', ease: 1 },
    ],
  },
  {
    key: 'math',
    label: 'Solve the Math',
    emoji: '➗',
    keywords: ['math', 'maths', 'mathematics', 'algebra', 'calculus', 'equation', 'geometry', 'trigonometry', 'solve'],
    candidates: [
      { id: 'math-solver', why: 'Microsoft Math Solver shows step-by-step solutions for free.', ease: 3 },
      { id: 'photomath', why: 'Point your camera at a problem and get an instant worked solution.', ease: 3 },
      { id: 'qwen', why: 'A completely free assistant that explains math problems clearly.', ease: 1 },
      { id: 'chatgpt', why: 'Walks through math problems step by step in chat.', ease: 1 },
    ],
  },
  {
    key: 'exam',
    label: 'Study & Prepare',
    emoji: '🎓',
    keywords: ['exam', 'study', 'test prep', 'quiz', 'flashcards', 'memorize', 'revision', 'prepare for'],
    candidates: [
      { id: 'quizlet', why: 'Flashcards and quizzes are the fastest way to memorize material.', ease: 3 },
      { id: 'notebooklm', why: 'Turns your notes and documents into study guides you can quiz yourself on.', ease: 2 },
      { id: 'photomath', why: 'Step-by-step math help when the exam includes problem solving.', ease: 1 },
      { id: 'duolingo', why: 'Perfect for practicing languages with short daily lessons.', ease: 1 },
    ],
  },
  {
    key: 'language',
    label: 'Learn the Language',
    emoji: '🗣️',
    keywords: ['learn a language', 'learn french', 'learn spanish', 'learn german', 'learn japanese', 'learn english', 'practice speaking', 'vocabulary'],
    candidates: [
      { id: 'duolingo', why: 'The most popular free app for building language skills day by day.', ease: 3 },
      { id: 'deepl', why: 'Accurate translations to check your own attempts and expand vocabulary.', ease: 2 },
      { id: 'quillbot', why: 'Paraphrases and rewrites sentences to see natural phrasing.', ease: 1 },
    ],
  },
  {
    key: 'meetings',
    label: 'Take Meeting Notes',
    emoji: '🗒️',
    keywords: ['meeting', 'meeting notes', 'transcribe', 'transcription', 'record a meeting', 'meeting summary'],
    candidates: [
      { id: 'otter', why: 'Real-time transcription and automatic summaries of meetings.', ease: 3 },
      { id: 'fireflies', why: 'Records, transcribes and summarizes meetings automatically.', ease: 2 },
      { id: 'gemini', why: 'You can paste transcripts and get clean summaries in seconds.', ease: 1 },
    ],
  },
  {
    key: 'local-ai',
    label: 'Run AI Privately & Locally',
    emoji: '🏠',
    keywords: ['local', 'offline', 'privacy', 'run on my computer', 'my own data', 'private', 'no cloud', 'self-hosted'],
    candidates: [
      { id: 'ollama', why: 'The easiest way to run open models on your own computer.', ease: 3 },
      { id: 'lm-studio', why: 'A polished, completely free app for chatting with local models.', ease: 2 },
      { id: 'gpt4all', why: 'Open-source desktop app that keeps everything private and offline.', ease: 2 },
      { id: 'jan', why: 'A clean offline assistant with local models.', ease: 2 },
      { id: 'open-webui', why: 'A self-hosted chat interface with powerful features.', ease: 1 },
      { id: 'huggingface', why: 'The hub for open models, datasets and demos to experiment with.', ease: 1 },
    ],
  },
  {
    key: 'models',
    label: 'Compare Many Models',
    emoji: '🧪',
    keywords: ['try different models', 'compare models', 'try many ai', 'switch models', 'test models'],
    candidates: [
      { id: 'poe', why: 'One app that lets you try many leading models side by side.', ease: 3 },
      { id: 'huggingchat', why: 'Free access to many open models in one chat interface.', ease: 2 },
      { id: 'open-webui', why: 'Self-hosted hub where you can switch between local models.', ease: 1 },
      { id: 'le-chat', why: 'Lets you hop between Mistral model versions in one chat.', ease: 1 },
    ],
  },
  {
    key: 'marketing',
    label: 'Write Marketing Copy',
    emoji: '📣',
    keywords: ['marketing', 'ad copy', 'product description', 'sales', 'email marketing', 'social media post', 'ads'],
    candidates: [
      { id: 'copy-ai', why: 'Purpose-built for ads, product descriptions and marketing copy.', ease: 3 },
      { id: 'chatgpt', why: 'Drafts persuasive copy quickly and iterates on your feedback.', ease: 2 },
      { id: 'claude', why: 'Writes polished, on-brand copy with a strong voice.', ease: 2 },
      { id: 'grammarly', why: 'Tightens and polishes the final copy before publishing.', ease: 1 },
    ],
  },
  {
    key: 'brainstorm',
    label: 'Brainstorm Ideas',
    emoji: '💡',
    keywords: ['brainstorm', 'ideas', 'ideation', 'come up with', 'creative ideas', 'plan'],
    candidates: [
      { id: 'chatgpt', why: 'Fast at generating lots of varied ideas to pick from.', ease: 3 },
      { id: 'claude', why: 'Structured, thoughtful suggestions with context in mind.', ease: 2 },
      { id: 'gemini', why: 'Combines brainstorming with live web search for fresh inspiration.', ease: 2 },
    ],
  },
  {
    key: 'chat',
    label: 'Get a General AI Assistant',
    emoji: '💬',
    keywords: ['assistant', 'chatbot', 'chat', 'ask a question', 'answer my questions', 'talk to ai', 'general ai'],
    candidates: [
      { id: 'gemini', why: 'A well-rounded free assistant with search and a huge context window.', ease: 3 },
      { id: 'chatgpt', why: 'The most familiar assistant, covering almost any everyday task.', ease: 3 },
      { id: 'deepseek', why: 'Completely free with strong reasoning and no hard message cap.', ease: 2 },
      { id: 'claude', why: 'Careful, high-quality answers across most general questions.', ease: 2 },
      { id: 'copilot', why: 'Web-grounded answers with up-to-date search results.', ease: 2 },
      { id: 'le-chat', why: 'A privacy-friendly free assistant from Mistral.', ease: 1 },
      { id: 'qwen', why: 'A completely free assistant with capable answers.', ease: 1 },
      { id: 'duckai', why: 'Completely free and private for quick questions.', ease: 1 },
    ],
  },
]

export const samplePrompts = [
  { emoji: '🎓', text: 'Help me study for an exam' },
  { emoji: '📹', text: 'Help me create a YouTube video' },
  { emoji: '🎨', text: 'I need to create AI images' },
  { emoji: '💻', text: 'I need help with coding' },
  { emoji: '📄', text: 'I need to analyze a PDF' },
]

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchKeywords(intent, text) {
  const hits = []
  for (const kw of intent.keywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(text)) hits.push(kw)
  }
  return hits
}

function mentionsTool(tool, text) {
  const words = tool.name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['google', 'microsoft', 'the', 'with'].includes(w))
  return words.some((w) => new RegExp(`\\b${w}\\b`).test(text)) || text.includes(tool.id)
}

function pickForIntent(intent, text) {
  const scored = intent.candidates
    .map((c, i) => {
      const tool = byId.get(c.id)
      if (!tool) return null
      const score =
        4 / (i + 1) +
        (FREE_RANK[tool.freeStatus] ?? 1) * 1.6 +
        (c.ease ?? 2) * 0.6 +
        (mentionsTool(tool, text) ? 9 : 0)
      return { tool, score, why: c.why }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
  const best = scored[0]
  const alternative = scored.find((s) => s.tool.id !== best.tool.id && (FREE_RANK[s.tool.freeStatus] ?? 0) >= 1) || null
  return { best, alternative, score: best.score }
}

// Returns { ok:true, query, steps, best } or { ok:false, reason: 'empty'|'unclear' }
export function analyzeRequest(input) {
  const text = normalize(input)
  if (text.length < 3) return { ok: false, reason: 'empty' }

  const matched = INTENTS.map((intent) => ({ intent, hits: matchKeywords(intent, text) }))
    .filter((m) => m.hits.length > 0)
    .sort((a, b) => {
      const specB = Math.max(...b.hits.map((h) => h.length))
      const specA = Math.max(...a.hits.map((h) => h.length))
      return b.hits.length - a.hits.length || specB - specA || INTENTS.indexOf(a.intent) - INTENTS.indexOf(b.intent)
    })

  const multi = matched.length > 1
  let chosen = matched.slice(0, 5).map((m) => m.intent)
  if (multi) chosen = chosen.filter((i) => i.key !== 'chat' && i.key !== 'models')
  if (chosen.length === 0) {
    return { ok: false, reason: text.split(' ').length >= 4 ? 'no-match' : 'unclear' }
  }

  const steps = []
  const usedTools = new Map()
  for (const m of matched.slice(0, 5)) {
    const intent = m.intent
    const specificity = Math.max(...m.hits.map((h) => h.length))
    const tiebreak = m.hits.length * 0.5 + specificity * 0.05
    const { best, alternative, score } = pickForIntent(intent, text)
    if (usedTools.has(best.tool.id) && alternative && !usedTools.has(alternative.tool.id)) {
      usedTools.set(alternative.tool.id, intent.key)
      steps.push({ key: intent.key, label: intent.label, emoji: intent.emoji, tool: alternative.tool, why: alternative.why, alternative: best.tool, altWhy: best.why, score: score + tiebreak })
    } else if (!usedTools.has(best.tool.id)) {
      usedTools.set(best.tool.id, intent.key)
      steps.push({ key: intent.key, label: intent.label, emoji: intent.emoji, tool: best.tool, why: best.why, alternative: alternative ? alternative.tool : null, altWhy: alternative ? alternative.why : null, score: score + tiebreak })
    }
  }
  if (steps.length === 0) return { ok: false, reason: 'unclear' }

  steps.sort((a, b) => (ORDER[a.key] ?? 50) - (ORDER[b.key] ?? 50))

  const best = [...steps].sort((a, b) => b.score - a.score)[0]
  return {
    ok: true,
    query: text,
    intents: steps.map((s) => s.key),
    steps,
    best: { tool: best.tool, why: best.why },
  }
}