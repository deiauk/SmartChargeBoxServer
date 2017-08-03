/**
 * Created by Aurimas on 08/01/17.
 */
let ErrorMessages = {};

ErrorMessages.Endpoint = {
    'statusCode': 400,
    "title" : "Missing endpoint",
    "body":  "There is no such endpoint."
};

ErrorMessages.InvalidSchema = function (invalidKeys, name) {
    return {
        'statusCode': 405,
        "title": "Invalid Schema",
        "body": {
            "message" : "Object named '" + name +
            "' does not fit schema",
            invalidKeys
        }
    }
};

export {ErrorMessages};