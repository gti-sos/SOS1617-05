exports.config = {
    
    seleniumAdress: 'http://localhost:9515/',//donde tenemos el driver
    
    specs: ['T01-economic-LoadResources.js','T02-economic-AddResource.js'],//lista de tests a lanzar
    
    capabilities: {
        'browserName': 'phantomjs' //tipo de navegador que estoy lanzando
    }
};