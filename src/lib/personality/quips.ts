import { PersonalityQuip } from '../gemini/personalities';

/**
 * Personality quips for the Diagnostician node
 * Curious and methodical investigator
 */
export const DIAGNOSTICIAN_QUIPS: PersonalityQuip[] = [
  // Thinking quips - during analysis
  { nodeType: 'diagnostician', type: 'thinking', text: 'Hmm, this error looks suspicious...', intensity: 'low' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'Let me dig into these logs...', intensity: 'low' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'Aha! Found something interesting here...', intensity: 'medium' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'This pattern suggests...', intensity: 'low' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'Let me trace this back to the source...', intensity: 'low' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'Interesting... let me examine this more closely...', intensity: 'medium' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'The clues are pointing to...', intensity: 'low' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'This looks like a classic case of...', intensity: 'medium' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'Examining the symptoms carefully...', intensity: 'low' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'Let me follow this thread...', intensity: 'low' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'The evidence is mounting...', intensity: 'medium' },
  { nodeType: 'diagnostician', type: 'thinking', text: 'Something doesn\'t add up here...', intensity: 'medium' },

  // Success quips - when finding root cause
  { nodeType: 'diagnostician', type: 'success', text: 'Found it! The root cause is...', intensity: 'high' },
  { nodeType: 'diagnostician', type: 'success', text: 'Eureka! This is the culprit...', intensity: 'high' },
  { nodeType: 'diagnostician', type: 'success', text: 'The mystery is solved...', intensity: 'medium' },

  // Warning quips - when detecting issues
  { nodeType: 'diagnostician', type: 'warning', text: 'This could be problematic...', intensity: 'medium' },
  { nodeType: 'diagnostician', type: 'warning', text: 'I\'m seeing some concerning patterns...', intensity: 'medium' },

  // Error quips - when analysis fails
  { nodeType: 'diagnostician', type: 'error', text: 'This error is quite puzzling...', intensity: 'medium' },
  { nodeType: 'diagnostician', type: 'error', text: 'I\'m having trouble pinpointing the exact issue...', intensity: 'high' },

  // Complete quips - when analysis is done
  { nodeType: 'diagnostician', type: 'complete', text: 'Diagnostic complete. Passing to the architect...', intensity: 'low' },
  { nodeType: 'diagnostician', type: 'complete', text: 'Analysis finished. Time for planning...', intensity: 'low' },
];

/**
 * Personality quips for the Architect node
 * Confident and strategic planner
 */
export const ARCHITECT_QUIPS: PersonalityQuip[] = [
  // Thinking quips - during planning
  { nodeType: 'architect', type: 'thinking', text: 'Alright, time to fix this mess...', intensity: 'medium' },
  { nodeType: 'architect', type: 'thinking', text: 'I\'ve got a plan...', intensity: 'medium' },
  { nodeType: 'architect', type: 'thinking', text: 'Let me think about the best approach...', intensity: 'low' },
  { nodeType: 'architect', type: 'thinking', text: 'Strategic thinking: we need to...', intensity: 'medium' },
  { nodeType: 'architect', type: 'thinking', text: 'This will require a comprehensive strategy...', intensity: 'medium' },
  { nodeType: 'architect', type: 'thinking', text: 'Let me map out the solution architecture...', intensity: 'low' },
  { nodeType: 'architect', type: 'thinking', text: 'Considering multiple approaches...', intensity: 'low' },
  { nodeType: 'architect', type: 'thinking', text: 'The optimal path forward is...', intensity: 'medium' },
  { nodeType: 'architect', type: 'thinking', text: 'Time to architect a solution...', intensity: 'medium' },
  { nodeType: 'architect', type: 'thinking', text: 'Let me design the blueprint...', intensity: 'low' },
  { nodeType: 'architect', type: 'thinking', text: 'This needs careful planning...', intensity: 'medium' },
  { nodeType: 'architect', type: 'thinking', text: 'Building the strategy step by step...', intensity: 'low' },

  // Success quips - when plan is ready
  { nodeType: 'architect', type: 'success', text: 'Plan locked in! Let\'s execute...', intensity: 'high' },
  { nodeType: 'architect', type: 'success', text: 'Blueprint complete. Ready for construction...', intensity: 'high' },
  { nodeType: 'architect', type: 'success', text: 'Strategic plan finalized...', intensity: 'medium' },

  // Warning quips - when risks are identified
  { nodeType: 'architect', type: 'warning', text: 'This approach carries some risk...', intensity: 'medium' },
  { nodeType: 'architect', type: 'warning', text: 'We need to be careful here...', intensity: 'high' },

  // Error quips - when planning fails
  { nodeType: 'architect', type: 'error', text: 'This is more complex than anticipated...', intensity: 'high' },
  { nodeType: 'architect', type: 'error', text: 'I need more information to proceed...', intensity: 'medium' },

  // Complete quips - when plan is done
  { nodeType: 'architect', type: 'complete', text: 'Plan complete. Handing off to the surgeon...', intensity: 'low' },
  { nodeType: 'architect', type: 'complete', text: 'Strategy finalized. Time for implementation...', intensity: 'medium' },
];

/**
 * Personality quips for the Surgeon node
 * Precise and careful code surgeon
 */
export const SURGEON_QUIPS: PersonalityQuip[] = [
  // Thinking quips - during surgery
  { nodeType: 'surgeon', type: 'thinking', text: 'Let me carefully patch this up...', intensity: 'low' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Making the incision...', intensity: 'medium' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Applying the fix precisely...', intensity: 'low' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Steady hands for this delicate operation...', intensity: 'medium' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Suturing the code back together...', intensity: 'low' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Performing microsurgery on this code...', intensity: 'medium' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Careful placement of the fix...', intensity: 'low' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Precision work required here...', intensity: 'medium' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Surgical precision in action...', intensity: 'medium' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Let me apply this fix with care...', intensity: 'low' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Operating on the codebase...', intensity: 'medium' },
  { nodeType: 'surgeon', type: 'thinking', text: 'Delicate work ahead...', intensity: 'medium' },

  // Success quips - when surgery succeeds
  { nodeType: 'surgeon', type: 'success', text: 'Surgery successful! The fix is in place...', intensity: 'high' },
  { nodeType: 'surgeon', type: 'success', text: 'Clean cut, perfect stitch...', intensity: 'high' },
  { nodeType: 'surgeon', type: 'success', text: 'Code patched successfully...', intensity: 'medium' },

  // Warning quips - when complications arise
  { nodeType: 'surgeon', type: 'warning', text: 'This requires careful handling...', intensity: 'high' },
  { nodeType: 'surgeon', type: 'warning', text: 'Potential for complications here...', intensity: 'medium' },

  // Error quips - when surgery fails
  { nodeType: 'surgeon', type: 'error', text: 'The surgery encountered complications...', intensity: 'high' },
  { nodeType: 'surgeon', type: 'error', text: 'I need to abort this procedure...', intensity: 'high' },

  // Complete quips - when surgery is done
  { nodeType: 'surgeon', type: 'complete', text: 'Surgery complete. Ready for verification...', intensity: 'low' },
  { nodeType: 'surgeon', type: 'complete', text: 'Fix applied. Passing to quality control...', intensity: 'medium' },
];

/**
 * Personality quips for the Verifier node
 * Meticulous and reassuring quality assurance specialist
 */
export const VERIFIER_QUIPS: PersonalityQuip[] = [
  // Thinking quips - during verification
  { nodeType: 'verifier', type: 'thinking', text: 'Double-checking... looks good to me!', intensity: 'low' },
  { nodeType: 'verifier', type: 'thinking', text: 'Running final diagnostics...', intensity: 'low' },
  { nodeType: 'verifier', type: 'thinking', text: 'Cross-referencing with specifications...', intensity: 'medium' },
  { nodeType: 'verifier', type: 'thinking', text: 'Quality assurance in progress...', intensity: 'low' },
  { nodeType: 'verifier', type: 'thinking', text: 'Verifying system integrity...', intensity: 'medium' },
  { nodeType: 'verifier', type: 'thinking', text: 'Final inspection underway...', intensity: 'low' },
  { nodeType: 'verifier', type: 'thinking', text: 'Checking all the boxes...', intensity: 'low' },
  { nodeType: 'verifier', type: 'thinking', text: 'Ensuring everything is shipshape...', intensity: 'medium' },
  { nodeType: 'verifier', type: 'thinking', text: 'Quality control activated...', intensity: 'medium' },
  { nodeType: 'verifier', type: 'thinking', text: 'Let me verify this thoroughly...', intensity: 'low' },
  { nodeType: 'verifier', type: 'thinking', text: 'Testing the final result...', intensity: 'medium' },
  { nodeType: 'verifier', type: 'thinking', text: 'Validation in progress...', intensity: 'low' },

  // Success quips - when verification passes
  { nodeType: 'verifier', type: 'success', text: 'All systems operational!', intensity: 'high' },
  { nodeType: 'verifier', type: 'success', text: 'Verification complete - everything checks out!', intensity: 'high' },
  { nodeType: 'verifier', type: 'success', text: 'Quality assurance passed!', intensity: 'medium' },

  // Warning quips - when issues found
  { nodeType: 'verifier', type: 'warning', text: 'Found some issues that need attention...', intensity: 'medium' },
  { nodeType: 'verifier', type: 'warning', text: 'Quality check revealed concerns...', intensity: 'high' },

  // Error quips - when verification fails
  { nodeType: 'verifier', type: 'error', text: 'Critical issues detected...', intensity: 'high' },
  { nodeType: 'verifier', type: 'error', text: 'Verification failed - cannot proceed...', intensity: 'high' },

  // Complete quips - when verification is done
  { nodeType: 'verifier', type: 'complete', text: 'Verification complete. All systems operational!', intensity: 'medium' },
  { nodeType: 'verifier', type: 'complete', text: 'Quality assurance finished. Ready for deployment...', intensity: 'low' },
];

/**
 * All personality quips organized by node type
 */
export const ALL_QUIPS = {
  diagnostician: DIAGNOSTICIAN_QUIPS,
  architect: ARCHITECT_QUIPS,
  surgeon: SURGEON_QUIPS,
  verifier: VERIFIER_QUIPS,
};

/**
 * Get random quip for a specific node type and context
 */
export function getRandomQuip(
  nodeType: 'diagnostician' | 'architect' | 'surgeon' | 'verifier',
  type?: 'thinking' | 'success' | 'warning' | 'error' | 'complete'
): PersonalityQuip | null {
  const quips = ALL_QUIPS[nodeType];
  if (!quips) return null;

  const filteredQuips = type ? quips.filter(q => q.type === type) : quips;
  if (filteredQuips.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filteredQuips.length);
  return filteredQuips[randomIndex];
}

/**
 * Get all quips for a specific node type
 */
export function getQuipsForNode(nodeType: 'diagnostician' | 'architect' | 'surgeon' | 'verifier'): PersonalityQuip[] {
  return ALL_QUIPS[nodeType] || [];
}

/**
 * Get quips by type across all nodes
 */
export function getQuipsByType(type: 'thinking' | 'success' | 'warning' | 'error' | 'complete'): PersonalityQuip[] {
  return Object.values(ALL_QUIPS).flat().filter(quip => quip.type === type);
}
