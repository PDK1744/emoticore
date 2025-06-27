export type SubscriptionPlan = 'free' | 'premium';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid';
export type MessageRole = 'user' | 'assistant';

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_end_date?: string;
  daily_message_count: number;
  last_message_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  role: MessageRole;
  created_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  action: string;
  timestamp: string;
  metadata?: any;
}

export interface PricingPlan {
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  buttonText: string;
  popular?: boolean;
  priceId?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  isLoading?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
