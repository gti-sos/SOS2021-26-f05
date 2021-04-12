//imports
var express = require("express");
var path = require("path");
const { json } = require("body-parser");

//Attributes
const PORT = (process.env.PORT || 1607);


//Start of the application
var app = express();
app.use(express.json());


//Static navigation
app.use("/", express.static(path.join(__dirname + "/public"))); 


//TODO
/*#################################################    Resource: air_routes    ################################################################*/

//Import API
var airRoutesAPI = require("./airRoutesAPI");

//l05: "./info/air_routes"
airRoutesAPI.info(app);

//loadInitialData
airRoutesAPI.loadInitData(app);

//CRUD: GET , POST, PUT, DELETE
airRoutesAPI.httpCRUD(app);

/*#################################################    Resource: culturaBASE    ################################################################*/

//Import API
var culturaBaseApi = require("./culturaBaseAPI");

//l05: "./info/air_routes"
culturaBaseApi.info(app);

//loadInitialData
culturaBaseApi.loadInitData(app);

//CRUD: GET , POST, PUT, DELETE
culturaBaseApi.httpCRUD(app);

/*#################################################    Resource: hostelries    ################################################################*/


//Import API
var hostelriesAPI = require("./hostelriesAPI");

//l05: "./info/hostelries"
hostelriesAPI.info(app);

//loadInitialData
hostelriesAPI.loadInitData(app);

//CRUD: GET , POST, PUT, DELETE
hostelriesAPI.httpCRUD(app);

















//Server running

app.listen(PORT, () =>{
    console.log("Server running at port:" + PORT);
});