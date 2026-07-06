import { customInstance } from '@/lib/api/api-client';

export interface AiNegotiationRequest {
  product_id: number;
  offered_price: number;
  message?: string;
}

export interface AiNegotiationResponse {
  verdict?: string;
  counter_price?: number;
  summary?: string;
  confidence?: string;
  tips?: string[];
  sources?: string[];
}

export interface AiCompatibilityCheckRequest {
  product_id_a: number;
  product_id_b: number;
}

export interface AiCompatibilityCheckResponse {
  score?: number;
  summary?: string;
  works_well?: string[];
  concerns?: string[];
  category?: string;
  compatibility?: string;
  sources?: string[];
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiRecommendedProduct {
  product?: {
    id?: number;
    name?: string;
    slug?: string;
    price?: number;
    images?: string[];
  };
  reason?: string;
}

export interface AiPersonalShoppingAgentRequest {
  messages: AiChatMessage[];
  goal?: string;
}

export interface AiPersonalShoppingAgentResponse {
  reply?: string;
  memory_summary?: string;
  taste_signals?: string[];
  follow_up_questions?: string[];
  recommendations?: AiRecommendedProduct[];
  sources?: string[];
}

export async function postAiNegotiation(data: AiNegotiationRequest) {
  return customInstance<{ data?: AiNegotiationResponse }>({
    url: '/ai/negotiation',
    method: 'POST',
    data
  });
}

export async function postAiCompatibilityCheck(data: AiCompatibilityCheckRequest) {
  return customInstance<{ data?: AiCompatibilityCheckResponse }>({
    url: '/ai/compatibility-check',
    method: 'POST',
    data
  });
}

export async function postAiPersonalShoppingAgent(data: AiPersonalShoppingAgentRequest) {
  return customInstance<{ data?: AiPersonalShoppingAgentResponse }>({
    url: '/ai/personal-shopping-agent',
    method: 'POST',
    data
  });
}
