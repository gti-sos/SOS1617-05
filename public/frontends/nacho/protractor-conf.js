exports.config = {
    
    seleniumAdress: 'https://sos1617-05.herokuapp.com/api/v1/frontendNacho/#!/',//donde tenemos el driver
    
    specs: ['T01-LoadResources','T02-AddResource'],//lista de tests a lanzar
    
    capabilities: {
        'browserName': 'phantomjs' //tipo de navegador que estoy lanzando
    }
};