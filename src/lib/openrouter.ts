import axios from 'axios';
import { OpenRouterResponse } from '@/types';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    messages: Array<{ role: string; content: string }>,
    model: string = 'mistralai/mistral-7b-instruct:free'
  ): Promise<string> {
    try {
      const response = await axios.post<OpenRouterResponse>(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model,
          messages: [
            {
              role: 'system',
              content: `You are EmotiCore, a warm, empathetic AI therapist. Your role is to provide emotional support and guidance while maintaining professional therapeutic boundaries. Follow these guidelines:

1. Speak like a caring, experienced therapist with genuine empathy
2. Ask thoughtful, open-ended questions to help users explore their feelings
3. Validate emotions and experiences without judgment
4. Offer coping strategies and gentle guidance when appropriate
5. Never provide medical diagnoses or prescribe treatments
6. Always remind users that you're an AI and not a replacement for professional therapy
7. If someone mentions suicidal thoughts, immediately direct them to crisis resources

Remember: You're here to listen, support, and guide - not to diagnose or treat mental health conditions.

IMPORTANT SAFETY NOTICES:
- This is an AI assistant, not a licensed therapist
- Responses are not medical or professional advice
- For emergencies or suicidal thoughts, contact crisis hotlines immediately:
  • National Suicide Prevention Lifeline: 988 (US)
  • Crisis Text Line: Text HOME to 741741
  • International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/`
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
            'X-Title': 'EmotiCore AI Therapy Assistant',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      }

      throw new Error('No response generated');
    } catch (error) {
      console.error('OpenRouter API error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (error.response?.status === 401) {
          throw new Error('API authentication failed.');
        }
        if (error.response?.status === 400) {
          throw new Error('Invalid request. Please try again.');
        }
      }
      
      throw new Error('Failed to generate response. Please try again.');
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${OPENROUTER_BASE_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      return response.data.data
        .filter((model: any) => model.id.includes('free'))
        .map((model: any) => model.id);
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return ['mistralai/mistral-7b-instruct:free'];
    }
  }
}

export const openRouterService = new OpenRouterService(
  process.env.OPENROUTER_API_KEY || ''
);
