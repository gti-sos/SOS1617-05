exports.config = {
    
    seleniumAdress: 'http://localhost:9515',//donde tenemos el driver
    
    specs: ['T01-LoadResources','T02-AddResource'],//lista de tests a lanzar
    
    capabilities: {
        'browserName': 'phantomjs' //tipo de navegador que estoy lanzando
    }
};

