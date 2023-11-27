const cytoscape = require('cytoscape');
const fs = require('fs');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateRandomGraph(nodes, edges) {
  const graph = { nodes: [], edges: [] };

  for (let i = 0; i < nodes; i++) {
    graph.nodes.push({ data: { id: i } });
  }

  for (let i = 0; i < edges; i++) {
    const source = getRandomInt(nodes);
    let target = getRandomInt(nodes);

    while (target === source) {
      target = getRandomInt(nodes);
    }

    graph.edges.push({ data: { source, target } });
  }

  return graph;
}

function isColorValid(node, color, colors) {
  const neighbors = colors.edges.filter(edge =>
    edge.data.source === node.data.id || edge.data.target === node.data.id
  );

  for (const neighbor of neighbors) {
    const neighborNode =
      neighbor.data.source === node.data.id ? neighbor.data.target : neighbor.data.source;

    if (colors.nodes[neighborNode] === color) {
      return false;
    }
  }

  return true;
}

function colorGraph(graph) {
  const colors = { nodes: {}, edges: [] };

  graph.nodes.forEach(node => {
    for (let color = 1; ; color++) {
      if (isColorValid(node, color, colors)) {
        colors.nodes[node.data.id] = color;
        break;
      }
    }
  });

  return colors;
}

function generateGraphHtml(graph, colors) {
  const html = `
    <html>
    <head>
        <script src="https://unpkg.com/cytoscape/dist/cytoscape.min.js"></script>
        <style>
            #cy {
                width: 500px;
                height: 300px;
                position: absolute;
            }
        </style>
    </head>
    <body>
        <div id="cy"></div>
        <script>
            document.addEventListener('DOMContentLoaded', function(){
                var cy = cytoscape({
                    container: document.getElementById('cy'),
                    elements: ${JSON.stringify(graph)},
                    style: [
                        {
                            selector: 'node',
                            style: {
                                'background-color': function(ele) {
                                  return 'rgb(' + ${JSON.stringify(colors.nodes)}[ele.id()] * 50 + ', 0, 0)';
                                },
                                'label': 'data(id)'
                            }
                        },
                        {
                            selector: 'edge',
                            style: {
                                'line-color': 'black'
                            }
                        }
                    ]
                });
            });
        </script>
    </body>
    </html>
    `;

  try {
    fs.writeFileSync('.graph_with_colors.html', html);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { generateRandomGraph, colorGraph, generateGraphHtml };
