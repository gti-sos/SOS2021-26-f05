var initJsonData = require("./initialData");
var culturaBASE_html = require("./l05");

var BASE_CULTURABASE_API_PATH = "/api/v1/culturaBASE";

var r_culturaBASE = [];

module.exports.info = (app) => {

    app.get("/info/culturaBASE", (req,res) => {
        res
        .status(200)
        .send(culturaBASE_html.info_culturaBASE);
        //Llamamos a la información del html desde la variable que invoca el html
    });

};
//Cargamos el loadInitialData antes que cualquier test para que no haya error

module.exports.loadInitData = (app) => {
    app.get(BASE_CULTURABASE_API_PATH + "/loadInitialData", (req,res) => {

    
        r_culturaBASE = initJsonData.JsonInitialData;
        console.log("   -Hemos cargado exitosamente culturaBASE");
        res.status(201).json(r_culturaBASE);
    });

};

//Métodos CRUD con tabla azul

module.exports.httpCRUD = (app) => {

    //Request de CRUD básicas para CULTURABASE
    //GET
    app.get(BASE_CULTURABASE_API_PATH, (req,res) => {
        
        res
        .status(200)
        .send(JSON.stringify(r_culturaBASE,null,2));
    });

    //POST
    app.post(BASE_CULTURABASE_API_PATH, (req,res) => {
        var newResource = req.body;
        console.log(`   Hemos añadido un recurso nuevo <${JSON.stringify(newResource,null,2)}>`);
        r_culturaBASE.push(newResource);

        res.sendStatus(201);
    });
    //PUT
    app.put(BASE_CULTURABASE_API_PATH, (req,res) => {
        
        console.log(`   Usa un put de verdad, pringao `);
        res.sendStatus(405);
    });

    //DELETE
    app.delete(BASE_CULTURABASE_API_PATH,(req,res) => {
        
        r_culturaBASE = [];
        console.log(`  Database deleted`);
        res.sendStatus(200);
    });

    // Request por recurso

    app.get(BASE_CULTURABASE_API_PATH + "/:urlDistrict", (req,res) => {

        var {urlDistrict} = req.params;    // == var urlDistrict = req.params.urlDistrict

        var ls_data = [];

        for (var i = 0 ; i < r_culturaBASE.length; i++){
            if(r_culturaBASE[i].district == urlDistrict){
                
                ls_data.push(cb[i]);
                
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

    app.get(BASE_CULTURABASE_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        var res_data = {}
        var resourceFinded = false;
        

        for (var i = 0 ; i < cb.length; i++){
            if(r_culturaBASE[i].district == urlDistrict && cb[i].year == urlYear){
                
                res_data = r_culturaBASE[i];
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


    app.post(BASE_CULTURABASE_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {
        console.log(`Error: Usa un post en condiciones chaval `);
        res.sendStatus(405);
    });

    app.delete(BASE_CULTURABASE_API_PATH + "/:urlDistrict", (req,res) => {
        var {urlDistrict} = req.params;

        const deleted = r_culturaBASE.find(resource => resource.district == urlDistrict );

        if(deleted){
            r_culturaBASE = r_culturaBASE.filter(resource => resource.district != urlDistrict);
            res.status(200).json({ message: `The resource with district : <${urlDistrict}> was deleted`})
        }else{
            res.status(404).json({ message: "District you are looking for does not exist "})
        }
    });


    app.delete(BASE_CULTURABASE_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        const deleted = r_culturaBASE.find(resource => (resource.district == urlDistrict)&&(resource.year == urlYear));

        if(deleted){
            r_culturaBASE = r_culturaBASE.filter(resource => (resource.district != urlDistrict)||(resource.district == urlDistrict && resource.year != urlYear));
            res.status(200).json({ message: `The resources with district : <${urlDistrict}> and year: <${urlYear}> were deleted`})
        }else{
            res.status(404).json({ message: "The resource you are looking for does not exist "})
        }
    });

    app.put(BASE_CULTURABASE_API_PATH+ "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;
        var {urlYear} = req.params;
        
        const index = r_culturaBASE.findIndex(resource => (resource.district == urlDistrict)&&(resource.year == urlYear));

        if(index == -1){
            res.status(404).json({ message: "The resource you are looking for does not exist "});
        }else{
            cb[index]= req.body;
            res.status(200).json(cb[index]);
        }
    });

};