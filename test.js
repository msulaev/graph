const { expect } = require('chai');
const { generateRandomGraph, colorGraph } = require('./index.js');

describe('Graph Coloring Algorithm', () => {
  describe('generateRandomGraph', () => {
    it('should generate a graph with the specified number of nodes and edges', () => {
      const nodes = 10;
      const edges = 15;
      const graph = generateRandomGraph(nodes, edges);

      expect(graph.nodes).to.have.lengthOf(nodes);
      expect(graph.edges).to.have.lengthOf(edges);
    });
  });

  describe('colorGraph', () => {
    it('should color the graph without conflicts', () => {
      const graph = {
        nodes: [
          { data: { id: 0 } },
          { data: { id: 1 } },
          { data: { id: 2 } },
        ],
        edges: [
          { data: { source: 0, target: 1 } },
          { data: { source: 1, target: 2 } },
        ],
      };
  
      const colors = colorGraph(graph);
  
      const expectedColors = new Set([1, 2, 3]);
      for (const nodeId in colors) {
        expect(expectedColors).to.include(colors[nodeId]);
      }
    });
  
    it('should handle an empty graph', () => {
      const emptyGraph = { nodes: [], edges: [] };
  
      const colors = colorGraph(emptyGraph);
  
      expect(colors).to.eql({});
    });
  
    it('should handle a graph with a single node', () => {
      const singleNodeGraph = { nodes: [{ data: { id: 0 } }], edges: [] };
  
      const colors = colorGraph(singleNodeGraph);
  
      expect(Object.values(colors)).to.have.lengthOf(1);
    });
  
    it('should handle a disconnected graph', () => {
      const disconnectedGraph = {
        nodes: [
          { data: { id: 0 } },
          { data: { id: 1 } },
          { data: { id: 2 } },
        ],
        edges: [],
      };
  
      const colors = colorGraph(disconnectedGraph);
  
      expect(Object.values(colors)).to.have.lengthOf(3);
      expect(new Set(Object.values(colors))).to.have.lengthOf(3);
    });
  });
});