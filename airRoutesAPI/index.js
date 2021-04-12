var initJsonData = require('./initialData');
var info_htlm = require('./l05');

var BASE_AIR_ROUTES_API_PATH = "/api/v1/air_routes";

var air_routes_aux = [];

//Exportando los datos del array en html
module.exports.info = (app) => {

    app.get("/info/air_routes", (req,res) => {
        res
        .status(200)
        .send(info_htlm.info_air_routes);
    });

};
//LoadInitData del get. Va primero antes que todo para que se cargue antes
module.exports.loadInitData = (app) => {
    app.get(BASE_AIR_ROUTES_API_PATH + "/loadInitialData", (req,res) => {

    
        air_routes_aux = initJsonData.JsonInitialData;
        console.log("   -airRoutes API: Initial air_routes data loaded!");
        res.status(201).json(air_routes_aux);
    });

};

//Export de todo el CRUD de la tabla azul (con los codigos de estado)
module.exports.httpCRUD = (app) => {

    //####################################################    Requests of ../air_routes
    //GET
    app.get(BASE_AIR_ROUTES_API_PATH, (req,res) => {
        
        res
        .status(200)
        .send(JSON.stringify(air_routes_aux,null,2));
    });

    //POST
    app.post(BASE_AIR_ROUTES_API_PATH, (req,res) => {
        
        var newResource = req.body;
        console.log(`   -airRoutes API: New resource added <${JSON.stringify(newResource,null,2)}>`);
        console.log(`   -airRoutes API: New resource added <${JSON.stringify(initJsonData.JsonInitialData)}>`);
        air_routes_aux.push(newResource);
        console.log(`   -airRoutes API: New resource added <${JSON.stringify(initJsonData.JsonInitialData)}>`);

        res.sendStatus(201);
    });
    //PUT
    app.put(BASE_AIR_ROUTES_API_PATH, (req,res) => {
        
        console.log(`   -airRoutes API: Error -> Use put method at collector object `);
        res.sendStatus(405);
    });

    //DELETE
    app.delete(BASE_AIR_ROUTES_API_PATH,(req,res) => {
        
        air_routes_aux = [];
        console.log(`   -airRoutes API: air_routes data deleted`);
        res.sendStatus(200);
    });

    //####################################################################   Request per each resource

    app.get(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict", (req,res) => {

        var {urlDistrict} = req.params;    // == var urlDistrict = req.params.urlDistrict

        var ls_data = [];

        for (var i = 0 ; i < air_routes_aux.length; i++){
            if(air_routes_aux[i].district == urlDistrict){
                
                ls_data.push(air_routes_aux[i]);
                
            }
        };

        if(ls_data.length == 0){
            res
            .status(404)
            .send('The resource doesn´t exist.')
        }else{
            
            res.status(200).send(JSON.stringify(ls_data,null,2));
        }
    
    });

    app.get(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        var res_data = {}
        var resourceFinded = false;
        

        for (var i = 0 ; i < air_routes_aux.length; i++){
            if(air_routes_aux[i].district == urlDistrict && air_routes_aux[i].year == urlYear){
                
                res_data = air_routes_aux[i];
                resourceFinded = true;
                
            }
        };

        if(!resourceFinded){
            res
            .status(404)
            .send('The resource doesn´t exist.')
        }else{
            res
            .status(200)
            .send(JSON.stringify(res_data,null,2));
        }
    });


    app.post(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {
        console.log(`   -airRoutes API: Error: Use post method at element of collector `);
        res.sendStatus(405);
    });

    app.delete(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict", (req,res) => {
        var {urlDistrict} = req.params;

        const deleted = air_routes_aux.find(resource => resource.district == urlDistrict );

        if(deleted){
            air_routes_aux = air_routes_aux.filter(resource => resource.district != urlDistrict);
            res.status(200).json({ message: `The resource with district : <${urlDistrict}> was deleted`})
        }else{
            res.status(404).json({ message: "District you are looking for does not exist "})
        }   

      /*   var urlDistrict = req.params.urlDistrict;
    console.log(`contact to be deleted: <${urlDistrict}>`);

    air_routes_aux = air_routes_aux.filter( (c) =>{
        return (c.district != urlDistrict);
    });
    res.sendStatus(200); */
    }); 


     app.delete(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        const deleted = air_routes_aux.find(resource => (resource.district == urlDistrict)&&(resource.year == urlYear));

        if(deleted){
            air_routes_aux = air_routes_aux.filter(resource => (resource.district != urlDistrict)||(resource.district == urlDistrict && resource.year != urlYear));
            res.status(200).json({ message: `The resources with district : <${urlDistrict}> and year: <${urlYear}> were deleted`})
        }else{
            res.status(404).json({ message: "The resource you are looking for does not exist "})
        }
    }); 

    app.put(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;
        var {urlYear} = req.params;
        
        const index = air_routes_aux.findIndex(resource => (resource.district == urlDistrict)&&(resource.year == urlYear));

        if(index == -1){
            res.status(404).json({ message: "The resource you are looking for does not exist "});
        }else{
            air_routes_aux[index]= req.body;
            res.status(200).json(air_routes_aux[index]);
        }
    });

};



