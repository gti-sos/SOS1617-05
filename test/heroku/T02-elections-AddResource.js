describe('Add votingResults', function() {
    it('should add a votingResults', function() {
        browser.get('http://localhost:8080/#!/elections-voting-stats');

        element.all(by.repeater(votingResults in electionsVotingStats))
            .then(function(initialelectionsVotingStats) {


                element(by.model('electionsVotingStats.province')).sendKeys('Sevillaa');
                element(by.model('electionsVotingStats.year')).sendKeys('2015');
                element(by.model('electionsVotingStats.pp')).sendKeys('2');
                element(by.model('electionsVotingStats.podemos')).sendKeys('2');
                element(by.model('electionsVotingStats.psoe')).sendKeys('2');
                element(by.model('electionsVotingStats.cs')).sendKeys('2');

                element(by.buttonText('Add')).click().then(function() {

                    element.all(by.repeater('votingResults in electionsVotingStats'))
                        .then(function(electionsVotingStats) {
                            expect(electionsVotingStats.length)
                                .toEqual(initialelectionsVotingStats.length + 1);
                        });






                });





            });
    });











})