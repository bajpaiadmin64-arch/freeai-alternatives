export const utilityCategories = [
  { id: 'writing', label: 'AI Writing & Text', icon: 'PenLine', emoji: '✍️' },
  { id: 'document', label: 'Document Utilities', icon: 'FileText', emoji: '📄' },
  { id: 'image', label: 'Image Utilities', icon: 'ImageIcon', emoji: '🖼️' },
  { id: 'ocr', label: 'OCR', icon: 'ScanText', emoji: '📑' },
  { id: 'audio', label: 'Audio Utilities', icon: 'Mic', emoji: '🔊' },
  { id: 'quick', label: 'Quick Utilities', icon: 'Zap', emoji: '⚡' },
  { id: 'workspace', label: 'AI Workspace', icon: 'Bot', emoji: '🤖' },
]

export const utilities = [
  { id: 'text-summarizer', name: 'AI Text Summarizer', icon: 'FileText', category: 'writing', description: 'Summarize long texts into key points instantly.', isAI: true },
  { id: 'writing-assistant', name: 'AI Writing Assistant', icon: 'PenLine', category: 'writing', description: 'Rewrite, improve grammar, and generate content.', isAI: true },
  { id: 'translator', name: 'AI Translator', icon: 'Languages', category: 'writing', description: 'Translate text between multiple languages.', isAI: true },
  { id: 'pdf-summarizer', name: 'PDF Summarizer', icon: 'FileText', category: 'document', description: 'Extract key points from PDF documents.', isAI: true },
  { id: 'pdf-qa', name: 'PDF Q&A', icon: 'MessageSquare', category: 'document', description: 'Ask questions about your PDF content.', isAI: true },
  { id: 'background-remover', name: 'Background Remover', icon: 'Eraser', category: 'image', description: 'Remove backgrounds from images.', isAI: true },
  { id: 'image-compressor', name: 'Image Compressor', icon: 'Minimize2', category: 'image', description: 'Reduce image file sizes without quality loss.' },
  { id: 'image-resizer', name: 'Image Resizer', icon: 'Maximize2', category: 'image', description: 'Resize images for any platform or purpose.' },
  { id: 'image-to-text', name: 'Image to Text (OCR)', icon: 'ScanText', category: 'ocr', description: 'Extract text from images and screenshots.', isAI: true },
  { id: 'text-to-speech', name: 'Text to Speech', icon: 'Volume2', category: 'audio', description: 'Convert text to natural-sounding speech.' },
  { id: 'speech-to-text', name: 'Speech to Text', icon: 'Mic', category: 'audio', description: 'Transcribe speech and audio to text.' },
  { id: 'calculator', name: 'Calculator', icon: 'Calculator', category: 'quick', description: 'Basic and scientific calculator.' },
  { id: 'percentage-calculator', name: 'Percentage Calculator', icon: 'Percent', category: 'quick', description: 'Calculate percentages, increases, and discounts.' },
  { id: 'number-to-words', name: 'Number to Words', icon: 'Hash', category: 'quick', description: 'Convert numbers to words in English.' },
  { id: 'qr-generator', name: 'QR Code Generator', icon: 'QrCode', category: 'quick', description: 'Generate QR codes from text and URLs.' },
  { id: 'password-generator', name: 'Password Generator', icon: 'Lock', category: 'quick', description: 'Create secure random passwords.' },
  { id: 'word-counter', name: 'Word & Character Counter', icon: 'Type', category: 'quick', description: 'Count words, characters, and sentences.' },
  { id: 'color-picker', name: 'Color Picker', icon: 'Palette', category: 'quick', description: 'Pick colors and get HEX, RGB, HSL values.' },
  { id: 'unit-converter', name: 'Unit Converter', icon: 'Ruler', category: 'quick', description: 'Convert between common units of measurement.' },
  { id: 'ai-workspace', name: 'AI Workspace', icon: 'Bot', category: 'workspace', description: 'Combine multiple AI tools in one workflow.', isAI: true },
]

export const categoryOrder = ['writing', 'document', 'image', 'ocr', 'audio', 'quick', 'workspace']
