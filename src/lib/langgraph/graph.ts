import { StateGraph } from '@langchain/langgraph';
import { AgentStateSchema } from './state';
import { diagnosticianNode } from './nodes/diagnostician';
import { architectNode } from './nodes/architect';
import { surgeonNode } from './nodes/surgeon';
import { verifierNode } from './nodes/verifier';

/**
 * Create and compile the LangGraph for the Sentinel repair agent
 * Flow: diagnostician → architect → surgeon → verifier
 */
function createGraph() {
  // Create a new StateGraph with our AgentState schema
  const graph = new StateGraph(AgentStateSchema);

  // Add all nodes to the graph
  graph.addNode('diagnostician', diagnosticianNode);
  graph.addNode('architect', architectNode);
  graph.addNode('surgeon', surgeonNode);
  graph.addNode('verifier', verifierNode);

  // Set the entry point (where execution starts)
  (graph as any).setEntryPoint('diagnostician');

  // Define the execution flow: diagnostician → architect → surgeon → verifier
  (graph as any).addEdge('diagnostician', 'architect');
  (graph as any).addEdge('architect', 'surgeon');
  (graph as any).addEdge('surgeon', 'verifier');

  // Set the finish point (where execution ends)
  (graph as any).setFinishPoint('verifier');

  // Compile the graph for execution
  return graph.compile();
}

// Create and export the compiled graph
export const compiledGraph = createGraph();
