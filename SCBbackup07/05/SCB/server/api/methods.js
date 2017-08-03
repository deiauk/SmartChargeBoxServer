/**
 * Created by Aurimas on 11/03/17.
 */

import { Meteor } from 'meteor/meteor';
import { Collections } from '../modules/database';
import { Functions } from './apiFunctions';
import { HTTP } from 'meteor/http';
import { Random } from 'meteor/random';

//Meteor.methods({
//    "gg": function() {
//        console.log("GG");
//        let res;
//        if(Math.random().valueOf() > 0.4){
//            res = Collections.Location.update({_id: "81349"}, {$set: {state: 1}});
//        }
//        else{
//            res = Collections.Location.update({_id: "81349"}, {$set: {state: 0}});
//        }
//        console.log("GGGG" + res);
//    }
//});

Meteor.methods({
//    "chargeStateChanger": function(data, time) {
//        //console.log(data);
//        //.find({token:"b", dt: {"$gte": new ISODate("2010-03-04T00:00:00.000Z")}});
//        Users.insert({"token": "b", data: "time", "dt": new Date("2017-03-04T00:00:00.000Z").toISOString()});
//    },

    "reserveStation": function (token, body) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        try {
            console.log(body);
            return Functions.reserveStation(JSON.parse(body), userId);
        }
        catch (e) {
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
    },

//    "updateUserLocations": function(id, locationsArray) {
//        //console.log(id + " " + locationsArray);
//        console.log("update User Locations array from client " + locationsArray);
//        let queryResult = Collections.userLocations.update({_id : id},
//            {$set: { _id: id, locations_id: locationsArray}}, { upsert: true });
//        //console.log(queryResult);
//    },

    "getLocationInfo": function (token, id) {
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
    },

    "getLocationsByType": function(token, type, leftLongitude, leftLatitude, rightLongitude, rightLatitude){
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
    },
    
    "getLocationDetailInfo": function(token, locationId) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        let locationIdStr = new String(locationId).toString();
        
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
    },
    
    "getLocationAddress" : function (token, locationId) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        let locationIdStr = new String(locationId).toString();
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
    },

    ".startTransaction": function (userId, locationId) {
        locationId = new String(locationId).toString();
        let queryResult =  Collections.Location.update({_id: locationId}, {$set: {state : 1}});
        console.log("Start transaction progress " + queryResult);
        if(queryResult == 1){
            return {
                title: "Start transaction",
                progress: true
            }
        }
        return {
            title: "Start transaction",
            progress: false
        }
    },
    
    "getStationReservationTimes": function(token, stationId) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        let reservation = Collections.Reservation.find({station_id: stationId}, {expire_date: {$lte: new Date()}}).fetch();
        let activeCharger = Collections.ChargingSessions.find({station_id: stationId}, {fields:{reservationId: 1}}).fetch();//{fields:{_id: 1,
        return {
            "status": "success",
            "result": reservation,
            "activeChargerId": activeCharger
        };
    },
    
    "removeStationReservation": function(token, reservationId, stationId) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        let reservation = Collections.Reservation.remove({_id: reservationId, station_id: stationId, id_Tag: userId});
        var result = Collections.ChargingSessions.remove({reservationId: reservationId});
        console.log("AR PASALINO2222222222222????  " + result);
        return reservation;
    },
    
    "getLocationsBySearchQuery": function(token, query) {
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
    },
    
    "authentificateUser": function(signInType, token) {
        console.log("AUTENTFIKIAVIMAS " + signInType);
        if(signInType == 1) {
            try {
              const result = HTTP.call('GET', 'https://graph.facebook.com/me/?access_token=' + token);
              if(result.statusCode == 200) {
                   console.log("AUTENTFIKIAVIMAS " + "1 kdoas 200" );
                  var userData = result.data;
                  var name = userData.name;
                  var id = userData.id;
                  var token = Random.id();
                  Meteor.users.update({id: id, name: name}, {$set: {token : token}}, {upsert: true});
                  var value = {
                      name: name,
                      token: token
                  };
                    console.log("AUTENTFIKIAVIMAS " + "return  " + value);
                  return value;
              } else {
                   console.log("AUTENTFIKIAVIMAS " + "ODAS JAU ITAS KODDDDDDDDDDDDDDDDDD 11111 " + result.statusCode);
              }
                console.log("AUTENTFIKIAVIMAS " + "return  neapejo varke");
              return result;
            } catch (e) {
              return "";
            }
            return "";;
        } else if (signInType == 2) {
            try {
              const result = HTTP.call('GET', 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token);
              if(result.statusCode == 200) {
                   console.log("AUTENTFIKIAVIMAS " + "1 kdoas 200" );
                  var userData = result.data;
                  var name = userData.name;
                  var id = userData.sub;
                  var token = Random.id();
                  Meteor.users.update({id: id, name: name}, {$set: {token : token}}, {upsert: true});
                   var value = {
                      name: name,
                      token: token
                  };
                   console.log("AUTENTFIKIAVIMAS " + "return  " + value);
                  return value;
              } else {
                  console.log("AUTENTFIKIAVIMAS " + "ODAS JAU ITAS KODDDDDDDDDDDDDDDDDD 22222 " + result.statusCode);
              }
                console.log("AUTENTFIKIAVIMAS " + "return  neapejo varke");
              return result;
            } catch (e) {
              return "";
            }
        }
        return "";
    },
    
    "getNearestLocations": function(token, lng, lat, skip) {
//        var userId = isUserTokenValid(token);
//        if(userId == -1) {
//            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
//        }
        var myTest = Collections.Location.find({
          location: {
            $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [lng, lat]
                }
            }
          }
        }, {skip: skip, limit: 8}).fetch();
        return myTest;
    },
    
    "getFavLocationsInfo" : function(token) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        var value = Collections.UsersFavLocations.find({userId: userId}, {fields:{locationList: 1, _id: 0}}).fetch();
        if(value.length > 0) {
            var locations = Collections.Location.find({_id: {$in: value[0].locationList}}).fetch();
            return locations;
        } else {
            return {};   
        }
    },
    
    "getReservations" : function(token, time) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        console.log("hhhhh " + time);
        if(time == -1) {
              var reservationsList = Collections.Reservation.find({id_Tag: userId}, {fields:{_id: 1, start_date : 1, expire_date: 1, station_id: 1}}).fetch();
              var activeSessions = Collections.ChargingSessions.find({userId: userId}).fetch();
            var tmp=[];
            for(var i=0; i<reservationsList.length; i++) {
                console.log("fdsdguifdf "+ reservationsList[i].station_id + " " + reservationsList[i]._id);
                if(reservationsList[i].start_date >= new Date(time)) {
                    for(var j=0; j<activeSessions.length; j++) {//"reservationId"
                        if(reservationsList[i]._id == activeSessions[j].reservationId) {
                            tmp[tmp.length] = activeSessions[j].reservationId;
                        }
                    } 
                }
            }
            var resultObj = {
                activeIds: tmp,
                list: reservationsList
                
            }
            return resultObj;
        } else {
             var reservationsList = Collections.Reservation.find({$and: [{id_Tag: userId}, {start_date: {$gte: new Date(time)}}]}, {fields:{_id: 1, start_date : 1, expire_date: 1, station_id: 1}}).fetch();
            return reservationsList;
        }
    },
    
    "sendComment" : function(token, img, name, comment, locationId) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        var insertBody = {
            time: new Date(),
            userId: userId, 
            img: img, 
            name: name, 
            comment: comment, 
            locationId: locationId
        }
        
        console.log("Taisymas " + insertBody);
        var newUserRecord = Collections.Comments.insert(insertBody);
        insertBody._id = newUserRecord;
        return insertBody;
    },
    
    "readComments" : function(token, locationId, skip) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        console.log(locationId + " " + skip);
        return Collections.Comments.find({locationId: locationId}).fetch().reverse();
        //return Collections.Comments.find({locationId: locationId}, {skip: skip, limit: 8}, {sort: {time: 1}}).fetch();
    },
    
    "initCharging" : function(token, stationId, startTime, endTime, reservationId) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        var chargeObj = {
            userId: userId,
            station_id: stationId,
            startTime: startTime,
            endTime: endTime,
            reservationId: reservationId,
            actualCharging: false
        }
        var insertedId = Collections.ChargingSessions.insert(chargeObj);
        var result = {
            insertedId: insertedId,
            obj: chargeObj
        }
        return result;
    },
    
    "cancelCharging" : function(token, timeCharged, reservationIdCancel) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var timeStamp = yyyy + "-" + mm + "-" + dd;
        
        var time = Collections.UsersStats.find({userId: userId, timeStamp: timeStamp}, {chargingTime: 1}).fetch();
        if(typeof time[0] == "undefined") {
            console.log("fdsgufpsdffd " + "undefined");
            Collections.UsersStats.update({userId: userId, timeStamp: timeStamp, queryKey: mm}, {$set: {chargingTime : timeCharged}}, {upsert: true});
        } else {
            var total = time[0].chargingTime + timeCharged;
             Collections.UsersStats.update({userId: userId, timeStamp: timeStamp, queryKey: mm}, {$set: {chargingTime : total}}, {upsert: true});
            console.log("fdsgufpsdffd " + total + " aasdasd");
        }
        var tiasdme = Collections.UsersStats.find({userId: userId, timeStamp: timeStamp}, {chargingTime: 1}).fetch();
        console.log("fdsgufpsdffd " + timeCharged + " " + reservationIdCancel + " " + tiasdme[0].chargingTime);
        var op = Collections.Reservation.remove({_id: reservationIdCancel});
        return Collections.ChargingSessions.remove({userId : userId});
    },
    
    "chargingSessionsTracker" : function(token) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        
        return Collections.ChargingSessions.find({userId : userId}).fetch();
    },
    
    "insertToUserFavLocationsTable" : function(token, id) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        var value = Collections.UsersFavLocations.update({userId: userId}, { $push: { locationList: id }}, {upsert: true} );
        var result = {
            inserted: value
        }
        return result;
    },
    
    "removeFromUserFavLocationsTable" : function(token, id) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        var value = Collections.UsersFavLocations.update({userId: userId}, { $pull: { locationList: id }});
        var result = {
            removed: value
        }
        return result;
    },
    
    "getStats" : function(token) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        var today = new Date();
        var mm = today.getMonth() + 1;
        
        var removedItems = Collections.UsersStats.remove({queryKey: { $ne: mm }});
        var result = Collections.UsersStats.find({userId: userId, queryKey: mm}).fetch();
        return result;
    },
    
    "rateLocation": function(token, rating, locationId) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        var document = {
            userId: userId,
            rating: rating
        }
        var isAlreadyUpdated = Collections.LocationRatings.find({locationId: locationId}).fetch();
        if(typeof isAlreadyUpdated[0] == 'undefined') {
            var value = Collections.LocationRatings.update({locationId: locationId}, {$push: {info: document}}, {upsert: true});
            Collections.Location.update({_id: locationId}, {$set: {rating: rating}});
        } else {
            var len = isAlreadyUpdated[0].info.length;
            var sum = 0;
            var isDeleted = 0;
            for(var i = 0; i<len; i++) {
                if(isAlreadyUpdated[0].info[i].userId == userId) {
                    var doc = isAlreadyUpdated[0].info[i];
                    isDeleted = Collections.LocationRatings.update({locationId: locationId}, {$pull: {info: doc}});
                } else {
                    sum += isAlreadyUpdated[0].info[i].rating;
                }
            }
            if(isDeleted <= 0) {
                len = len + 1;
            }
            var value = Collections.LocationRatings.update({locationId: locationId}, {$push: {info: document}}, {upsert: true});
            sum += document.rating;
            var calcRating = sum / len;
            console.log("SDGSOIDSDSD " + sum + " reitingas == " + calcRating +" ilgis " +len);
            Collections.Location.update({_id: locationId}, {$set: {rating: calcRating}});
        }
    },
    
    "removeComment": function(token, commentId) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        var result = Collections.Comments.remove({_id: commentId});
        var returnObj = {
            result: result,
            id: commentId
        }
        return returnObj;
    },
    
    "editComment": function(token, commentId, text) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        var result = Collections.Comments.update({_id: commentId}, {$set: {comment: text}});
         var returnObj = {
            result: text,
            id: commentId
        }
         return returnObj;
    },
    
    "uploadImage": function(token, locationId, img) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        console.log("sfdgusdf " + locationId + " " + img);
        //{$push: {info: document}}, {upsert: true});
        var coun = Collections.Imgs.find({locationId: locationId}).fetch();
        if(typeof coun[0] != 'undefined') {
            var size = coun[0].imgsList.length;
            if(size < 5) {
                var result = Collections.Imgs.update({locationId: locationId}, { $push: { imgsList: img }}, {upsert: true} );
                return size;
            } else {
                return -1;
            }
        } else {
            var result = Collections.Imgs.update({locationId: locationId}, { $push: { imgsList: img }}, {upsert: true} );
            return 0;
        }
    },
    
    "getLocationImgs": function(token, locationId) {
        var userId = isUserTokenValid(token);
        if(userId == -1) {
            throw new Meteor.Error(401, 'Error 401: Unauthorized', 'token is not valid');
        }
        var result = Collections.Imgs.find({locationId: locationId}).fetch();
        return result;
    }
});

function isUserTokenValid(token) { // private metodas!!!
    let exist = Meteor.users.findOne({token: token}, {id: 1});
    if(typeof exist == 'undefined') {
        return -1;
    }
    return exist.id;
}

Meteor.publish('stationTime', function (stationId) {
    return Collections.Reservation.find({station_id: stationId});
});

Meteor.publish('chargeSessionSub', function (stationId) {
    return Collections.ChargingSessions.find({station_id: stationId, actualCharging: true});
});

/*Meteor.publish('test1', function(id, time) {
    //console.log("A " + id + " *************************** " + time);
    //console.log("sdfihsdof " + Users.find({"token": id, data: "time", "dt": {"$gte": new Date(time).toISOString()}}).count());
//        if(id == "-1") {
//            console.log("sdfsdf");
//            return Users.find();
//        }
    //"2010-03-04T00:00:00.000Z"
    return Users.find({"token": id, "dt": {"$gte": new Date(time).toISOString()}});
});*/

/*Meteor.publish('test2', function(data){
    var self = this;
    //console.log("ASASAS");
    self.added ( "messages", "madeUpId1", { m: "This is not from a database"} );
    self.ready();
});*/

//Meteor.publish('userLocations', function (userId) {
//    console.log("start subscribe");
//    let queryResult = Collections.userLocations.find({_id: userId}).fetch();
//    //console.log(queryResult);
//    let array = [];
//    for (let key in queryResult[0].locations_id){
//        array.push(new String(queryResult[0].locations_id[key]).toString());
//    }
//    //console.log(array);
//    //console.log(Collections.Location.find({_id : {$in: array}}).fetch());
//    //queryResult = Collections.Location.find({_id : {$in: array}});
//    //console.log(queryResult);
//    return Collections.Location.find({_id : {$in: array}});
//});