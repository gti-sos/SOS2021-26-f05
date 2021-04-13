var info_htlm = require('./l05');

var BASE_HOSTELRIES_API_PATH = "/api/v1/hostelries";

var r_hostelries = [];

module.exports.info = (app) => {

    app.get("/info/hostelries", (req,res) => {
        res
        .status(200)
        .send(info_htlm.info_hostelries);
    });

};

//LoadInitData gets priority: has to be before than "./hostelries/:param"
module.exports.loadInitData = (app) => {
    app.get(BASE_HOSTELRIES_API_PATH + "/loadInitialData", (req,res) => {

        const initJsonData = require('./initialData');
        r_hostelries = Object.assign([],initJsonData);
        console.log("   - HostelriesAPI: Initial hostelries data loaded!");
        //console.log(r_hostelries);
        res.status(201).json(r_hostelries);
    });

};

module.exports.httpCRUD = (app) => {

    //####################################################    Requests of ../hostelries
    //GET
    app.get(BASE_HOSTELRIES_API_PATH, (req,res) => {
        //console.log(r_hostelries);
        res
        .status(200)
        .send(JSON.stringify(r_hostelries,null,2));
    });

    //POST
    app.post(BASE_HOSTELRIES_API_PATH, (req,res) => {
        var newResource = req.body;
        var reqDistrict = req.body.district;
        var reqYear = req.body.year;

        //console.log(reqDistrict+"-"+reqYear);

        const r_exists = r_hostelries.find(resource => (resource.district == reqDistrict) && (resource.year == reqYear));
        
        if(r_exists){
            console.log(`   -Hostelries API: Conflict->The resource exists:\n <${JSON.stringify(req.body,null,2)}>`);
            res
            .status(409)
            .json({message: `The resource to add exists.`})

        }else{
            
            r_hostelries.push(newResource);
            console.log(`   -Hostelries API: New resource added <${JSON.stringify(newResource,null,2)}>`);            

            //Using Splice
            
            //var r_host_tam = r_hostelries.length;
            //console.log(JSON.stringify(initJsonData.JsonInitialData));
            //r_hostelries.splice(r_host_tam,0,newResource);
            //console.log(JSON.stringify(initJsonData.JsonInitialData));
            

            res.status(201).json(req.body);
        } 
        /*
        r_hostelries.push(newResource);
        console.log(`   -Hostelries API: New resource added <${JSON.stringify(newResource,null,2)}>`);
        res.status(201).json(req.body);
        */
    });
    //PUT
    app.put(BASE_HOSTELRIES_API_PATH, (req,res) => {
        
        console.log(`   -Hostelries API: Error -> Use put method at collector object `);
        res.sendStatus(405);
    });

    //DELETE
    app.delete(BASE_HOSTELRIES_API_PATH,(req,res) => {
        //res.send("DELETE Request Called");
        r_hostelries = [];
        console.log(`   -Hostelries API: hostelries data deleted`);
        res.sendStatus(200);
    });

    //####################################################################   Request per each resource

    app.get(BASE_HOSTELRIES_API_PATH + "/:urlDistrict", (req,res) => {

        var {urlDistrict} = req.params;    // == var urlDistrict = req.params.urlDistrict

        var ls_data = [];

        for (var i = 0 ; i < r_hostelries.length; i++){
            if(r_hostelries[i].district == urlDistrict){
                
                ls_data.push(r_hostelries[i]);
                //console.log(res_data);
            }
        };

        if(ls_data.length == 0){
            res
            .status(404)
            .send('The resource doesn´t exist.')
        }else{
            //res.send(JSON.stringify(ls_data,null,2));
            //Send http status and json object
            res.status(200).send(JSON.stringify(ls_data,null,2));
        }
    
    });

    app.get(BASE_HOSTELRIES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        var res_data = {}
        var resourceFinded = false;
        //console.log(req.params);

        for (var i = 0 ; i < r_hostelries.length; i++){
            if(r_hostelries[i].district == urlDistrict && r_hostelries[i].year == urlYear){
                
                res_data = r_hostelries[i];
                resourceFinded = true;
                //console.log(res_data);
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


    app.post(BASE_HOSTELRIES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {
        console.log(`Error: Use post method at element of collector `);
        res.sendStatus(405);
    });

    app.delete(BASE_HOSTELRIES_API_PATH + "/:urlDistrict", (req,res) => {
        var {urlDistrict} = req.params;

        const deleted = r_hostelries.find(resource => resource.district == urlDistrict );

        if(deleted){
            r_hostelries = r_hostelries.filter(resource => resource.district != urlDistrict);
            res.status(200).json({ message: `The resource with district : <${urlDistrict}> was deleted`})
        }else{
            res.status(404).json({ message: "District you are looking for does not exist "})
        }
    });


    app.delete(BASE_HOSTELRIES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        const deleted = r_hostelries.find(resource => (resource.district == urlDistrict)&&(resource.year == urlYear));

        if(deleted){
            r_hostelries = r_hostelries.filter(resource => (resource.district != urlDistrict)||(resource.district == urlDistrict && resource.year != urlYear));
            res.status(200).json({ message: `The resources with district : <${urlDistrict}> and year: <${urlYear}> were deleted`})
        }else{
            res.status(404).json({ message: "The resource you are looking for does not exist "})
        }
    });

    //Usar formato json al usar POSTMAN !!!!!!!!!!
    app.put(BASE_HOSTELRIES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;
        var {urlYear} = req.params;
        //var updatedResource = req.body;
        const index = r_hostelries.findIndex(resource => (resource.district == urlDistrict)&&(resource.year == urlYear));
        //console.log(index);

        if(index == -1){
            res.status(404).json({ message: "The resource you are looking for does not exist "});
        }else{
            r_hostelries[index]= req.body;
            res.status(200).json(r_hostelries[index]);
        }
    });

};



