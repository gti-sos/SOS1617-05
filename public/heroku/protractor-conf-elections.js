exports.config = {
    seleniumAddress: 'http://localhost:9515',

    specs: ['T02-elections-AddResource.js', 'T01-elections-LoadResources.js', ], //lista de tests a lanzar

    capabilities: {
        'browserName': 'phantomjs'
    }
};