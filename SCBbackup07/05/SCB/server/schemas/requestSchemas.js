/**
 * Created by Aurimas on 17/11/16.
 */

let RequestSchemas = {};

    RequestSchemas.Authorize = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['AuthorizeRequest']
        },
        "properties": {
            type: Object,
        },
        "properties.idTag": {
            type: String,
            max: 20
        }
    });

    RequestSchemas.BootNotification = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['BootNotificationRequest']
        },
        "properties": {
            type: Object,
        },
        "properties.chargePointVendor": {
            type: String,
            max: 20
        },
        "properties.chargePointModel": {
            type: String,
            max: 20
        },
        "properties.chargePointSerialNumber": {
            type: String,
            max: 25,
            optional: true
        },
        "properties.chargeBoxSerialNumber": {
            type: String,
            max: 25,
            optional: true
        },
        "properties.firmwareVersion": {
            type: String,
            max: 50,
            optional: true
        },
        "properties.iccid": {
            type: String,
            max: 20,
            optional: true
        },
        "properties.imsi": {
            type: String,
            max: 20,
            optional: true
        },
        "properties.meterType": {
            type: String,
            max: 25,
            optional: true
        },
        "properties.meterSerialNumber": {
            type: String,
            max: 25,
            optional: true
        }
    });

    RequestSchemas.DataTransfer = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['DataTransferRequest']
        },
        "properties": {
            type: Object,
        },
        "properties.vendorId": {
            type: String,
            max: 255
        },
        "properties.messageId": {
            type: String,
            max: 50,
            optional: true
        },
        "properties.data": {
            type: String,
            optional: true
        }
    });

    RequestSchemas.DiagnosticsStatusNotification = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['DiagnosticsStatusNotificationRequest']
        },
        "properties": {
            type: Object,
        },
            "properties.status": {
                type: String,
                allowedValues: [
                    "Idle",
                    "Uploaded",
                    "UploadFailed",
                    "Uploading"
                ]
            }
    });

    RequestSchemas.FirmwareStatusNotification = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['FirmwareStatusNotificationRequest']
        },
        "properties": {
            type: Object,
        },
            "properties.status": {
                type: String,
                allowedValues: [
                    "Downloaded",
                    "DownloadFailed",
                    "Downloading",
                    "Idle",
                    "InstallationFailed",
                    "Installing",
                    "Installed"
                ]
            }
    });

    RequestSchemas.Heartbeat = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['HeartbeatRequest']
        },
        "properties": {
            type: Object,
        }
    });

    RequestSchemas.MeterValues = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['MeterValuesRequest']
        },
        "properties": {
            type: Object,
        },
        "properties.connectorId": {
            type: Number
        },
        "properties.transactionId": {
            type: Number
        },
        "properties.meterValue": {
            type: [Object]
        },
            "properties.meterValue.$.items": {
                type: Object
            },
                "properties.meterValue.$.items.properties": {
                     type: Object
                },
                    "properties.meterValue.$.items.properties.timestamp": {
                        type: Date,
                        autoValue: function (){
                            if (this.isSet && new Date(this.value) != null) {
                                return new Date(this.value);
                            }
                            else return this.unset();
                        }

                    },
                    "properties.meterValue.$.items.properties.sampledValue": {
                        type: [Object]
                    },
                        "properties.meterValue.$.items.properties.sampledValue.$.items": {
                            type: Object
                        },
                        "properties.meterValue.$.items.properties.sampledValue.$.items.properties": {
                            type: Object
                        },
                                "properties.meterValue.$.items.properties.sampledValue.$.items.properties.value": {
                                    type: String
                                },
                                "properties.meterValue.$.items.properties.sampledValue.$.items.properties.context": {
                                    type: String,
                                    allowedValues: [
                                        "Interruption.Begin",
                                        "Interruption.End",
                                        "Sample.Clock",
                                        "Sample.Periodic",
                                        "Transaction.Begin",
                                        "Transaction.End",
                                        "Trigger",
                                        "Other"
                                    ],
                                    optional: true
                                },
                                "properties.meterValue.$.items.properties.sampledValue.$.items.properties.format": {
                                    type: String,
                                    allowedValues: [
                                        "Raw",
                                        "SignedData"
                                    ],
                                    optional: true
                                },
                                "properties.meterValue.$.items.properties.sampledValue.$.items.properties.measurand": {
                                    type: String,
                                    allowedValues: [
                                        "Energy.Active.Export.Register",
                                        "Energy.Active.Import.Register",
                                        "Energy.Reactive.Export.Register",
                                        "Energy.Reactive.Import.Register",
                                        "Energy.Active.Export.Interval",
                                        "Energy.Active.Import.Interval",
                                        "Energy.Reactive.Export.Interval",
                                        "Energy.Reactive.Import.Interval",
                                        "Power.Active.Export",
                                        "Power.Active.Import",
                                        "Power.Offered",
                                        "Power.Reactive.Export",
                                        "Power.Reactive.Import",
                                        "Power.Factor",
                                        "Current.Import",
                                        "Current.Export",
                                        "Current.Offered",
                                        "Voltage",
                                        "Frequency",
                                        "Temperature",
                                        "SoC",
                                        "RPM"
                                    ],
                                    optional: true
                                },
                                "properties.meterValue.$.items.properties.sampledValue.$.items.properties.phase": {
                                    type: String,
                                    allowedValues: [
                                        "L1",
                                        "L2",
                                        "L3",
                                        "N",
                                        "L1-N",
                                        "L2-N",
                                        "L3-N",
                                        "L1-L2",
                                        "L2-L3",
                                        "L3-L1"
                                    ],
                                    optional: true
                                },
                                "properties.meterValue.$.items.properties.sampledValue.$.items.properties.location": {
                                    type: String,
                                    allowedValues: [
                                        "Cable",
                                        "EV",
                                        "Inlet",
                                        "Outlet",
                                        "Body"
                                    ],
                                    optional: true
                                },
                                "properties.meterValue.$.items.properties.sampledValue.$.items.properties.unit": {
                                    type: String,
                                    allowedValues: [
                                        "Wh",
                                        "kWh",
                                        "varh",
                                        "kvarh",
                                        "W",
                                        "kW",
                                        "VA",
                                        "kVA",
                                        "var",
                                        "kvar",
                                        "A",
                                        "V",
                                        "K",
                                        "Celcius",
                                        "Fahrenheit",
                                        "Percent"
                                    ],
                                    optional: true
                                }
    }); // Is this fits the true schema??

    RequestSchemas.StartTransaction = new SimpleSchema({
    "title": {
        type: String,
        label: "title",
        allowedValues: ['StartTransactionRequest']
    },
    "properties": {
        type: Object,
    },
    "properties.connectorId": {
        type: Number
    },
    "properties.idTag": {
        type: String,
        max: 20
    },
    "properties.meterStart": {
        type: Number
    },
    "properties.reservationId": {
        type: Number,
        optional: true
    },
    "properties.timestamp": {
        type: Date,
        autoValue: function (){
            if (this.isSet && new Date(this.value) != null) {
                return new Date(this.value);
            }
            else return this.unset();
        },
    }
});

    RequestSchemas.StatusNotification = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['StatusNotificationRequest']
        },
        "properties": {
            type: Object,
        },
        "properties.connectorId": {
            type: Number
        },
        "properties.errorCode": {
            type: String,
            allowedValues: [
                "ConnectorLockFailure",
                "EVCommunicationError",
                "GroundFailure",
                "HighTemperature",
                "InternalError",
                "LocalListConflict",
                "NoError",
                "OtherError",
                "OverCurrentFailure",
                "PowerMeterFailure",
                "PowerSwitchFailure",
                "ReaderFailure",
                "ResetFailure",
                "UnderVoltage",
                "OverVoltage",
                "WeakSignal"
            ]
        },
        "properties.info": {
            type: String,
            max: 50,
            optional: true
        },
        "properties.status": {
            type: String,
            allowedValues: [
                "Available",
                "Preparing",
                "Charging",
                "SuspendedEVSE",
                "SuspendedEV",
                "Finishing",
                "Reserved",
                "Unavailable",
                "Faulted"
            ]
        },
        "properties.timestamp": {
            type: Date,
            autoValue: function (){
                if (this.isSet && new Date(this.value) != null) {
                    return new Date(this.value);
                }
                else return this.unset();
            },
            optional: true
        },
        "properties.vendorId": {
            type: String,
            max: 255,
            optional: true
        },
        "properties.vendorErrorCode": {
            type: String,
            max: 50,
            optional: true
        }
    });

    RequestSchemas.StopTransaction = new SimpleSchema({
    "title": {
        type: String,
        label: "title",
        allowedValues: ['StopTransactionRequest']
    },
    "properties": {
        type: Object,
    },
    "properties.idTag": {
        type: String,
        max: 20
    },
    "properties.meterStop": {
        type: Number
    },
    "properties.timestamp": {
        type: Date,
        autoValue: function (){
            if (this.isSet && new Date(this.value) != null) {
                return new Date(this.value);
            }
            else return this.unset();
        },
    },
    "properties.transactionId": {
        type: Number
    },
    "properties.reason": {
        type: String,
        allowedValues: [
            "EmergencyStop",
            "EVDisconnected",
            "HardReset",
            "Local",
            "Other",
            "PowerLoss",
            "Reboot",
            "Remote",
            "SoftReset",
            "UnlockCommand",
            "DeAuthorized"
        ]
    },
    "properties.transactionData": {
        type: [Object],
    },
        "properties.transactionData.$.items": {
            type: Object,
        },
            "properties.transactionData.$.items.properties": {
                type: Object,
            },
                "properties.transactionData.$.items.properties.timestamp": {
                    type: Date,
                    autoValue: function (){
                        if (this.isSet && new Date(this.value) != null) {
                            return new Date(this.value);
                        }
                        else return this.unset();
                    },
                },
                "properties.transactionData.$.items.properties.sampledValue": {
                    type: [Object],
                },
                    "properties.transactionData.$.items.properties.sampledValue.$.items": {
                        type: Object,
                    },
                        "properties.transactionData.$.items.properties.sampledValue.$.items.properties": {
                            type: Object,
                        },
                            "properties.transactionData.$.items.properties.sampledValue.$.items.properties.value": {
                                type: String
                            },
                            "properties.transactionData.$.items.properties.sampledValue.$.items.properties.context": {
                                type: String,
                                allowedValues: [
                                    "Interruption.Begin",
                                    "Interruption.End",
                                    "Sample.Clock",
                                    "Sample.Periodic",
                                    "Transaction.Begin",
                                    "Transaction.End",
                                    "Trigger",
                                    "Other"
                                ],
                                optional: true
                            },
                            "properties.transactionData.$.items.properties.sampledValue.$.items.properties.format": {
                                type: String,
                                allowedValues: [
                                    "Raw",
                                    "SignedData"
                                ],
                                optional: true
                            },
                            "properties.transactionData.$.items.properties.sampledValue.$.items.properties.measurand": {
                                type: String,
                                allowedValues: [
                                    "Energy.Active.Export.Register",
                                    "Energy.Active.Import.Register",
                                    "Energy.Reactive.Export.Register",
                                    "Energy.Reactive.Import.Register",
                                    "Energy.Active.Export.Interval",
                                    "Energy.Active.Import.Interval",
                                    "Energy.Reactive.Export.Interval",
                                    "Energy.Reactive.Import.Interval",
                                    "Power.Active.Export",
                                    "Power.Active.Import",
                                    "Power.Offered",
                                    "Power.Reactive.Export",
                                    "Power.Reactive.Import",
                                    "Power.Factor",
                                    "Current.Import",
                                    "Current.Export",
                                    "Current.Offered",
                                    "Voltage",
                                    "Frequency",
                                    "Temperature",
                                    "SoC",
                                    "RPM"
                                ],
                                optional: true
                            },
                            "properties.transactionData.$.items.properties.sampledValue.$.items.properties.phase": {
                                type: String,
                                allowedValues: [
                                    "L1",
                                    "L2",
                                    "L3",
                                    "N",
                                    "L1-N",
                                    "L2-N",
                                    "L3-N",
                                    "L1-L2",
                                    "L2-L3",
                                    "L3-L1"
                                ],
                                optional: true
                            },
                            "properties.transactionData.$.items.properties.sampledValue.$.items.properties.location": {
                                type: String,
                                allowedValues: [
                                    "Cable",
                                    "EV",
                                    "Inlet",
                                    "Outlet",
                                    "Body"
                                ],
                                optional: true
                            },
                            "properties.transactionData.$.items.properties.sampledValue.$.items.properties.unit": {
                                type: String,
                                allowedValues: [
                                    "Wh",
                                    "kWh",
                                    "varh",
                                    "kvarh",
                                    "W",
                                    "kW",
                                    "VA",
                                    "kVA",
                                    "var",
                                    "kvar",
                                    "A",
                                    "V",
                                    "K",
                                    "Celcius",
                                    "Fahrenheit",
                                    "Percent"
                                ],
                                optional: true
                            }
});// Is this fits the true schema??

    RequestSchemas.ReserveNowSchema = new SimpleSchema({
        "title": {
            type: String,
            label: "title",
            allowedValues: ['ReserveNowRequest']
        },
        "properties": {
            type: Object,
        },
        "properties.connectorId": {
            type: Number,
            label: "connectorId"
        },
        "properties.expiryDate": {
            type: Date,
            autoValue: function (){
                if (this.isSet && new Date(this.value) != null) {
                    return new Date(this.value);
                }
                else return this.unset();
            },
            label: "expiryDate"
        },
        "properties.idTag": {
            type: String,
            label: "idTag",
            max: 20
        },
        "properties.parentIdTag": {
            type: String,
            label: "parentIdTag",
            max: 20
        },
        "properties.reservationId": {
            type: Number,
            label: "reservationId"
        },
        "required":{
            type: String,
                allowedValues: [
                "connectorId",
                "expiryDate",
                "idTag",
                "reservationId"
            ]
        }
     });

export {RequestSchemas} ;
