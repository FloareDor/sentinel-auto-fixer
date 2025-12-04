import { getPersonality } from './personalities';
import { getRandomQuip } from '../personality/quips';

/**
 * Get a personality-enhanced prompt for a specific node
 * @param nodeName - The name of the agent node (diagnostician, architect, surgeon, verifier)
 * @param basePrompt - The base prompt text to enhance with personality
 * @returns Enhanced prompt with personality injected
 */
export function getPersonalityPrompt(nodeName: string, basePrompt: string): string {
  const personality = getPersonality(nodeName);

  if (!personality) {
    // Fallback to base prompt if personality not found
    return basePrompt;
  }

  // Get a random thinking quip to add personality flavor
  const randomQuip = getRandomQuip(personality.nodeType, 'thinking');

  // Build enhanced prompt with personality
  const personalityPrefix = personality.systemPrompt;
  const quipText = randomQuip ? `\n\n${randomQuip.text}` : '';

  return `${personalityPrefix}

${basePrompt}${quipText}

Remember to maintain your personality throughout your response. Use natural, conversational language that reflects your character traits.`;
}

/**
 * Get the system prompt for a specific node without a base prompt
 * @param nodeName - The name of the agent node
 * @returns System prompt for the personality
 */
export function getSystemPrompt(nodeName: string): string {
  const personality = getPersonality(nodeName);
  return personality?.systemPrompt || '';
}

/**
 * Get example thoughts for a specific node
 * @param nodeName - The name of the agent node
 * @returns Array of example thoughts
 */
export function getExampleThoughts(nodeName: string): string[] {
  const personality = getPersonality(nodeName);
  return personality?.exampleThoughts || [];
}

/**
 * Check if a node has a defined personality
 * @param nodeName - The name of the agent node
 * @returns True if personality exists
 */
export function hasPersonalityPrompt(nodeName: string): boolean {
  return getPersonality(nodeName) !== undefined;
}
