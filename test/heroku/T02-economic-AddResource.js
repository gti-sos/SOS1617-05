describe('Add economicSituation',function(){
    it('should add a economicSituation',function(){
        browser.get('https://sos1617-05.herokuapp.com/#!/economic-situation-stats');
        
        element.all(by.repeater('economicSituation in economicSituationStats'))
        .then(function(initialEconomicSituationStats){
        
        browser.driver.sleep(10000);
        console.log(initialEconomicSituationStats); 
           element(by.model('apikey').sendKeys('cinco'));
           element(by.model('newEconomicSituation.province')).sendKeys('Almería');
           element(by.model('newEconomicSituation.year')).sendKeys('2015');
           element(by.model('newEconomicSituation.gdp')).sendKeys('563.23');
           element(by.model('newEconomicSituation.debt')).sendKeys('865.32');
           
           element(by.buttonText('Add')).click().then(function(){

               element.all(by.repeater('economicSituation in economicSituationStats'))
               .then(function(economicSituationStats){
                   expect(economicSituationStats.length)
                   .toEqual(initialEconomicSituationStats.length+1);
               });
               
               
               
               
               
               
           });
           
            
            
            
            
        });
    });
    
    
    
    
    
    
    
    
    
    
    
});