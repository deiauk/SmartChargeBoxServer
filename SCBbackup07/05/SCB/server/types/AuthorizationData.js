/**
 * Created by Aurimas on 08/01/17.
 */
import {Enumerations} from "./Enumerations"
class AuthorizationData {
    constructor(identifier){
        this.idTag = new IdToken(identifier);
        this.idTagInfo;
    }
}
class IdToken{
    constructor(identifier){
        if(identifier.length()<=20 && identifier.length() >0){
            this.IdToken = identifier.toLocaleLowerCase();
        }
        else{
            this.IdToken = null;
        }
    }
}
class IdTagInfo{
    constructor(date, parentIdTag, status){
        this.expireDate = date;
        this.parentIdTag = parentIdTag;
        this.status = status;
    }
}

