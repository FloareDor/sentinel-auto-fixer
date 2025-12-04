import { describe, it, expect } from 'vitest';
import {
  PERSONALITIES,
  getPersonality,
  getAllPersonalities,
  hasPersonality,
  PersonalitySchema
} from '../personalities';
import {
  ALL_QUIPS,
  getRandomQuip,
  getQuipsForNode,
  getQuipsByType,
  DIAGNOSTICIAN_QUIPS,
  ARCHITECT_QUIPS,
  SURGEON_QUIPS,
  VERIFIER_QUIPS
} from '../../personality/quips';
import {
  getPersonalityPrompt,
  getSystemPrompt,
  getExampleThoughts,
  hasPersonalityPrompt
} from '../prompts';

describe('Personalities', () => {
  describe('Personality definitions', () => {
    it('should have all four agent personalities defined', () => {
      expect(PERSONALITIES).toHaveProperty('diagnostician');
      expect(PERSONALITIES).toHaveProperty('architect');
      expect(PERSONALITIES).toHaveProperty('surgeon');
      expect(PERSONALITIES).toHaveProperty('verifier');
    });

    it('should validate personality schemas', () => {
      Object.values(PERSONALITIES).forEach(personality => {
        expect(() => PersonalitySchema.parse(personality)).not.toThrow();
      });
    });

    it('should have distinct names for each personality', () => {
      const names = Object.values(PERSONALITIES).map(p => p.name);
      expect(new Set(names).size).toBe(names.length);
    });

    it('should have distinct voice styles', () => {
      const voices = Object.values(PERSONALITIES).map(p => p.voiceStyle);
      expect(new Set(voices).size).toBe(voices.length);
    });
  });

  describe('getPersonality function', () => {
    it('should return correct personality for each node type', () => {
      expect(getPersonality('diagnostician')?.name).toBe('Dr. Diagnostician');
      expect(getPersonality('architect')?.name).toBe('Architect Alex');
      expect(getPersonality('surgeon')?.name).toBe('Surgeon Sam');
      expect(getPersonality('verifier')?.name).toBe('Verifier Vera');
    });

    it('should return undefined for unknown node types', () => {
      expect(getPersonality('unknown')).toBeUndefined();
      expect(getPersonality('')).toBeUndefined();
    });
  });

  describe('getAllPersonalities function', () => {
    it('should return all four personalities', () => {
      const personalities = getAllPersonalities();
      expect(personalities).toHaveLength(4);
      expect(personalities.map(p => p.nodeType)).toEqual(
        expect.arrayContaining(['diagnostician', 'architect', 'surgeon', 'verifier'])
      );
    });
  });

  describe('hasPersonality function', () => {
    it('should return true for defined personalities', () => {
      expect(hasPersonality('diagnostician')).toBe(true);
      expect(hasPersonality('architect')).toBe(true);
      expect(hasPersonality('surgeon')).toBe(true);
      expect(hasPersonality('verifier')).toBe(true);
    });

    it('should return false for undefined personalities', () => {
      expect(hasPersonality('unknown')).toBe(false);
      expect(hasPersonality('')).toBe(false);
    });
  });
});

describe('Personality Quips', () => {
  describe('Quip collections', () => {
    it('should have quips for all personality types', () => {
      expect(DIAGNOSTICIAN_QUIPS.length).toBeGreaterThan(0);
      expect(ARCHITECT_QUIPS.length).toBeGreaterThan(0);
      expect(SURGEON_QUIPS.length).toBeGreaterThan(0);
      expect(VERIFIER_QUIPS.length).toBeGreaterThan(0);
    });

    it('should have quips of all types for each personality', () => {
      const quipTypes = ['thinking', 'success', 'warning', 'error', 'complete'];

      [DIAGNOSTICIAN_QUIPS, ARCHITECT_QUIPS, SURGEON_QUIPS, VERIFIER_QUIPS].forEach(quips => {
        quipTypes.forEach(type => {
          expect(quips.some(q => q.type === type)).toBe(true);
        });
      });
    });

    it('should have quips with all intensity levels', () => {
      const intensities = ['low', 'medium', 'high'];

      [DIAGNOSTICIAN_QUIPS, ARCHITECT_QUIPS, SURGEON_QUIPS, VERIFIER_QUIPS].forEach(quips => {
        intensities.forEach(intensity => {
          expect(quips.some(q => q.intensity === intensity)).toBe(true);
        });
      });
    });
  });

  describe('ALL_QUIPS collection', () => {
    it('should contain all quip arrays', () => {
      expect(ALL_QUIPS.diagnostician).toEqual(DIAGNOSTICIAN_QUIPS);
      expect(ALL_QUIPS.architect).toEqual(ARCHITECT_QUIPS);
      expect(ALL_QUIPS.surgeon).toEqual(SURGEON_QUIPS);
      expect(ALL_QUIPS.verifier).toEqual(VERIFIER_QUIPS);
    });
  });

  describe('getRandomQuip function', () => {
    it('should return a valid quip for known node types', () => {
      const quip = getRandomQuip('diagnostician');
      expect(quip).toBeTruthy();
      expect(quip?.nodeType).toBe('diagnostician');
    });

    it('should return null for unknown node types', () => {
      const quip = getRandomQuip('unknown' as any);
      expect(quip).toBeNull();
    });

    it('should filter by type when specified', () => {
      const thinkingQuip = getRandomQuip('diagnostician', 'thinking');
      expect(thinkingQuip?.type).toBe('thinking');
    });

    it('should return null when no quips match the type', () => {
      // Mock scenario where a type doesn't exist
      const quip = getRandomQuip('diagnostician', 'nonexistent' as any);
      expect(quip).toBeNull();
    });
  });

  describe('getQuipsForNode function', () => {
    it('should return all quips for a specific node', () => {
      const diagnosticianQuips = getQuipsForNode('diagnostician');
      expect(diagnosticianQuips).toEqual(DIAGNOSTICIAN_QUIPS);

      const architectQuips = getQuipsForNode('architect');
      expect(architectQuips).toEqual(ARCHITECT_QUIPS);
    });

    it('should return empty array for unknown nodes', () => {
      const quips = getQuipsForNode('unknown' as any);
      expect(quips).toEqual([]);
    });
  });

  describe('getQuipsByType function', () => {
    it('should return quips of specific type across all nodes', () => {
      const thinkingQuips = getQuipsByType('thinking');
      expect(thinkingQuips.length).toBeGreaterThan(0);
      thinkingQuips.forEach(quip => {
        expect(quip.type).toBe('thinking');
      });

      const successQuips = getQuipsByType('success');
      expect(successQuips.length).toBeGreaterThan(0);
      successQuips.forEach(quip => {
        expect(quip.type).toBe('success');
      });
    });
  });
});

describe('Personality Prompts', () => {
  describe('getPersonalityPrompt function', () => {
    it('should inject personality into base prompt', () => {
      const basePrompt = 'Analyze this error log and identify the root cause.';
      const enhancedPrompt = getPersonalityPrompt('diagnostician', basePrompt);

      expect(enhancedPrompt).toContain('Dr. Diagnostician');
      expect(enhancedPrompt).toContain(basePrompt);
      expect(enhancedPrompt).toContain('curious and methodical investigator');
    });

    it('should include personality system prompt', () => {
      const basePrompt = 'Test prompt';
      const enhancedPrompt = getPersonalityPrompt('architect', basePrompt);

      expect(enhancedPrompt).toContain('Architect Alex');
      expect(enhancedPrompt).toContain('confident and strategic planner');
    });

    it('should return base prompt for unknown personalities', () => {
      const basePrompt = 'Test prompt';
      const enhancedPrompt = getPersonalityPrompt('unknown', basePrompt);

      expect(enhancedPrompt).toBe(basePrompt);
    });
  });

  describe('getSystemPrompt function', () => {
    it('should return system prompt for known personalities', () => {
      const systemPrompt = getSystemPrompt('surgeon');
      expect(systemPrompt).toContain('Surgeon Sam');
      expect(systemPrompt).toContain('precise and careful code surgeon');
    });

    it('should return empty string for unknown personalities', () => {
      const systemPrompt = getSystemPrompt('unknown');
      expect(systemPrompt).toBe('');
    });
  });

  describe('getExampleThoughts function', () => {
    it('should return example thoughts for known personalities', () => {
      const thoughts = getExampleThoughts('verifier');
      expect(thoughts.length).toBeGreaterThan(0);
      expect(thoughts.some(thought => thought.includes('Double-checking'))).toBe(true);
    });

    it('should return empty array for unknown personalities', () => {
      const thoughts = getExampleThoughts('unknown');
      expect(thoughts).toEqual([]);
    });
  });

  describe('hasPersonalityPrompt function', () => {
    it('should return true for defined personalities', () => {
      expect(hasPersonalityPrompt('diagnostician')).toBe(true);
      expect(hasPersonalityPrompt('architect')).toBe(true);
      expect(hasPersonalityPrompt('surgeon')).toBe(true);
      expect(hasPersonalityPrompt('verifier')).toBe(true);
    });

    it('should return false for undefined personalities', () => {
      expect(hasPersonalityPrompt('unknown')).toBe(false);
      expect(hasPersonalityPrompt('')).toBe(false);
    });
  });

  describe('Personality voice distinctiveness', () => {
    it('should have distinct personality voices in prompts', () => {
      const diagnosticianPrompt = getPersonalityPrompt('diagnostician', 'Test');
      const architectPrompt = getPersonalityPrompt('architect', 'Test');
      const surgeonPrompt = getPersonalityPrompt('surgeon', 'Test');
      const verifierPrompt = getPersonalityPrompt('verifier', 'Test');

      // Each should contain their unique personality markers
      expect(diagnosticianPrompt).toContain('curious and methodical');
      expect(architectPrompt).toContain('confident and strategic');
      expect(surgeonPrompt).toContain('precise and careful');
      expect(verifierPrompt).toContain('meticulous and reassuring');
    });

    it('should include personality-specific phrases in prompts', () => {
      const diagnosticianPrompt = getPersonalityPrompt('diagnostician', 'Test');
      const architectPrompt = getPersonalityPrompt('architect', 'Test');

      expect(diagnosticianPrompt).toContain('Hmm');
      expect(architectPrompt).toContain('Alright');
    });
  });
});
