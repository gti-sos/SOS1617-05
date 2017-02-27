var express = require("express");
var port = (process.env.PORT || 16778);

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

var app = express();

//Si lo pongo así, con /time, me muestra lo que debe mostrar SÓLO si escribo /time al final de la url...es correcto así??
app.get("/time",(req,res) => {
    res.send("<html><body><h1>"+hora()+"</h1></body></html>")
});

app.listen(port,(err) => {
    if(!err)
        console.log("Server listening in port" + port);
    else
        console.log("ERROR starting server:" + err)
});