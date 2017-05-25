/*global angular*/
/*global Plotly*/

angular
    .module("ManagerApp")
    .controller("TubeCtrl", ["$http", "$scope", function($http, $scope) {

        // ep: http://marquisdegeek.com/api/tube/
        //id: containerTube
        //Se puede hacer función auxiliar que devuelva longitud/latitud de determinado punto en un mapa.

        //Elections data: NO MOSTRAR TODOS...CUALES?? (VER GEOCHART)
        $scope.apikey = "cinco";
        $scope.province = [];
        $scope.year = [];
        $scope.pp = [];
        $scope.podemos = [];
        $scope.psoe = [];
        $scope.cs = [];
        $scope.data = {};
        var data = {};

        //London's tube data
        $scope.name = [];
        $scope.latitude = [];
        $scope.longitude = [];
        $scope.dataTube = {};
        var dataTube = {};

        //Aux. Functions:
        var provincesCoords = [{
            'province': 'Almería',
            'latitud': '36,84016',
            'longitud': '-2,467922'
        }, {
            'province': 'Cádiz',
            'latitud': '36,52969',
            'longitud': '-6,292657'
        }, {
            'province': 'Córdoba',
            'latitud': '37,88473',
            'longitud': '-4,779152'
        }, {
            'province': 'Granada',
            'latitud': '37,17649',
            'longitud': '-3,597929'
        }, {
            'province': 'Huelva',
            'latitud': '37,2571',
            'longitud': '-6,949555'
        }, {
            'province': 'Jaén',
            'latitud': '37,76574',
            'longitud': '-3,789518'
        }, {
            'province': 'Málaga',
            'latitud': '36,71965',
            'longitud': '-4,420019'
        }, {
            'province': 'Sevilla',
            'latitud': '37,38264',
            'longitud': '-5,996295'
        }, {
            'province': 'Huesca',
            'latitud': '42,1401',
            'longitud': '-0,408898'
        }, {
            'province': 'Teruel',
            'latitud': '40,34411',
            'longitud': '-1,10691'
        }, {
            'province': 'Zaragoza',
            'latitud': '41,65629',
            'longitud': '-0,8765379'
        }, {
            'province': 'Albacete',
            'latitud': '38,99765',
            'longitud': '-1,86007'
        }, {
            'province': 'Ciudad Real',
            'latitud': '38,9861',
            'longitud': '-3,927263'
        }, {
            'province': 'Cuenca',
            'latitud': '40,07183',
            'longitud': '-2,134005'
        }, {
            'province': 'Guadalajara',
            'latitud': '40,62981',
            'longitud': '-3,166493'
        }, {
            'province': 'Toledo',
            'latitud': '39,85678',
            'longitud': '-4,024476'
        }, {
            'province': 'Ávila',
            'latitud': '40,65642',
            'longitud': '-4,700323'
        }, {
            'province': 'Burgos',
            'latitud': '42,34087',
            'longitud': '-3,699731'
        }, {
            'province': 'León',
            'latitud': '42,59988',
            'longitud': '-5,571752'
        }, {
            'province': 'Palencia',
            'latitud': '42,01246',
            'longitud': '-4,531175'
        }, {
            'province': 'Salamanca',
            'latitud': '40,96497',
            'longitud': '-5,663047'
        }, {
            'province': 'Segovia',
            'latitud': '40,94943',
            'longitud': '-4,119209'
        }, {
            'province': 'Soria',
            'latitud': '41,7636',
            'longitud': '-2,464921'
        }, {
            'province': 'Valladolid',
            'latitud': '41,65295',
            'longitud': '-4,728388'
        }, {
            'province': 'Zamora',
            'latitud': '41,50368',
            'longitud': '-5,743778'
        }, {
            'province': 'Barcelona',
            'latitud': '41,38792',
            'longitud': '2,169919'
        }, {
            'province': 'Girona',
            'latitud': '41,9818',
            'longitud': '2,8237'
        }, {
            'province': 'Lleida',
            'latitud': '41,61415',
            'longitud': '0,6257825'
        }, {
            'province': 'Tarragona',
            'latitud': '41,11866',
            'longitud': '1,24533'
        }, {
            'province': 'Ceuta',
            'latitud': '35,88829',
            'longitud': '-5,316195'
        }, {
            'province': 'Melilla',
            'latitud': '35,29234',
            'longitud': '-2,938794'
        }, {
            'province': 'Badajoz',
            'latitud': '38,8786',
            'longitud': '-6,970284'
        }, {
            'province': 'Cáceres',
            'latitud': '39,47618',
            'longitud': '-6,37076'
        }, {
            'province': 'Lugo',
            'latitud': '43,01208',
            'longitud': '-7,555851'
        }, {
            'province': 'Ourense',
            'latitud': '42,34001',
            'longitud': '-7,864641'
        }, {
            'province': 'Pontevedra',
            'latitud': '42,43362',
            'longitud': '-8,648053'
        }, {
            'province': 'Madrid',
            'latitud': '40,41669',
            'longitud': '-3,700346'
        }, {
            'province': 'Murcia',
            'latitud': '37,98344',
            'longitud': '-1,12989'
        }, {
            'province': 'Valencia',
            'latitud': '39,47024',
            'longitud': '-0,3768049'
        }];

        function lat(province) {
            var res;
            for (var i = 0; i < provincesCoords.length; i++) {
                if (provincesCoords[i].province == province) {
                    res = provincesCoords[i].latitud;
                }
            }
            return res;
        }

        function lon(province) {
            var res;
            for (var i = 0; i < provincesCoords.length; i++) {
                if (provincesCoords[i].province == province) {
                    res = provincesCoords[i].longitud;
                }
            }
            return res;
        }

        //Add code here to import zalando's data:
        $http
            .get("https://marquisdegeek.com/api/tube/")
            .then(function(res) {

                console.log("Getting London's tube data");
                dataTube = res.data;
                $scope.dataTube = dataTube;


                for (var i = 0; i < $scope.dataTube.length; i++) {
                    $scope.name.push($scope.dataTube[i].name);
                    $scope.latitude.push($scope.dataTube[i].latitude);
                    $scope.longitude.push($scope.dataTube[i].longitude);
                    console.log($scope.dataTube[i].name);
                }


                $http
                    .get("/api/v1/elections-voting-stats?apikey=" + $scope.apikey)
                    .then(function(res) {

                        console.log("Getting Elections data");
                        data = res.data;
                        $scope.data = data;



                        for (var i = 0; i < res.data.length; i++) {
                            $scope.province.push($scope.data[i].province);
                            $scope.latitude.push(lat($scope.data[i].province));
                            $scope.longitude.push(lon($scope.data[i].province));
                            $scope.pp.push(Number($scope.data[i].pp));
                            $scope.podemos.push(Number($scope.data[i].podemos));
                            $scope.psoe.push(Number($scope.data[i].psoe));
                            $scope.cs.push(Number($scope.data[i].cs));

                            console.log($scope.data[i].province);
                        }

                        console.log("Controller intialized");


                        var data = [{
                            type: 'scattergeo',
                            mode: 'markers',
                            text: $scope.name.concat($scope.province),
                            lon: $scope.longitude,
                            lat: $scope.latitude,
                            marker: {
                                size: 7,
                                color: [
                                    '#bebada', '#fdb462', '#fb8072', '#d9d9d9', '#bc80bd',
                                    '#b3de69', '#8dd3c7', '#80b1d3', '#fccde5', '#ffffb3'
                                ],
                                line: {
                                    width: 1
                                }
                            },
                            name: 'SOS1617-05 Integrations ©',
                            textposition: [
                                'top right', 'top left', 'top center', 'bottom right', 'top right',
                                'top left', 'bottom right', 'bottom left', 'top right', 'top right'
                            ],
                        }];

                        var layout = {
                            title: 'SOS1617-05 Integrations ©',
                            font: {
                                family: 'Droid Serif, serif',
                                size: 6
                            },
                            titlefont: {
                                size: 16
                            },
                            geo: {
                                /*scope ( enumerated : "world" | "usa" | "europe" | "asia" | "africa" | "north america" | "south america" ) */
                                scope: 'europe',
                                resolution: 50,
                                lonaxis: {
                                    'range': [-130, -55]
                                },
                                lataxis: {
                                    'range': [40, 70]
                                },
                                showrivers: true,
                                rivercolor: '#fff',
                                showlakes: true,
                                lakecolor: '#fff',
                                showland: true,
                                landcolor: '#EAEAAE',
                                countrycolor: '#d3d3d3',
                                countrywidth: 1.5,
                                subunitcolor: '#d3d3d3'
                            }
                        };

                        Plotly.newPlot('containerTube', data, layout);


                    });
            });
    }]);
