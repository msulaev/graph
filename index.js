const cytoscape = require('cytoscape');
const fs = require('fs');

// Генерация случайного графа (можно заменить на свой способ генерации)
function generateRandomGraph(nodes, edges) {
  const graph = { nodes: [], edges: [] };

  for (let i = 0; i < nodes; i++) {
    graph.nodes.push({ data: { id: i } });
  }

  for (let i = 0; i < edges; i++) {
    const source = Math.floor(Math.random() * nodes);
    let target = Math.floor(Math.random() * nodes);
    while (target === source) {
      target = Math.floor(Math.random() * nodes);
    }
    graph.edges.push({ data: { source, target } });
  }

  return graph;
}

// Основная функция для покраски графа
function colorGraph(graph) {
  // Массив цветов для вершин
  const colors = {};

  // Функция для проверки, можно ли окрасить вершину в данный цвет
  function isColorValid(node, color) {
    const neighbors = graph.edges.filter(edge => edge.data.source === node.data.id || edge.data.target === node.data.id);
    for (const neighbor of neighbors) {
      const neighborNode = neighbor.data.source === node.data.id ? neighbor.data.target : neighbor.data.source;
      if (colors[neighborNode] === color) {
        return false; // Вершина имеет соседа с таким же цветом
      }
    }
    return true; // Цвет вершины допустим
  }

  // Проходим по каждой вершине и раскрашиваем ее
  graph.nodes.forEach(node => {
    // Перебираем возможные цвета
    for (let color = 1; ; color++) {
      if (isColorValid(node, color)) {
        colors[node.data.id] = color; // Окрашиваем вершину в данный цвет
        break;
      }
    }
  });

  // Возвращаем массив цветов для каждой вершины
  return colors;
}

// Функция для создания HTML-страницы с отрисованным графом
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
                                  return 'rgb(' + ${JSON.stringify(colors)}[ele.id()] * 50 + ', 0, 0)';
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

    fs.writeFileSync('graph_with_colors.html', html);
    console.log('Граф с цветами сохранен в файл "graph_with_colors.html"');
}

// Создаем случайный граф
const randomGraph = generateRandomGraph(10, 15);

// Запускаем алгоритм покраски
const colors = colorGraph(randomGraph);

// Отображаем результат покраски
generateGraphHtml(randomGraph, colors);
