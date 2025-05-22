# Sync - Voice Standup Summarizer

Sync is a web application that helps teams record and summarize their daily standup meetings. It uses voice recording, speech-to-text conversion, and AI-powered summarization to create structured summaries of team updates.

## Features

- Voice recording using browser's MediaRecorder API
- Speech-to-text conversion using Vosk (offline in-browser)
- AI-powered summarization using Ollama (Llama2)
- Clean and intuitive Material-UI interface
- Real-time processing and display of results

## Prerequisites

- Node.js 18+ and npm
- Ollama installed locally (for LLM functionality)
- Modern web browser with microphone access

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd sync
```

2. Install dependencies:
```bash
npm install
```

3. Download and set up Vosk model:
- Download the small English model from [Vosk Models](https://alphacephei.com/vosk/models)
- Extract the model to the project root directory
- Rename the extracted folder to `vosk-model-small-en-us-0.15`

4. Install and start Ollama:
- Download and install Ollama from [ollama.ai](https://ollama.ai)
- Pull the Llama2 model:
```bash
ollama pull llama2
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click the "Start Recording" button to begin recording your standup
2. Speak clearly into your microphone
3. Click "Stop Recording" when finished
4. Wait for the processing to complete
5. Review the transcript and summary

## Development

The project is built with:
- Next.js 14
- TypeScript
- Material-UI
- Vosk for speech-to-text
- Ollama for AI summarization

## Project Structure

```
sync/
├── src/
│   ├── app/
│   │   └── page.tsx (main page)
│   ├── components/
│   │   ├── Recorder.tsx
│   │   ├── TranscriptDisplay.tsx
│   │   └── SummaryOutput.tsx
│   └── lib/
│       ├── stt.ts (speech-to-text)
│       └── llm.ts (AI summarization)
├── vosk-model-small-en-us-0.15/
├── public/
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
