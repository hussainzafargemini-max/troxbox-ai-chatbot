import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    'GEMINI_API_KEY is missing! Make sure to set GEMINI_API_KEY in your server environment variables.'
  );
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey || '');

/**
 * Generates a 768-dimensional vector embedding for the input text using Gemini text-embedding-004.
 * Useful for semantic vector searches in Supabase.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');
    
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    
    if (result && result.embedding && result.embedding.values) {
      return result.embedding.values;
    }
    
    throw new Error('Invalid embedding response from Gemini API.');
  } catch (error) {
    console.error('Error generating embedding via Gemini:', error);
    throw error;
  }
}

/**
 * Creates a stream of token responses using Gemini-2.5-Flash (or gemini-2.5-flash).
 * Formatted for standard Server-Sent Events (SSE) streaming.
 */
export async function generateChatStream(
  systemInstruction: string,
  userMessage: string
): Promise<ReadableStream> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        if (!apiKey) {
          throw new Error('GEMINI_API_KEY is not configured on the server.');
        }

        // Initialize Gemini model with strict system instructions
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash', // We use gemini-2.5-flash which is widely compatible and highly optimized for speed
          systemInstruction: systemInstruction,
        });

        // Trigger streaming generation
        const chatStream = await model.generateContentStream({
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: 0.1, // low temperature to ensure strict adherence to context and prevent hallucinations
            maxOutputTokens: 500,
          },
        });

        // Iterate over the stream chunk-by-chunk and enqueue to our ReadableStream
        for await (const chunk of chatStream.stream) {
          const text = chunk.text();
          if (text) {
            // Write standard SSE data format
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }

        // Close the stream once all tokens are sent
        controller.close();
      } catch (error: any) {
        console.error('Gemini chat streaming error:', error);
        
        // Write the error block to SSE stream
        const errorMessage = error?.message || 'Server error occurred while generating response.';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
        );
        controller.close();
      }
    },
  });
}

/**
 * A standard non-streaming fallback generator for Gemini chat.
 */
export async function generateChat(
  systemInstruction: string,
  userMessage: string
): Promise<string> {
  try {
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500,
      },
    });

    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating static chat response:', error);
    throw error;
  }
}
