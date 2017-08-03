/**
 * Created by Aurimas on 02/01/17.
 */

import { Collections } from '../modules/database'
import { Enumerations } from '../types/Enumerations'
import { ResponseMessages } from  '../schemas/responseMessages'

let ClientRequests = {};

ClientRequests.AuthorizeRequest = function (idTag){
    let mongoRespond = Collections.OcppTag.find({id_Tag: idTag}).fetch();
    let respondMessage = ResponseMessages.Authorize();
    if(mongoRespond.length>0){
        if(mongoRespond[0].in_transaction){
            respondMessage.body.properties.idTagInfo.status = Enumerations.AuthorizationStatus[4];
        }
        if(mongoRespond[0].expire_date < new Date()) {
            respondMessage.body.properties.idTagInfo.status = Enumerations.AuthorizationStatus[2];
        }
        if(mongoRespond[0].blocked){
            respondMessage.body.properties.idTagInfo.status = Enumerations.AuthorizationStatus[1];
        }
        respondMessage.body.properties.idTagInfo.status = Enumerations.AuthorizationStatus[0];
        respondMessage.body.properties.expiryDate = mongoRespond[0].expire_date;
        respondMessage.body.properties.parentIdTag = mongoRespond[0].parent_id_Tag;
    }
    return respondMessage;
};

ClientRequests.BootNotificationRequest = function (params){
    //Ar tikrai taip reikia ieskoti patvirtinti
    let mongoRespond = Collections.SCB.find({charge_point_vendor : params.chargePointVendor}).fetch();
    let respondMessage = ResponseMessages.BootNotification();
    if(mongoRespond.length>0){
        respondMessage.body.properties.status = "Accepted";
    }
    return respondMessage;
};

ClientRequests.DataTransferRequest = function (params){
    let mongoRespond = Collections.SCB.find({ _id : params.vendorId}).fetch();
    let respondMessage = ResponseMessages.DataTransfer();
    if(mongoRespond.length>0){
        respondMessage.body.properties.status = "Accepted";
        respondMessage.body.properties.data = params.data;
    }
    return respondMessage;
};

ClientRequests.DiagnosticsStatusNotificationRequest = function (params){
    //let mongoRespond = Collections.SCB.find({charge_point_vendor : params.chargePointVendor}).fetch();
    let respondMessage = ResponseMessages.DiagnosticsStatusNotification();
    // if(mongoRespond.length>0){
    //     respondMessage.body.properties.status = "Accepted";
    // }
    return respondMessage;
};
ClientRequests.FirmwareStatusNotificationRequest = function (params){
    //let mongoRespond = Collections.SCB.find({charge_point_vendor : params.chargePointVendor}).fetch();
    let respondMessage = ResponseMessages.FirmwareStatusNotification();
    // if(mongoRespond.length>0){
    //     respondMessage.body.properties.status = "Accepted";
    // }
    return respondMessage;
};
ClientRequests.HeartbeatRequest = function (){
    let respondMessage = ResponseMessages.Heartbeat();
    return respondMessage;
};
ClientRequests.MeterValuesRequest = function (params){
    //where to save meterValues
    let respondMessage = ResponseMessages.MeterValues();
    return respondMessage;
};
ClientRequests.StartTransactionRequest = function (params){
    //Need to double check , rewrite other options
    let respond = Collections.OcppTag.find({id_Tag: params.idTag}).fetch();
    if(respond.length > 0) {
        let mongoRespond = Collections.Outlets.find({_id: params.connectorId}).fetch();
        let respondMessage = ResponseMessages.StartTransaction();
        if (mongoRespond.length > 0) {
            respondMessage.body.properties.idTagInfo.properties.status = "Accepted";
            let transaction = Collections.Transaction.insert({
                "connector_id" : params.connectorId,
                "id_Tag" : params.idTag,
                "start_date" : new Date(),
                "expire_date": new Date()
            });
            respondMessage.body.properties.transactionId = transaction._id;
        }
    }
    return respondMessage;
};
ClientRequests.StatusNotificationRequest = function (params){
    let mongoRespond = Collections.SCB.find({charge_point_vendor : params.chargePointVendor}).fetch();
    let respondMessage = ResponseMessages.StatusNotification();
    if(mongoRespond.length>0){
        respondMessage.body.properties.status = "Accepted";
    }
    return respondMessage;
};
ClientRequests.StopTransactionRequest = function (params){
    let mongoRespond = Collections.SCB.find({charge_point_vendor : params.chargePointVendor}).fetch();
    let respondMessage = ResponseMessages.StopTransaction();
    if(mongoRespond.length>0){
        respondMessage.body.properties.status = "Accepted";
    }
    return respondMessage;
};

export {ClientRequests};
