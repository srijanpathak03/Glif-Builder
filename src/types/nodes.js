import { NodeType } from './flow';

export interface ModelOption {
  id: string;
  name: string;
}

export interface TextGenerationProperties {
  model: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemMessage?: string;
}

export interface ImageGenerationProperties {
  model: string;
  prompt: string;
  negativePrompt?: string;
  ratio: string;
  resolution: string;
  stylePreset: string;
  numImages: number;
  guidanceScale: number;
}

export interface VideoGenerationProperties {
  prompt?: string;
  imageUrl?: string;
  ratio: string;
  length: number;
  fps: number;
  quality: string;
}

export interface AudioGenerationProperties {
  text: string;
  voice: string;
  stability: number;
  similarityBoost: number;
  style: number;
  speakerBoost: boolean;
  model: string;
  outputFormat: string;
}

export const MODEL_OPTIONS = {
  textGeneration: ['ChatGPT 3.5', 'ChatGPT 4', 'Claude', 'Claude 2', 'Haiku', 'GPT-3.5 Sonnet'],
  imageGeneration: ['Leonardo', 'Flux LORA'],
  audioGeneration: ['Multilingual v1', 'Multilingual v2'],
} as const;