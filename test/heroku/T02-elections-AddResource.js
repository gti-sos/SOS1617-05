describe('Add votingResults',function(){
    it('should add a votingResults',function(){
        browser.get('https://sos1617-05.herokuapp.com/api/v1/frontendNacho/#!/');
        
        element.all(by.repeater(votingResults in electionsVotingStats))
        .then(function(initialelectionsVotingStats){
            
            
           element(by.model('electionsVotingStats.province')).sendKeys('Almería');
           element(by.model('electionsVotingStats.year')).sendKeys('2015');
           element(by.model('electionsVotingStats.gdp')).sendKeys('563.23');
           element(by.model('electionsVotingStats.debt')).sendKeys('865.32');
           
           element(by.buttonText('Add')).click().then(function(){
               
               element.all(by.repeater('votingResults in electionsVotingStats'))
               .then(function(electionsVotingStats){
                   expect(electionsVotingStats.length)
                   .toEqual(initialelectionsVotingStats.length+1);
               });
               
               
               
               
               
               
           });
           
            
            
            
            
        });
    });
    
    
    
    
    
    
    
    
    
    
    
})