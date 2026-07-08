export type VendorAssistantVariant = 'landing' | 'panel';

export type VendorAssistantChatRole = 'assistant' | 'user';

export interface VendorAssistantChatMessage {
  id: string;
  role: VendorAssistantChatRole;
  content: string;
}
