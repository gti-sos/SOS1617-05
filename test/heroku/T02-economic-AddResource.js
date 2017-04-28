describe('Add economicSituation',function(){
    it('should add a economicSituation',function(){
        browser.get('http//localhost:8080/');
        
        element.all(by.repeater(economicSituation in economicSituationStats))
        .then(function(initialeconomicSituationStats){
            
            
           element(by.model('economicSituationStats.province')).sendKeys('Almería');
           element(by.model('economicSituationStats.year')).sendKeys('2015');
           element(by.model('economicSituationStats.gdp')).sendKeys('563.23');
           element(by.model('economicSituationStats.debt')).sendKeys('865.32');
           
           element(by.buttonText('Add')).click().then(function(){
               
               element.all(by.repeater('economicSituation in economicSituationStats'))
               .then(function(economicSituationStats){
                   expect(economicSituationStats.length)
                   .toEqual(initialeconomicSituationStats.length+1);
               });
               
               
               
               
               
               
           });
           
            
            
            
            
        });
    });
    
    
    
    
    
    
    
    
    
    
    
})