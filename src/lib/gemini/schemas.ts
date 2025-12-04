import { z } from 'zod';

/**
 * Base schema for all agent node responses
 */
const BaseNodeResponseSchema = z.object({
  thought: z.string().describe('The agent\'s reasoning thought process'),
  confidence: z.number().min(0).max(1).describe('Confidence level (0-1)'),
  timestamp: z.number().describe('Unix timestamp when response was generated'),
});

/**
 * Diagnostician node response schema
 */
export const DiagnosticianResponseSchema = BaseNodeResponseSchema.extend({
  rootCause: z.string().describe('Identified root cause of the error'),
  errorCategory: z.enum([
    'syntax_error',
    'runtime_error',
    'logic_error',
    'dependency_error',
    'configuration_error',
    'network_error',
    'unknown'
  ]).describe('Category of the error'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).describe('Severity level'),
  suggestedFix: z.string().describe('High-level suggestion for fixing the issue'),
});

export type DiagnosticianResponse = z.infer<typeof DiagnosticianResponseSchema>;

/**
 * Architect node response schema
 */
export const ArchitectResponseSchema = BaseNodeResponseSchema.extend({
  plan: z.array(z.object({
    step: z.string().describe('Step description'),
    action: z.string().describe('Specific action to take'),
    rationale: z.string().describe('Why this step is necessary'),
  })).describe('Detailed fix plan as ordered steps'),
  estimatedComplexity: z.enum(['low', 'medium', 'high']).describe('Estimated complexity of the fix'),
  riskLevel: z.enum(['low', 'medium', 'high']).describe('Risk level of implementing the fix'),
  prerequisites: z.array(z.string()).describe('Any prerequisites needed before implementing'),
});

export type ArchitectResponse = z.infer<typeof ArchitectResponseSchema>;

/**
 * Surgeon node response schema
 */
export const SurgeonResponseSchema = BaseNodeResponseSchema.extend({
  codePatch: z.string().describe('The actual code patch/diff to apply'),
  language: z.string().describe('Programming language of the code'),
  modifiedFiles: z.array(z.object({
    fileName: z.string().describe('Name of the file being modified'),
    originalContent: z.string().describe('Original content of the file'),
    modifiedContent: z.string().describe('Modified content of the file'),
  })).describe('Files that would be modified with their content changes'),
  backupStrategy: z.string().describe('Strategy for backing up original code'),
  validationSteps: z.array(z.string()).describe('Steps to validate the fix works'),
});

export type SurgeonResponse = z.infer<typeof SurgeonResponseSchema>;

/**
 * Verifier node response schema
 */
export const VerifierResponseSchema = BaseNodeResponseSchema.extend({
  isValid: z.boolean().describe('Whether the patch is valid and safe to apply'),
  issues: z.array(z.object({
    type: z.enum(['syntax', 'logic', 'security', 'performance', 'compatibility']),
    description: z.string(),
    severity: z.enum(['warning', 'error']),
    lineNumber: z.number().optional(),
  })).describe('Any issues found during verification'),
  recommendations: z.array(z.string()).describe('Recommendations for improvement'),
  canProceed: z.boolean().describe('Whether it\'s safe to proceed with the patch'),
});

export type VerifierResponse = z.infer<typeof VerifierResponseSchema>;

/**
 * Schema for validating code patches
 */
export const CodePatchSchema = z.object({
  originalCode: z.string().describe('The original code before patching'),
  patchedCode: z.string().describe('The code after applying the patch'),
  diff: z.string().describe('Unified diff format showing changes'),
  language: z.string().describe('Programming language'),
});

export type CodePatch = z.infer<typeof CodePatchSchema>;

/**
 * Schema for agent personality quips
 */
export const PersonalityQuipSchema = z.object({
  nodeType: z.enum(['diagnostician', 'architect', 'surgeon', 'verifier']).describe('Which agent node this quip belongs to'),
  type: z.enum(['thinking', 'success', 'warning', 'error', 'complete']).describe('Context when this quip is used'),
  text: z.string().describe('The quip text'),
  intensity: z.enum(['low', 'medium', 'high']).describe('Emotional intensity of the quip'),
});

export type PersonalityQuip = z.infer<typeof PersonalityQuipSchema>;

/**
 * Schema for streaming events from the agent
 */
export const StreamEventSchema = z.object({
  type: z.enum(['thought', 'progress', 'result', 'error']).describe('Type of streaming event'),
  node: z.string().describe('Which agent node generated this event'),
  content: z.string().describe('The content of the event'),
  step: z.enum(['diagnose', 'plan', 'fix', 'verify']).describe('Current step in the process'),
  timestamp: z.number().describe('Unix timestamp'),
  metadata: z.record(z.string(), z.unknown()).optional().describe('Additional metadata'),
});

export type StreamEvent = z.infer<typeof StreamEventSchema>;

/**
 * Schema for final agent result
 */
export const AgentResultSchema = z.object({
  success: z.boolean().describe('Whether the repair was successful'),
  originalCode: z.string().describe('Original code that was analyzed'),
  fixedCode: z.string().describe('Final fixed code'),
  explanation: z.string().describe('Explanation of what was fixed and why'),
  confidence: z.number().min(0).max(1).describe('Overall confidence in the fix'),
  diagnostics: z.array(z.object({
    step: z.string(),
    result: z.unknown(),
    duration: z.number(),
  })).describe('Diagnostic information from each step'),
});

export type AgentResult = z.infer<typeof AgentResultSchema>;
