interface Summary {
  generalPoints: string[];
  individualPoints: Record<string, string[]>;
}

export async function generateSummary(transcript: string): Promise<Summary> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt: `Summarize the following standup update into general team points and individual contributions. Format the response as JSON with two fields: "generalPoints" (array of strings) and "individualPoints" (object with names as keys and arrays of strings as values).

Transcript:
${transcript}

Response format:
{
  "generalPoints": ["point1", "point2"],
  "individualPoints": {
    "Name1": ["point1", "point2"],
    "Name2": ["point1", "point2"]
  }
}`,
        stream: false,
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