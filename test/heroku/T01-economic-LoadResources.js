//Test para cargar datos

describe('Resources is loaded', function(){
    it('should show a bunch of data',function(){//en el it describimos que debe pasar 
       //TO DO--->Tengo que cambiarlo para heroku
        browser.get('https://sos1617-05.herokuapp.com/#!/economic-situation-stats');//El puerto es 8080 ya que estoy lanzando el navegador fantasma sobre lo que está en c9
        //me devuelve toda la lista de reccursos que hay.
        var economicSituationStats = element.all(by.repeater('economicSituation in economicSituationStats'));//genera un array seleccionando todos los elementos de la pagina renderizada(element.all), seleccionando por una directiva (by.repeater) 
        //El tamaño del array debe ser mayor que x:
        expect(economicSituationStats.count()).toBeGreaterThan(2);
        
    });
    
});