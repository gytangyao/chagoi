const edge = require('electron-edge-js');
var helloWorld = edge.func(`
    async (input) => { 
        return ".NET Welcomes " + input.ToString(); 
    }
`);

export { helloWorld };