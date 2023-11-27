const { generateRandomGraph, colorGraph, generateGraphHtml } = require('./graph.js');


const randomGraph = generateRandomGraph(10, 15);

const colors = colorGraph(randomGraph);

generateGraphHtml(randomGraph, colors);
