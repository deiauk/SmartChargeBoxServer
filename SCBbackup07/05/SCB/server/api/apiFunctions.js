/**
 * Created by Aurimas on 11/01/17.
 */
import { Collections } from '../modules/database';

export let Functions = {};
/**
 * Checks if object fits simple schema
 * @param body - object to validate
 * @param schema - schema for validation
 */
Functions.validateBody = function (body, schema) {
    // triggers autoValue function in simple schema
    // Clean function also trims Strings, and do some other functions. To find out more on github Aldeed/SimpleSchema
    schema.clean(body);
    let validation = schema.newContext();
    validation.validate(body);
    return validation;
};

//Export functions
/**
 * FindBounds method to calculate true parameters of latitude and longitude by place in earth
 * requires 2 parameters
 *
 * params - Object that has latitude and longitude attributes
 * side - String which bound to find
 */
Functions.findBounds = function (params, side) {
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
Functions.reserveStation = function (data, userId) {
    let station = Collections.Station.findOne({_id: data.id});
    if (!station) {
        return {
            "status": "failure",
            "problem": "Stotele nerasta"
        };
    }
    
    /*
    
        
     let isReservationCollides = Collections.Reservation.find({$and: [{id_Tag: userId},{
          $or: [
            {start_date: {$gte: new Date(data.start_date), $lte: new Date(data.expire_date)}},
            {expire_date: {$gte: new Date(data.start_date), $lte: new Date(data.expire_date)}},
            {$and: [
              {start_date: {$lt: new Date(data.start_date)}},
              {expire_date: {$gt: new Date(data.expire_date)}}
            ]}
         ]
        }
      ]
    });
    
    */
    
    let isReservationCollides = Collections.Reservation.find({$and: [{id_Tag: userId},{
          $or: [
            {start_date: {$gte: new Date(data.start_date), $lte: new Date(data.expire_date)}},
            {expire_date: {$gte: new Date(data.start_date), $lte: new Date(data.expire_date)}},
            {$and: [
              {start_date: {$lt: new Date(data.start_date)}},
              {expire_date: {$gt: new Date(data.expire_date)}}
            ]}
         ]
        }
      ]
    });
    
      if(isReservationCollides.count() > 0) {
        var activeSessions = Collections.ChargingSessions.findOne({userId: userId}, {fields: {reservationId: 1}});
          console.log("afsdfisdfsdfdsf " +activeSessions );
        return {
            "activeSessions" : activeSessions,
            "status": "overlaps",
            "problem": "Šiuo laiku jau yra rezervuota stotelė",
            "result": isReservationCollides.fetch()
        };
    }
    

    let insertData = {
        start_date: (new Date(data.start_date).getTime()),
        expire_date: (new Date(data.expire_date).getTime()),
        status: "Accepted",
        station_id: data.id,
        id_Tag: userId,
        startNumber: new Date(data.start_date).getTime(),
        timestamp: new Date().valueOf() + 10800000,
        chargingSessionActive: false
    };


    let reservation = Collections.Reservation.find({$and: [{station_id: data.id}, {expire_date: {$gt: new Date()}}]}).fetch();
    let queryResult;
    if (reservation.length == 0 || Functions.checkIsReservationTimeValid(reservation, data)) {        
        queryResult = Collections.Reservation.insert(insertData);
    } else {
         console.log("Rezervacijai laikas netinkamas");
         return {
            "status": "error",
            "problem": "Kitas vartotojas jau rezervavo šį laiką"
         }; 
    }
    
    return {
        "status": "success",
        "insertionId": queryResult,
        "result": insertData
    };
};

Functions.checkIsReservationTimeValid = function (reserved, request) {
    console.log("checking");
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
};

/**
 * Test method for object to serach is it have needed attributes and its values
 *
 */
Functions.checkParams = function (object, ...params) {
    let err = {missingParams: []};
    for (let param in params) {
        if (!object.hasOwnProperty(params[param])) {
            err.missingParams.push(params[param]);
        }
    }
    return err;
};


// ereikia atskkiro taimerio, nes idejus state ir kai krovima pus pabaigtas ji apkeitus autimatiskai vikas prasieceienins!!!
 Meteor.setInterval(() => {
     var r = new Date().valueOf() + 9900000;// + 120000; // 10920000 // 9900000 //{$and: [{id_Tag: userId},
     var result = Collections.Reservation.remove(
         { $and: [{
            startNumber: { 
                 $lte: r 
            }} , {
                chargingSessionActive: { 
                    $eq: false 
                }
            }
           ]
         }
     );
     if(result > 0) {
         console.log("ISTRYNE REZERVACIJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa " + result);
     }
     //console.log("ISTRYNE " + result);
}, 10);
/**
 * Method to create station info with current locations params
 *
 */
//Functions.createStations = function (stationsMini){
//    let result = Collections.Location.find({}).fetch();
//
//    for (let key in result){
//        let obj = {
//            "location_id": result[key]._id,
//            "state": key%2
//        };
//        let insertResults = stationsMini.insert(obj);
//    }
//};