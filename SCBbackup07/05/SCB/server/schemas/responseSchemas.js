/**
 * Created by Aurimas on 02/01/17.
 */
let ResponseSchemas = {};

    ResponseSchemas.Authorize = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['AuthorizeResponse']
        },
        "properties": {
            type: Object
        },
        "properties.idTagInfo": {
            type: Object
        },
        "properties.idTagInfo.status": {
            type: String,
            allowedValues: ["Accepted",
                "Blocked",
                "Expired",
                "Invalid",
                "ConcurrentTx"]
        },
        "properties.idTagInfo.expiryDate": {
            type: Date,
            autoValue: function (){
                if (this.isSet && new Date(this.value) != null) {
                    return new Date(this.value);
                }
                else return this.unset();
            },
            optional: true
        },
        "properties.idTagInfo.parentIdTag": {
            type: String,
            max: 20,
            optional: true
        }
    });

    ResponseSchemas.BootNotification = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['BootNotificationResponse']
        },
        "properties": {
            type: Object,
        },
        "properties.status": {
            type: String,
            allowedValues: [
                "Accepted",
                "Pending",
                "Rejected"
            ]
        },
        "properties.currentTime": {
            type: Date,
            autoValue: function (){
                if (this.isSet && new Date(this.value) != null) {
                    return new Date(this.value);
                }
                else return this.unset();
            }
        },
        "properties.interval": {
            type: Number,
            //is Decimal
        }
    });

    ResponseSchemas.DataTransfer = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['DataTransferResponse']
        },
        "properties": {
            type: Object,
        },
        "properties.status": {
            type: String,
            allowedValues: [
                "Accepted",
                "Rejected",
                "UnknownMessageId",
                "UnknownVendorId"
            ]
        },
        "properties.data": {
            type: String,
            optional: true
        }
    });

    ResponseSchemas.DiagnosticsStatusNotification = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['DiagnosticsStatusNotificationResponse']
        },
        "properties": {
            type: Object,
        }
    });

    ResponseSchemas.FirmwareStatusNotification = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['FirmwareStatusNotificationResponse']
        },
        "properties": {
            type: Object,
        }
    });

    ResponseSchemas.Heartbeat = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['HeartbeatResponse']
        },
        "properties": {
            type: Object,
        },
        "properties.currentTime": {
            type: Date
        }
    });

    ResponseSchemas.MeterValues = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['MeterValuesResponse']
        },
        "properties": {
            type: Object,
        }
    });

    ResponseSchemas.StartTransaction = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['StartTransactionResponse']
        },
        "properties": {
            type: Object,
        },
        "properties.idTagInfo": {
            type: Object
        },
            "properties.idTagInfo.properties": {
                type: Object
            },
                "properties.idTagInfo.properties.expiryDate": {
                    type: Date,
                    autoValue: function (){
                        if (this.isSet && new Date(this.value) != null) {
                            return new Date(this.value);
                        }
                        else return this.unset();
                    },
                    optional: true
                },
                "properties.idTagInfo.properties.parentIdTag": {
                    type: String,
                    max: 20,
                    optional: true
                },
                "properties.idTagInfo.properties.status": {
                    type: String,
                    allowedValues: [
                        "Accepted",
                        "Blocked",
                        "Expired",
                        "Invalid",
                        "ConcurrentTx"
                    ]
                },
        "properties.transactionId": {
            type: Number
        }
    });

    ResponseSchemas.StatusNotification = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['StatusNotificationResponse']
        },
        "properties": {
            type: Object,
        }
    });

    ResponseSchemas.StopTransaction = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['StopTransactionResponse']
        },
        "properties": {
            type: Object,
        },
        "properties.idTagInfo": {
            type: Object,
        },
            "properties.idTagInfo.properties": {
                type: Object
            },
                "properties.idTagInfo.properties.expiryDate": {
                    type: Date,
                    autoValue: function (){
                        if (this.isSet && new Date(this.value) != null) {
                            return new Date(this.value);
                        }
                        else return this.unset();
                    },
                    optional: true
                },
                "properties.idTagInfo.properties.parentIdTag": {
                    type: String,
                    max: 20,
                    optional: true
                },
                "properties.idTagInfo.properties.status": {
                    type: String,
                    allowedValues: [
                        "Accepted",
                        "Blocked",
                        "Expired",
                        "Invalid",
                        "ConcurrentTx"
                    ]
                }
    });

export {ResponseSchemas};