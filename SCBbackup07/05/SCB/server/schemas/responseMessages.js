/**
 * Created by Aurimas on 09/01/17.
 */

import { Enumerations } from '../types/Enumerations'

let ResponseMessages = {};

ResponseMessages.Authorize = () => {
    return {
        'statusCode': 200,
        "title": "AuthorizeResponse",
        "body": {
            "title" : "AuthorizeResponse",
            "properties": {
                "idTagInfo": {
                    "status": Enumerations.AuthorizationStatus[3]
                }
            }
        }
    };
};

ResponseMessages.BootNotification = () => {
    return {
        'statusCode': 200,
        "title": "BootNotificationResponse",
        "body": {
            "title" : "BootNotificationResponse",
            "properties": {
                "status": "Rejected",
                "currentTime": new Date(),
                "interval" : 100000
            }
        }
    };
};

ResponseMessages.DataTransfer = () => {
    return {
        'statusCode': 200,
        "title": "BootNotificationResponse",
        "body": {
            "title" : "BootNotificationResponse",
            "properties": {
                "status": Enumerations.DataTransferStatus[3]
            }
        }
    };
};

ResponseMessages.DiagnosticsStatusNotification = () => {
    return {
        'statusCode': 200,
        "title": "DiagnosticsStatusNotificationResponse",
        "body": {
            "title" : "DiagnosticsStatusNotificationResponse",
            "properties": {
            }
        }
    };
};

ResponseMessages.FirmwareStatusNotification = () => {
    return {
        'statusCode': 200,
        "title": "FirmwareStatusNotificationResponse",
        "body": {
            "title" : "FirmwareStatusNotificationResponse",
            "properties": {
            }
        }
    };
};

ResponseMessages.Heartbeat = () => {
    return {
        'statusCode': 200,
        "title": "HeartbeatResponse",
        "body": {
            "title" : "HeartbeatResponse",
            "properties": {
                "currentTime": new Date()
            }
        }
    };
};

ResponseMessages.MeterValues = () => {
    return {
        'statusCode': 200,
        "title": "MeterValuesResponse",
        "body": {
            "title" : "MeterValuesResponse",
            "properties": {
            }
        }
    };
};
ResponseMessages.StartTransaction = () => {
    return {
        'statusCode': 200,
        "title": "StartTransactionResponse",
        "body": {
            "title" : "StartTransactionResponse",
            "properties": {
                "idTagInfo": {
                    "properties" : {
                        "status" :  "Invalid",
                    }
                },
                "transactionId": 0 //need to investigate
            }
        }
    };
};
ResponseMessages.StatusNotification = () => {
    return {
        'statusCode': 200,
        "title": "StatusNotificationResponse",
        "body": {
            "title" : "StatusNotificationResponse",
            "properties": {
            }
        }
    };
};
ResponseMessages.StopTransaction = () => {
    return {
        'statusCode': 200,
        "title": "StopTransactionResponse",
        "body": {
            "properties": {
                "idTagInfo": {
                    "properties" : {
                        "status" :  "Invalid",
                    }
                }
            }
        }
    };
};



export {ResponseMessages};