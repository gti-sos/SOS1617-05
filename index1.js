var express = require("express");

//Para aislarte del SO, paquete path (así no importa la inclinación de la barra al indicar directorio):
var path = require("path");

//Crear aplicación a partir del módulo cargado (express):
var app = express();

var port = (process.env.PORT || 16778);

app.use("/",express.static(path.join(__dirname,"public"))); //Al acceder al recurso / se "busca" en la carpeta public, carpeta especificada...

function hora(){
    // “1st March of 2017 , 08:35:00”
    var f=new Date();
    var hora=f.getHours()+1+":"+f.getMinutes()+":"+f.getSeconds(); 
    var fecha=f.getDate()+"st "+month(f)+" of "+f.getFullYear(); 
    return fecha+" , "+hora;
}

function month(f){
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return month[f.getMonth()];
}



//Si lo pongo así, con /time, me muestra lo que debe mostrar SÓLO si escribo /time al final de la url...es correcto así??
app.get("/time",(req,res) => {
    res.send("<html><body><h1>"+hora()+"</h1></body></html>")
});

app.listen(port,() => {
    console.log("Server listening in port" + port);
}).on("error",(e)=>{
    console.log("ERROR starting server:" + e);
    process.exit(1);
});