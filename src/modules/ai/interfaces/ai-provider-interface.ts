export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface AIResponse {
  message: string;
  requestedPhoto: boolean;
  sentiment: Sentiment;
}

export interface AIProvider {
  generateAIResponse(
    message: string,
    prompt: string,
    contextMessages?: any[],
    sentiment?: Sentiment,
  ): Promise<AIResponse>;
  analyzeSentiment(message: string): Promise<Sentiment>;
}
