describe('Add voting results', function() {
    it('should add a votingResults', function() {

        //EL PROBLEMA ESTÁ EN QUE AL ACCEDER A ESTA RUTA NO SE MUESTRA NINGÚN RECURSO!! PONER QUE CADA VEZ QUE SE ACCEDA APAREZCAN RESURSOS
        browser.get('https://sos1617-05.herokuapp.com/#!/elections-voting-stats');

        element.all(by.repeater('result in results'))
            .then(function(initialelectionsVotingStats) {
                browser.driver.sleep(10000);
                console.log(initialelectionsVotingStats); //TANTO ESTE COMO EL DEL ÚLTIMO CALL BACK SON ARRAYS VACÍOS
                element(by.model('newResult.province')).sendKeys('Sevillaaaa');
                element(by.model('newResult.year')).sendKeys('2015');
                element(by.model('newResult.pp')).sendKeys('2');
                element(by.model('newResult.podemos')).sendKeys('2');
                element(by.model('newResult.psoe')).sendKeys('2');
                element(by.model('newResult.cs')).sendKeys('2');

                element(by.buttonText('Add')).click().then(function() {
                    //Cómo hacer para que presione la tecla de enter por sí mismo?
                    //phantomjs.actions().sendKeys(protractor.Key.ENTER).perform();
                    console.log("CLICK SOBRE BOTÓN Add OKAY!");
                    element.all(by.repeater('result in results'))
                        .then(function(electionsVotingStats) {
                            expect(electionsVotingStats.length)
                                .toEqual(initialelectionsVotingStats.length + 1);
                        });
                });
            });
    });

});