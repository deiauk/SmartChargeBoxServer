/**
 * Created by Aurimas on 17/11/16.
 */
import { Meteor } from 'meteor/meteor';
import { Collections } from '../modules/database';
import { ErrorMessages } from '../modules/Error';
import { Functions } from './apiFunctions';
import './methods';

let Api;

Meteor.startup(() => {
    Collections.Location._ensureIndex({_id: 1}, {background: true, unique: true});
    //Collections.Reservation._ensureIndex({ "expiresAt": 1 }, { expireAfterSeconds: 15 });
    // code to run on server at startup
});

if(Meteor.isServer) {
    // Global API configuration
    Api = new Restivus({
        prettyJson: true
    });

    Meteor.onConnection(function (connection) {
        console.log(connection.id + ", " + connection.clientAddress + ", " + this.userId);
    });



    //Make false if want to lock new values entering to database
    let enterValuesMode = true;

    if (enterValuesMode) {
        Api.addCollection(Collections.OcppTag);
        Api.addCollection(Collections.Location);
        Api.addCollection(Collections.Transaction);
        Api.addCollection(Collections.Station);
        Api.addCollection(Collections.Reservation);

        Collections.stationsMini = new Mongo.Collection('stationMini');
        createStations(Collections.stationsMini);

        Collections.userLocations = new Mongo.Collection('userLocations')
        Api.addCollection(Collections.userLocations);

    }

    //PROBLEM SOLVED: DATEs format
    let testSchema = new SimpleSchema({
        createdAt: {
            type: Date,
            autoValue: function () {
                if (this.isSet && new Date(this.value) != null) {
                    return new Date(this.value);
                }
                else return this.unset();
            }
        }
    });
    Api.addRoute('test', {authRequired: false}, {
        post: function () {
            //this.bodyParams.createdAt = new Date(this.bodyParams.createdAt);
            testSchema.clean(this.bodyParams); // triggers autoValue on schema
            let validation = validateBody(this.bodyParams, testSchema);
            if (!validation.isValid()) {
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else {
                return this.bodyParams;
            }
        }
    });
    
    Api.addRoute('saveStats', {authRequired: false}, {
        get: function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
            
        var timeStamp = yyyy + "-" + mm + "-" + dd;
            
            //, {$set: {actualCharging: updateValue}}
            
            var time = Collections.UsersStats.find({userId: 1}, {fields: {chargingTime: 1}}).fetch();
            console.log("t " + time);
        var result = Collections.UsersStats.update({time: timeStamp, userId: 1}, {$set: {chargingTime: 5}});
        
        console.log("sdgdfgfdg " + yyyy + " " + mm + " " + dd + " " + result);
            
            return yyyy + " " + mm + " " + dd;
    }
    });
    //Test END
    
//     Api.addRoute('entera/:id', {authRequired: false}, {
//        get: function() {
//            var result = Collections.UsersFavLocations.update({userId: 1}, { $push: { locationList: this.urlParams.id }}, { upsert: true } );  
//            return "labas " + result;
//        }
//    });

    Api.addCollection(Collections.ReserveNow);

    //TESTING
    DemoReserve = new SimpleSchema({
        title: {
            type: String,
            label: "Title",
            max: 200
        },
        author: {
            type: String,
            label: "Author"
        }
    }); // for schema try

    Collections.ReserveNow.attachSchema(DemoReserve);
    let SchemasOcpp = {};
    SchemasOcpp.ReserveNowSchema = new SimpleSchema({
        title: {
            type: String,
            label: "Request title",
            max: 200
        },
        properties: {
            type: Object,
            label: "Request properties",
            maxCount: 5
        },
        "properties.$.connectorId": {
            type: Number,
            label: "Connector Id"
        },
        "properties.$.expiryDate": {
            type: Date,
            label: "Expiry Date"
        },
        "properties.$.idTag": {
            type: String,
            label: "Id Tag"
        },
        "properties.$.parentIdTag": {
            type: String,
            label: "Parent Id Tag",
            optional: true
        },
        "properties.$.reservationId": {
            type: Number,
            label: "Reservation Id"
        },

    });
    SchemasOcpp.ReserveNowRespondSchema = new SimpleSchema({
        title: {
            type: String,
            label: "Request title",
            max: 200
        },
        properties: {
            type: Object,
            label: "Request properties",
            maxCount: 5
        },
        "properties.$.status": {
            type: String,
            label: "Status",
            allowedValues: ["Accepted",
                "Faulted",
                "Occupied",
                "Rejected",
                "Unavailable"]
        }
    });
    
    Api.addRoute('stationChargeChecker/:id', {authRequired: false}, {
        get: function () {
            var id = new String(this.urlParams.id).toString();
            
            var result = Collections.ChargingSessions.findOne({station_id: id});
            if(typeof result == "undefined") {
                return {};
            }
            return result;
        },
        post: function () {
            console.log(this.bodyParams);
            var updateValue = this.bodyParams.actualCharging;
            var stationId = this.bodyParams.station_id;
            var reservationId = this.bodyParams.reservationId;
            console.log("SDGUISODSDS " +  reservationId);
            Collections.ChargingSessions.update({station_id: stationId}, {$set: {actualCharging: updateValue}});
            Collections.Reservation.update({_id: reservationId}, {$set: {chargingSessionActive: updateValue}});
            //var result = Collections.ChargingSessions.update({stationId: id}, {$set: {actualCharging: true}}).fetch();
            //return result;
            return {};
        }
    });
    
    Api.addRoute('chargingTimeEnd', {authRequired: false}, {
         post: function () {
            var stationId = this.bodyParams.station_id;
            var timeCharged = this.bodyParams.time_charged;
            var userId = this.bodyParams.userId;
            var reservationId = this.bodyParams.reservationId;
             
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            var timeStamp = yyyy + "-" + mm + "-" + dd;
             
            Collections.ChargingSessions.remove({station_id: stationId});
            Collections.Reservation.remove({_id: reservationId});
             
             console.log("PAREJAS LAIKAS " + timeCharged);
            
            var time = Collections.UsersStats.find({userId: userId, timeStamp: timeStamp}, {chargingTime: 1}).fetch();
            if(typeof time[0] == "undefined") {
                Collections.UsersStats.update({userId: userId, timeStamp: timeStamp}, {$set: {chargingTime : timeCharged}}, {upsert: true});
            } else {
                 var total = time[0].chargingTime + timeCharged;
                 Collections.UsersStats.update({userId: userId, timeStamp: timeStamp}, {$set: {chargingTime : total}}, {upsert: true});
                
                 console.log("PAREJAS LAIKAS VISO YRA== " + total);
            }
            return {};
        }
    });

    Api.addRoute('locations', {authRequired: false}, {
        get: function () {
            return Collections.Location.find().fetch();
        },
        post: function () {
            let respond = [];
            console.log(this.bodyParams.length);
            for (let i = 0; i < this.bodyParams.length; i++) {
                console.log(this.bodyParams[i]);
                respond.push(Collections.Location.insert(this.bodyParams[i]));
            }
            return respond;
        }
    }); // To Take all locations

    //Just for development
    Api.addRoute('stations', {authRequired: false}, {
        get: function () {
            return Collections.Station.find().fetch();
        },
        post: function () {
            let respond = [];
            console.log(this.bodyParams.length);
            for (let i = 0; i < this.bodyParams.length; i++) {
                console.log(this.bodyParams[i]);
                respond.push(Collections.Station.insert(this.bodyParams[i]));
            }
            return respond;
        }
    }); // To Take all locations
    /**
     * GET method to take locations by type
     * MUST be first given parameter
     *
     * Order how to form URL from this point does not matter
     *
     * if type radius url needs 3 parameters,
     * forms square from given params
     * longitude - center point
     * latitude - center point
     * radius - km from center point
     *
     * if type border url needs 4 parameters
     * leftLongitude - left bottom border point
     * leftLatitude - left bottom border point
     * rightLongitude - right top border point
     * rightLatitude - right top border point
     *
     * ex. http://169.254.147.1:3000/api/location/radius?longitude=25.2796514&latitude=54.6871555&radius=300
     */
    Api.addRoute('location/:type', {authRequired: false}, {
        // this.urlParams.type isnt working, saving property to id atribute
        // Last update return result is minimalized
        get: function () {
            let query = this.queryParams;
            let params = {}, err;
            if (this.urlParams.id === "radius") {
                for (let key in query) {
                    switch (key) {
                        //type "radius"
                        case "longitude": {
                            params.longitude = query[key];
                        }
                            break;
                        case "latitude": {
                            params.latitude = query[key];
                        }
                            break;
                        case "radius": {
                            params.radius = query[key];
                        }
                            break;
                    }
                }
                err = checkParams(params, "longitude", "latitude", "radius");
                if (err.missingParams.length > 0) {
                    return {
                        'statusCode': 400,
                        "title": "Missing parameters",
                        "properties": {
                            "status": " Query rejected",
                        },
                        "respond": err
                    }
                }

                params.topBound = findBounds(params, "top");
                params.rightBound = findBounds(params, "right");
                params.leftBound = findBounds(params, "left");
                params.bottomBound = findBounds(params, "bottom");
                return {
                    'statusCode': 200,
                    "title": "Locations array by radius",
                    "properties": {
                        "status": " Query accepted",
                        params,
                    },
                    "respond": Collections.Location.find({
                            $and: [
                                {longitude: {$lt: params.rightBound, $gt: params.leftBound}},
                                {latitude: {$lt: params.topBound, $gt: params.bottomBound}}
                            ]
                        },
                        {sort: {created_at: -1}}).fetch()
                };
            }
            else if (this.urlParams.id === "border") {
                for (let key in query) {
                    switch (key) {
                        //type "border"
                        case "leftLongitude": {
                            params.leftLongitude = parseFloat(query[key]);
                        }
                            break;
                        case "leftLatitude": {
                            params.leftLatitude = parseFloat(query[key]);
                        }
                            break;
                        case "rightLongitude": {
                            params.rightLongitude = parseFloat(query[key]);
                        }
                            break;
                        case "rightLatitude": {
                            params.rightLatitude = parseFloat(query[key]);
                        }
                            break;
                    }
                }

                err = checkParams(params, "leftLongitude", "leftLatitude", "rightLongitude", "rightLatitude");
                if (err.missingParams.length > 0) {
                    return {
                        'statusCode': 400,
                        "title": "Missing parameters",
                        "properties": {
                            "status": " Query rejected",
                        },
                        "respond": err
                    }
                }

                let resultFromCollections = Collections.Location.find({
                    $and: [
                        {longitude: {$lt: params.rightLongitude, $gt: params.leftLongitude}},
                        {latitude: {$lt: params.rightLatitude, $gt: params.leftLatitude}}
                    ]
                }).fetch();
                console.log("Spausdinsiu result");
                console.log(resultFromCollections);
                let result = [];
                for (let key in resultFromCollections) {
                    let obj = {
                        "_id": resultFromCollections[key]._id,
                        "longitude": resultFromCollections[key].longitude,
                        "latitude": resultFromCollections[key].latitude,
                        "state": 0,
                    };
                    result.push(obj);
                }
                console.log(result);

                return {
                    'statusCode': 200,
                    "title": "Locations array by border",
                    "properties": {
                        "status": " Query accepted",
                        params
                    },
                    "respond": Collections.Location.find({
                        $and: [
                            {longitude: {$lt: params.rightLongitude, $gt: params.leftLongitude}},
                            {latitude: {$lt: params.rightLatitude, $gt: params.leftLatitude}}
                        ]
                    }).fetch(),
                    "result": result
                }
            }
            else {
                return {
                    'statusCode': 400,
                    "title": "Missing type",
                    "properties": {
                        "status": " Query rejected",
                    },
                    "respond": "Please enter shoose type 'border' or 'radius'"
                }
            }

        },
        post: function () {
            let body = this.bodyParams;
            let id = Collections.Location.insert(body);
            return {
                id: id,
                body: body
            }; //need to test
        }
    });

    // Api.addRoute('stations', {authRequired: false}, {
    //     get: function () {
    //         let query = this.queryParams;
    //         if (query.hasOwnProperty("location")) {
    //             return {
    //                 'statusCode': 400,
    //                 "title": "Location's stations",
    //                 "properties": {
    //                     "status": " Query accepted",
    //                 },
    //                 "respond": Collections.Station.find({location_id: parseInt(query.location)}).fetch()
    //             }
    //         }
    //     }
    // })

//    Api.addRoute('reserveStation', {authRequired: false}, {
//        post: function () {
//            // Need to re-write validation and schema
//            try {
//                let body = this.bodyParams;
//                //check(body, DatabaseSchemas.ReservationSchema); // Patikrinti ar uzklausoje yra reikalingi duomenys funkcijai vykdyti
//                let res = reserveStation(this.bodyParams);
//                return res;
//            }
//            catch (e) {
//                switch (e.errorType) {
//                    case 'Meteor.Error': {
//                        return {
//                            "status": "failure",
//                            "problem": "meteor.error"
//                        };
//                    }
//                        break;
//                    case 'Match.Error': {
//                        return {
//                            "status": "failure",
//                            "problem": "Ivesti duomenys neatitinka formato"
//                        };
//                    }
//                        break;
//                    default: {
//                        return e;
//                    }
//                }
//            }
//        }
//    });
    
    
    //-----------------------
    //-----------------------
    //----------------------
    
    
     Api.addRoute('reserveStation', {authRequired: false}, {
         get: function() {
       
         },
         post: function () {
            var userId = isUserTokenValid(token);
            if(userId == -1) {
                throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
            }
            try {
                console.log(body);
                return Functions.reserveStation(JSON.parse(body), userId);
            } catch (e) {
                switch (e.errorType) {
                    case 'Meteor.Error': {
                        return {
                            "status": "failure",
                            "problem": "meteor.error"
                        };
                    }
                        break;
                    case 'Match.Error': {
                        return {
                            "status": "failure",
                            "problem": "Ivesti duomenys neatitinka formato"
                        };
                    }
                        break;
                    default: {
                        return e;
                    }
                }
            }
         }
    });
    
    
    Api.addRoute('getLocationInfo', {authRequired: false}, {
         get: function() {
            var userId = isUserTokenValid(token);
            console.log("sdfsduyfdfsfd " + userId);
            if(userId == -1) {
                throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
            }
            id = new String(id).toString();
            console.log(id);
            let queryResult = Collections.Location.find({_id: id}).fetch();
            console.log(queryResult);
            if(queryResult != null || queryResult.length > 0) {
                return{
                    'statusCode': 200,
                    "title": "Location Info Success",
                    "respond": queryResult[0]
                }
            }
            return {
                'statusCode': 400,
                "title": "Bad location id",
                "properties": {
                    "status": " Query rejected",
                }
            }
         }
    });
    
     Api.addRoute('getLocationsByType', {authRequired: false}, {
         get: function() {
            var userId = isUserTokenValid(token);
            if(userId == -1) {
                throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
            }
            let params = {}, err={};

            if (type === "border") {
                params.leftLongitude = parseFloat(leftLongitude);
                params.leftLatitude = parseFloat(leftLatitude);
                params.rightLongitude = parseFloat(rightLongitude);
                params.rightLatitude = parseFloat(rightLatitude);

                //err = checkParams(params, "leftLongitude", "leftLatitude", "rightLongitude", "rightLatitude");
                let resultFromCollections = Collections.Location.find({
                    $and: [
                        {longitude: {$lt: params.rightLongitude, $gt: params.leftLongitude}},
                        {latitude: {$lt: params.rightLatitude, $gt: params.leftLatitude}}
                    ]
                }).fetch();

                console.log(resultFromCollections + " " + params.rightLongitude);
                let result = [];
                for (let key in resultFromCollections){
                    const tempObj = resultFromCollections[key];
                    let stateOfLocation = 0;
                    let obj = {
                        "_id": resultFromCollections[key]._id,
                        "longitude" : resultFromCollections[key].longitude,
                        "latitude" : resultFromCollections[key].latitude,
                        "state" : stateOfLocation,
                    };
                    result.push(obj);
                }

                return {
                    'statusCode': 200,
                    "title": "Locations array by border",
                    "properties": {
                        "status": " Query accepted",
                        params
                    },
                    "respond": result
                }
            }
            else {
                return {
                    'statusCode': 400,
                    "title": "Missing type",
                    "properties": {
                        "status": " Query rejected",
                    },
                    "respond": "Please enter shoose type 'border' or 'radius'"
                }
            }
         }
    });
    
    
    Api.addRoute('getLocationDetailInfo/:token', {authRequired: false}, {
         get: function() {
             console.log(this.urlParams.token);
              let exist = Meteor.users.findOne({token: this.urlParams.token}, {id: 1});
                if(typeof exist == 'undefined') {
                    return -1;
                }
             var userId = exist.id;
            if(userId == -1) {
                throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
            }
            let locationIdStr = new String(this.urlParams.locationId).toString();

            let locationResult = Collections.Location.find({_id: locationIdStr}).fetch();
            let stationsResult = Collections.Station.find({location_id: locationIdStr}).fetch();
            //let isVavorite = Collections.UsersFavLocations.find({userId: userId}, { $push: { locationList: id }} );
            //var locations = Collections.Location.find({_id: {$in: ids}}).fetch(); // .find({locationList: { $in : [locationIdStr]}}).fetch();
            //let isVavorite = Collections.UsersFavLocations.find({$and: [{userId: userId}, {locationList: {$elemMatch :{locationIdStr}}}]}).fetch();
            let isVavorite = Collections.UsersFavLocations.find({$and: [{userId: userId},{locationList: { $in : [locationIdStr]}}]}).count();
            console.log("zebrasas " + isVavorite);
            if(locationResult != null || locationResult.length > 0) {
                return {
                    'statusCode': 200,
                    "title": "Location Info Success",
                    "locationDetail": locationResult[0],
                    "isFav" : isVavorite,
                    "stationList" : stationsResult
                }
            }
            return {
                'statusCode': 400,
                "title": "Bad location id",
                "properties": {
                    "status": " Query rejected",
                }
            }
         }
    });
    
    Api.addRoute('getLocationAddress/:token/:id', {authRequired: false}, {
         get: function() {
             console.log(this.urlParams.token + " " + this.urlParams.id);
              let exist = Meteor.users.findOne({token: this.urlParams.token}, {id: 1});
                if(typeof exist == 'undefined') {
                    return -1;
                }
             var userId = exist.id;
            if(userId == -1) {
                throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
            }
            let locationIdStr = new String(this.urlParams.id).toString();
             console.log("ZAZASASAFSAUSASAS " + locationIdStr);
            let locationResult = Collections.Location.findOne( {_id: locationIdStr}, {fields: {address:1}} );
            if(locationResult != null || locationResult.length > 0) {
                return {
                    'statusCode': 200,
                    "title": "Location Info Success",
                    "locationDetail": locationResult
                }
            }
            return {
                'statusCode': 400,
                "title": "Bad location id",
                "properties": {
                    "status": " Query rejected",
                }
            }
         }
    });
    
      Api.addRoute('getStationReservationTimes/:token/:stationId', {authRequired: false}, {
         get: function() {
            let exist = Meteor.users.findOne({token: this.urlParams.token}, {id: 1});
                if(typeof exist == 'undefined') {
                    return -1;
                }
             var userId = exist.id;
            if(userId == -1) {
                throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
            }
            let reservation = Collections.Reservation.find({station_id: this.urlParams.stationId}, {expire_date: {$lte: new Date()}}).fetch();
            let activeCharger = Collections.ChargingSessions.find({station_id: this.urlParams.stationId}, {fields:{reservationId: 1}}).fetch();
            return {
                "status": "success",
                "result": reservation,
                "activeChargerId": activeCharger
            }
         }
        });
    
     Api.addRoute('removeStationReservation', {authRequired: false}, {
         post: function() {
             var userId = isUserTokenValid(token);
             if(userId == -1) {
                throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
             }
             let reservation = Collections.Reservation.remove({_id: reservationId, station_id: stationId, id_Tag: userId});
             var result = Collections.ChargingSessions.remove({station_id: stationId});
             console.log("AR PASALINO????  " + result);
             //let reservation = Collections.Reservation.remove({_id: reservationId, station_id: stationId, id_Tag: userId});
             return reservation;
         }
      });
    
      Api.addRoute('getLocationsBySearchQuery', {authRequired: false}, {
         get: function() {
             var userId = isUserTokenValid(token);
            if(userId == -1) {
                throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
            }
            let result = Collections.Location.find({
                address: {$regex: query, 
                          $options: '-i'}
            }, {fields:{_id: 1, address : 1, latitude: 1, longitude: 1}}
                                                  ).fetch();
            console.log("result = " + result);
            return result;
         }
      });

}

        /*Meteor.methods({
            "getLocations": function(type, leftLongitude, leftLatitude, rightLongitude, rightLatitude){

                let params = {}, err={};

                if (type === "border") {
                                params.leftLongitude = parseFloat(leftLongitude);
                                params.leftLatitude = parseFloat(leftLatitude);
                                params.rightLongitude = parseFloat(rightLongitude);
                                params.rightLatitude = parseFloat(rightLatitude);

                    //err = checkParams(params, "leftLongitude", "leftLatitude", "rightLongitude", "rightLatitude");
                    let resultFromCollections = Collections.Location.find({
                        $and: [
                            {longitude: {$lt: params.rightLongitude, $gt: params.leftLongitude}},
                            {latitude: {$lt: params.rightLatitude, $gt: params.leftLatitude}}
                        ]
                    }).fetch();
                    console.log("Spausdinsiu result");
                    console.log(resultFromCollections);
                    let result = [];
                    for (let key in resultFromCollections){
                    //States for locations if state 0 location free, 1 is taken
                    // Reikia suskaiciuoti kiek stationu yra ir kiek is ju uzimta, pagal tai keisti state
                        const tempObj = resultFromCollections[key];
                        let stations = Station.find({location_id : tempObj._id}).fetch();
                        let stateOfLocation = 0;
                        for(let i in stations){
                            if(stations[i].state == 1){
                                stateOfLocation = 1;
                            }
                        }
                        let obj = {
                            "_id": resultFromCollections[key]._id,
                            "longitude" : resultFromCollections[key].longitude,
                            "latitude" : resultFromCollections[key].latitude,
                            "state" : stateOfLocation,
                        };
                        result.push(obj);
                    }
                    console.log(result);
                    return {
                        'statusCode': 200,
                        "title": "Locations array by border",
                        "properties": {
                            "status": " Query accepted",
                            params
                        },
                        "respond": result
                    }
                }
                else {
                    return {
                        'statusCode': 400,
                        "title": "Missing type",
                        "properties": {
                            "status": " Query rejected",
                        },
                        "respond": "Please enter shoose type 'border' or 'radius'"
                    }
                }
            }

        });*/


    /**
     * FindBounds method to calculate true parameters of latitude and longitude by place in earth
     * requires 2 parameters
     *
     * params - Object that has latitude and longitude attributes
     * side - String which bound to find
     */
    function findBounds(params, side) {
        let bound;
        switch (side) {
            case "top": {
                bound = parseFloat(params.latitude) + (params.radius / 110.574);
            }
                break;
            case "right": {
                let rads = parseFloat(params.latitude) * Math.PI / 180;
                bound = parseFloat(params.longitude) + (params.radius / 111.320 * Math.cos(rads));
            }
                break;
            case "left": {
                let rads = parseFloat(params.latitude) * Math.PI / 180;
                bound = parseFloat(params.longitude) - (params.radius / 111.320 * Math.cos(rads));
            }
                break;
            case "bottom": {
                bound = parseFloat(params.latitude) - (params.radius / 110.574);
            }
                break;
        }
        return bound;
    }

    /**
     * Test method ReserveStation
     *
     */
    function reserveStation(data) {
        // try {
        //FindONe is deprecated
        let station = Collections.Station.findOne({_id: data.id});
        if (!station) {
            return {
                "status": "failure",
                "problem": "Stotele nerasta"
            };
        }
        let reservation = Collections.Reservation.find({$and: [{station_id: data.id}, {expire_date: {$gt: new Date()}}]}).fetch();
        console.log(data.expire_date);
        console.log("Expire date =" + new Date(data.expire_date).getTime() + " Start date =" + new Date(data.start_date).getTime());
        let result;
        if (new Date(data.expire_date).getTime() <= new Date(data.start_date).getTime()) {
            return {
                "status": "failure",
                "problem": "Pabaigos laikas yra mazesnis uz pradzios"
            };
        }
        if (new Date(data.expire_date).getTime() < new Date().getTime() ||
            new Date(data.start_date).getTime() < new Date().getTime()) {
            return {
                "status": "failure",
                "problem": "Norimas rezervuoti laikas yra pasenes"
            };
        }
        if (reservation.length == 0) {
            result = ({
                start_date: new Date(data.start_date),
                expire_date: new Date(data.expire_date),
                status: "Accepted",
                station_id: data.id
            });
            console.log("Rezervaciju pagal Stotele nerasta");
            console.log(result);
            Collections.Reservation.insert(result);
        }
        else if (checkIsReservationTimeValid(reservation, data)) {
            console.log("Norimos Rezervacijos laikas laisvas");
            result = ({
                start_date: new Date(data.start_date),
                expire_date: new Date(data.expire_date),
                status: "Accepted",
                station_id: data.id
            });
            Collections.Reservation.insert(result);
        }
        else {
            console.log("Rezervacijai laikas netinkamas");
        }
        return {
            "status": "success",
            "result": result
        };
    }

    function checkIsReservationTimeValid(reserved, request) {
        let resStart, resEnd, reqStart, reqEnd, timesAccepted = 0;
        reqStart = new Date(request.start_date).getTime();
        reqEnd = new Date(request.expire_date).getTime();
        for (let key in reserved) {
            resStart = reserved[key].start_date.getTime();
            resEnd = reserved[key].expire_date.getTime();
            if (resStart > reqEnd || resEnd < reqStart) {
                timesAccepted++;
            }
        }
        return timesAccepted == reserved.length;
    }

    /**
     * Test method for object to serach is it have needed attributes and its values
     *
     */
    function checkParams(object, ...params) {
        let err = {missingParams: []};
        for (let param in params) {
            if (!object.hasOwnProperty(params[param])) {
                err.missingParams.push(params[param]);
            }
        }
        return err;
    }
    /**
    * Method to create station info with current locations params
    *
    */
    function createStations(stationsMini){
        let result = Collections.Location.find({}).fetch();

        for (let key in result){
            let obj = {
                "location_id": result[key]._id,
                "state": key%2
            };
            let insertResults = stationsMini.insert(obj);
        }
    }

export { Api } ;