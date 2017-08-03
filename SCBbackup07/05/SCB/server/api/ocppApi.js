/**
 * Created by Aurimas on 11/01/17.
 */

import { Meteor } from 'meteor/meteor';
import { Collections } from '../modules/database';
import { ErrorMessages } from '../modules/Error';
import { RequestSchemas } from '../schemas/requestSchemas';
import { ClientRequests } from '../api/clientRequests';
import { Functions } from './apiFunctions';

let OcppApi;

if (Meteor.isServer) {

    OcppApi = new Restivus({
        apiPath: "ocppApi",
        version: "1_6",
        prettyJson: true
    });

    OcppApi.addRoute('Authorize', {authRequired: false}, {
        get: () => {
            return ErrorMessages.Endpoint;
        },
        post: function () {
            let validation = Functions.validateBody(this.bodyParams, RequestSchemas.Authorize);
            if(!validation.isValid()){
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else{
                return ClientRequests.AuthorizeRequest(this.bodyParams.properties.idTag);
            }
        },
        put: () => {
            return ErrorMessages.Endpoint;
        },
        delete: () => {
            return ErrorMessages.Endpoint;
        },
    });

    OcppApi.addRoute('BootNotification', {authRequired: false}, {
        post: function () {
            let validation = Functions.validateBody(this.bodyParams, RequestSchemas.BootNotification);
            if(!validation.isValid()){
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else{
                return ClientRequests.BootNotificationRequest(this.bodyParams.properties);
            }
        }
    });

    OcppApi.addRoute('DataTransfer', {authRequired: false}, {
        post: function () {
            let validation = Functions.validateBody(this.bodyParams, RequestSchemas.DataTransfer);
            if(!validation.isValid()){
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else{
                return ClientRequests.DataTransferRequest(this.bodyParams.properties);
            }
        }
    });

    OcppApi.addRoute('DiagnosticsStatusNotification', {authRequired: false}, {
        post: function () {
            let validation = Functions.validateBody(this.bodyParams, RequestSchemas.DiagnosticsStatusNotification);
            if(!validation.isValid()){
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else{
                return ClientRequests.DiagnosticsStatusNotificationRequest(this.bodyParams.properties);
            }
        }
    });

    OcppApi.addRoute('FirmwareStatusNotification', {authRequired: false}, {
        post: function () {
            let validation = Functions.validateBody(this.bodyParams, RequestSchemas.FirmwareStatusNotification);
            if(!validation.isValid()){
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else{
                return ClientRequests.FirmwareStatusNotificationRequest(this.bodyParams.properties);
            }
        }
    });

    OcppApi.addRoute('Heartbeat', {authRequired: false}, {
        post: function () {
            let validation = Functions.validateBody(this.bodyParams, RequestSchemas.Heartbeat);
            if(!validation.isValid()){
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else{
                return ClientRequests.HeartbeatRequest();
            }
        }
    });

    OcppApi.addRoute('MeterValues', {authRequired: false}, {
        post: function () {
            let validation = Functions.validateBody(this.bodyParams, RequestSchemas.MeterValues);
            if(!validation.isValid()){
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else{
                //return ClientRequests.MeterValuesRequest(this.bodyParams.properties);
            }
        }
    });

    OcppApi.addRoute('StartTransaction', {authRequired: false}, {
        post: function () {
            let validation = Functions.validateBody(this.bodyParams, RequestSchemas.StartTransaction);
            if(!validation.isValid()){
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else{
                //return ClientRequests.StartTransactionRequest(this.bodyParams.properties);
            }
        }
    });

    OcppApi.addRoute('StatusNotification', {authRequired: false}, {
        post: function () {
            let validation = Functions.validateBody(this.bodyParams, RequestSchemas.StatusNotification);
            if(!validation.isValid()){
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else{
                //return ClientRequests.StatusNotificationRequest(this.bodyParams.properties);
            }
        }
    });

    OcppApi.addRoute('StopTransaction', {authRequired: false}, {
        post: function () {
            let validation = Functions.validateBody(this.bodyParams, RequestSchemas.StopTransaction);
            if(!validation.isValid()){
                return ErrorMessages.InvalidSchema(validation.invalidKeys(), "this.bodyParams");
            }
            else{
                //return ClientRequests.StopTransactionRequest(this.bodyParams.properties);
            }
        }
    });
}

export { OcppApi }
