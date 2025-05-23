interface Summary {
  generalPoints: string[];
  individualPoints: Record<string, string[]>;
}

export async function generateSummary(transcript: string): Promise<Summary> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `You are a meeting summarizer. Please analyze the following meeting transcript and provide a structured summary.

Task: Summarize the standup update into general team points and individual contributions.

Transcript:
${transcript}

Please format your response as a JSON object with exactly this structure:
{
  "generalPoints": ["point1", "point2"],
  "individualPoints": {
    "Name1": ["point1", "point2"],
    "Name2": ["point1", "point2"]
  }
}

Important: Respond ONLY with the JSON object, no additional text.`
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    const data = await response.json();
    const summaryText = data.response;
    
    // Extract JSON from the response
    const jsonMatch = summaryText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid summary format');
    }

    const summary = JSON.parse(jsonMatch[0]);
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
} 