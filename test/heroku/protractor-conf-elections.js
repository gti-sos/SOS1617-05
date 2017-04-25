exports.config = {
    
    seleniumAdress: 'http://localhost:9515',//donde tenemos el driver
    
    specs: ['T01-elections-LoadResources.js','T02-elections-AddResource.js'],//lista de tests a lanzar
    
    capabilities: {
        'browserName': 'phantomjs' //tipo de navegador que estoy lanzando
    }
};