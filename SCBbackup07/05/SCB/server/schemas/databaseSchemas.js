/**
 * Created by Aurimas on 02/01/17.
 */

let DatabaseSchemas = {};

DatabaseSchemas.LocationSchema = new SimpleSchema({
    state: {
        type: Number,
        label: "State",
        optional: true
    },
    locale: {
        type: String,
        label: "Locale",
        max: 20
    },
    cost: {
        type: Number,
        label: "Cost"
    },
    pwps_version: {
        type: Number,
        label: "pwps_version"
    },
    opening_date: {
        type: String,
        label: "Openining date"
    },
    cost_description: {
        type: String,
        label: "Cost description",
        optional: true
    },
    confidence: {
        type: Number,
        label: "Confidence"
    },
    payment_enabled: {
        type: String,
        label: "Payment enabled",
        optional: true
    },
    access: {
        type: Number,
        label: "Access"
    },
    reverse_geocode_address: {
        type: String,
        label: "Reverse geocode address",
        optional: true
    },
    score: {
        type: Number,
        label: "Score"
    },
    latitude: {
        type: Number,
        label: "Latitude",
        decimal: true
    },
    longitude: {
        type: Number,
        label: "Longitude",
        decimal: true
    },
    open247: {
        type: Number,
        label: "Open247"
    },
    custom_ports: {
        type: String,
        label: "Custom ports"
    },
    nissan_nctc: {
        type: Number,
        label: "Nissan nctc"
    },
    name: {
        type: String,
        label: "Name",
    },
    hours: {
        type: String,
        label: "Hours",
        max: 10,
        optional: true
    },
    phone: {
        type: String,
        label: "Phone",
        max: 15,
        optional: true
    },
    address: {
        type: String,
        label: "Address"
    },
    description: {
        type: String,
        label: "Description"
    },
    recargo_id: {
        type: Number,
        label: "Recargo id"
    },
    parking_type_name: {
        type: String,
        label: "Parking type name",
        max: 30,
        optional: true
    },
    locked: {
        type: Number,
        label: "Locked"
    },
    enabled: {
        type: Number,
        label: "Enaled"
    },
    icon: {
        type: String,
        label: "Icon"
    },
    icon_type: {
        type: String,
        label: "Icon type"
    },
    url: {
        type: String,
        label: "URL"
    },
    coming_soon: {
        type: String,
        label: "coming_soon",
        optional: true
    },
    poi_name: {
        type: String,
        label: "poi_name",
        optional: true
    },
    usage_availability:{
        type: String,
        label: "usage_availability",
        optional: true
    },
    usage_offline: {
        type: String,
        label: "usage_offline",
        optional: true
    },
    operator_message_created_at:{
        type: String,
        label: "operator_message_created_at",
        optional: true
    },
    operator_message_expiration:{
        type: String,
        label: "operator_message_expiration",
        optional: true
    },
    operator_message:{
        type: String,
        label: "operator_message",
        optional: true
    },
    created_at: {
        type: Date,
        label: "Created at",
    },
    updated_at: {
        type: Date,
        label: "Updated at"
    }
});

DatabaseSchemas.AmenitiesSchema = new SimpleSchema({
    location_id:{
        type: Mongo.ObjectID,
        label: "Location id"
    },
    type:{
        type: Number,
        label: "Type"
    }
});

DatabaseSchemas.StationSchema = new SimpleSchema({
    volts:{
        type: String,
        label: "Volts"
    },
    network_ext_id:{
        type: String,
        label: "Network ext id"
    },
    qr_enabled:{
        type: String,
        label: "Qr enabled"
    },
    cost:{
        type: Meteor.Integer,
        label: "Cost"
    },
    pwps_version:{
        type: Meteor.Integer,
        label: "Pwps version"
    },
    location_id:{
        type: Meteor.Integer,
        label: "Location id"
    },
    cost_description:{
        type: String,
        label: "Cost description"
    },
    pre_charge_instructions:{
        type: String,
        label: "Pre charge instructions"
    },
    nissan_nctc:{
        type: Meteor.Integer,
        label: "Nissan nctc"
    },
    payment_enabled:{
        type: String,
        label: "Payment enabled"
    },
    available:{
        type: Meteor.Integer,
        label: "Available"
    },
    hours:{
        type: String,
        label: "Hours"
    },
    ocpp_version:{
        type: String,
        label: "Ocpp version"
    },
    kilowatts:{
        type: String,
        label: "Kilowatts"
    },
    requires_access_card:{
        type: Meteor.Integer,
        label: "Requires access card"
    },
    manufacturer:{
        type: String,
        label: "Manufacturer"
    },
    name:{
        type: String,
        label: "Name"
    },
    network_id:{
        type: Meteor.Integer,
        label: "Network id"
    },
    created_at:{
        type: String,
        label: "Created at"
    },
    amps:{
        type: String,
        label: "Amps"
    },
    model:{
        type: String,
        label: "Model"
    },
    latitude: {
        type: Meteor.DOUBLE,
        label: "Latitude"
    },
    longitude: {
        type: Meteor.DOUBLE,
        label: "Longitude"
    }
});

DatabaseSchemas.ReservationSchema = new SimpleSchema({
    start_date: {
        type: Date,
        label: "Time when rezervation to start"
    },
    expire_date: {
        type: Date,
        label: "Time when rezervation expires"
    },
    status :{
        type: String,
        label: "Status"
    },
    station_id:{
        type: String,
        label: "Station to reserve Id"
    },
    id_Tag :{
        type: String,
        label: "User id Tag",
        optional: true
    },
    transaction_id :{
        type: String,
        label: "Transaction id",
        optional: true
    },
    timestamp :{
        type: Date,
        label: "Reservation Data",
        optional: true
    },
    startNumber :{
        type: Number,
        label: "StartNumber",
        optional: true
    },
    chargingSessionActive: {
        type: Boolean,
        label: "Set to true when charging with this reservation",
        optional: true
    }
});

DatabaseSchemas.TransactionSchema = new SimpleSchema({
    connector_id: {
        type: String,
        label: "Connector id"
    },
    id_Tag :{
        type: String,
        label: "User id Tag",
    },
    start_timestamp: {
        type: String,
        label: "Start timestamp",
        optional: true
    },
    start_date: {
        type: Date,
        label: "Time when transaction started"
    },
    expire_timestamp: {
        type: String,
        label: "Expire timestamp",
        optional: true
    },
    expire_date: {
        type: Date,
        label: "Time when transaction stopped"
    }
});

DatabaseSchemas.ScbSchema = new SimpleSchema({
    endpoint_address :{
        type: String,
        label: "Endpoint address"
    },
    ocpp_protocol :{
        type: String,
        label: "ocpp_protocol"
    },
    charge_point_vendor :{
        type: String,
        label: "charge_point_vendor"
    },
    charge_point_model :{
        type: String,
        label: "charge_point_model"
    },
    charge_point_serial_number :{
        type: String,
        label: "charge_point_serial_number"
    },
    charge_box_serial_number :{
        type: String,
        label: "charge_box_serial_number"
    },
    fw_version :{
        type: String,
        label: "fw_version"
    },
    fw_update_status :{
        type: String,
        label: "fw_update_status"
    },
    fw_update_timestamp :{
        type: String,
        label: "fw_update_timestamp"
    },
    iccid :{
        type: String,
        label: "iccid"
    },
    imsi :{
        type: String,
        label: "imsi"
    },
    meter_type :{
        type: String,
        label: "meter_type"
    },
    meter_serial_number :{
        type: String,
        label: "meter_serial_number"
    },
    diagnostics_status :{
        type: String,
        label: "diagnostics_status"
    },
    diagnostics_timestamp :{
        type: String,
        label: "diagnostics_timestamp"
    },
    last_heartbeat_timestamp :{
        type: String,
        label: "last_heartbeat_timestamp"
    },
    description :{
        type: String,
        label: "description"
    },
    note :{
        type: String,
        label: "note"
    },
    location_latitude :{
        type: String,
        label: "location_latitude"
    },
    location_longitude :{
        type: String,
        label: "location_longitude"
    },
    address_id :{
        type: String,
        label: "address_id"
    }
});

DatabaseSchemas.OcppTagSchema = new SimpleSchema({
    id_Tag :{
        type: String,
        label: "User id Tag",
    },
    parent_id_Tag: {
        type: String,
        label: "Parent id tag",
        optional: true
    },
    expire_date: {
        type: Date,
        label: "Time when transaction stopped",
        optional: true
    },
    in_transaction: {
        type: Boolean,
        label: "In transaction",
        defaultValue: false
    },
    blocked: {
        type: Boolean,
        label: "Blocked",
        defaultValue: false
    },
    note: {
        type: String,
        label: "Note",
        optional: true
    }
});

DatabaseSchemas.OutletsSchema = new SimpleSchema({
    available: {
        type: String,
        label: "Available"
    },
    description: {
        type: String,
        label: "Description"
    },
    power: {
        type: Number,
        label: "Power"
    },
    connector: {
        type: Number,
        label: "Connector"
    },
    outlet_index: {
        type: String,
        label: "Outlet index"
    },
});

DatabaseSchemas.ReverseGeocodeAddressComponentsSchema = new SimpleSchema({
    postal_code:{
        type: String,
        label: "Postal code"
    },
    country_code:{
        type: String,
        label: "Country code"
    },
    street_number:{
        type: String,
        label: "Street number"
    },
    route:{
        type: String,
        label: "Postal code"
    },
    locality:{
        type: String,
        label: "Locality"
    },
    sublocality_1:{
        type: String,
        label: "Sublocality 1"
    },
    sublocality_2:{
        type: String,
        label: "Sublocality 2"
    },
    sublocality_3:{
        type: String,
        label: "Sublocality 3"
    },
    administrative_area_1:{
        type: String,
        label: "Administrative area 1"
    },
    administrative_area_2:{
        type: String,
        label: "Administrative area 2"
    },
    administrative_area_3:{
        type: String,
        label: "Administrative area 3"
    },
    location_id:{
        type: Mongo.ObjectID,
        label: "Location id"
    },
});

DatabaseSchemas.OwnerSchema = new SimpleSchema({
    allow_notifications:{
        type: String,
        label: "Allow notifications"
    },
    first_name:{
        type: String,
        label: "First name"
    },
    last_name:{
        type: String,
        label: "Last name"
    },
    notify_nearby_radius:{
        type: Number,
        label: "Notify nearby radius"
    },
    hide_address:{
        type: Number,
        label: "Hide address"
    },
    receive_grid_alerts:{
        type: Number,
        label: "Receive grid alerts"
    },
    vehicle_description:{
        type: String,
        label: "Vehicle description"
    },
    created_at:{
        type: String,
        label: "Created at"
    },
    vehicle_color:{
        type: Number,
        label: "Vehicle color"
    },
    phone:{
        type: String,
        label: "Phone"
    },
    email:{
        type: String,
        label: "Email"
    },
    last_login:{
        type: String,
        label: "Last login"
    },
    hide_phone:{
        type: Number,
        label: "Hide phone"
    },
    vehicle_subtype:{
        type: Number,
        label: "Vehicle subtype"
    },
    about:{
        type: String,
        label: "About"
    },
    vehicle_type:{
        type: Number,
        label: "Vehicle type"
    },
    notify_nearby:{
        type: Number,
        label: "Notify nearby"
    },
    zip_code:{
        type: String,
        label: "Zip code"
    }
});

DatabaseSchemas.NetworkSchema = new SimpleSchema({
    url:{
        type: String,
        label: "Url"
    },
    phone:{
        type: String,
        label: "Phone"
    },
    description:{
        type: String,
        label: "Description"
    },
    name:{
        type: String,
        label: "Name"
    },
    action_name:{
        type: String,
        label: "Action name",
        optional: true
    },
    action_url:{
        type: String,
        label: "Action url",
        optional: true
    },
    image:{
        type: String,
        label: "Image",
        optional: true
    }
});

DatabaseSchemas.PhotosSchema = new SimpleSchema({
    url:{
        type: String,
        label: "Url"
    },
    created_at:{
        type: String,
        label: "Created at"
    },
    thumbnail:{
        type: String,
        label: "Thumbnail"
    },
    caption:{
        type: String,
        label: "Caption"
    },
    thumbnail2x:{
        type: String,
        label: "Thumbnail2x"
    },
    order:{
        type: Number,
        label: "Order"
    }
});

DatabaseSchemas.PromosSchema = new SimpleSchema({
    link_url:{
        type: String,
        label: "Link url"
    },
    tag:{
        type: String,
        label: "Tag"
    },
    image_url:{
        type: String,
        label: "Image url"
    },
    name:{
        type: String,
        label: "Name"
    },
    link_action:{
        type: String,
        label: "Link action"
    },
    lat:{
        type: String,
        label: "Lat"
    },
    lng:{
        type: String,
        label: "Lng"
    },
    image_url_2x:{
        type: String,
        label: "Image url 2x"
    },
    app_id:{
        type: String,
        label: "App id"
    }
});

DatabaseSchemas.UserSchema = new SimpleSchema({
    ocpp_tag_id: {
        type: Mongo.ObjectID,
        label: "User's Ocpp tag",
        optional: true
    },
    allow_notifications:{
        type: String,
        label: "Allow notifications"
    },
    first_name:{
        type: String,
        label: "First name"
    },
    last_name:{
        type: String,
        label: "Last name"
    },
    birthday: {
        type: String,
        label: "Birthday"
    },
    sex: {
        type: String,
        label: "Sex"
    },
    notify_nearby_radius:{
        type: Number,
        label: "Notify nearby radius"
    },
    hide_address:{
        type: Number,
        label: "Hide address"
    },
    receive_grid_alerts:{
        type: Number,
        label: "Receive grid alerts"
    },
    vehicle_description:{
        type: String,
        label: "Vehicle description"
    },
    created_at:{
        type: String,
        label: "Created at"
    },
    vehicle_color:{
        type: Number,
        label: "Vehicle color"
    },
    phone:{
        type: String,
        label: "Phone"
    },
    email:{
        type: String,
        label: "Email"
    },
    last_login:{
        type: String,
        label: "Last login"
    },
    hide_phone:{
        type: Number,
        label: "Hide phone"
    },
    vehicle_subtype:{
        type: Number,
        label: "Vehicle subtype"
    },
    about:{
        type: String,
        label: "About"
    },
    vehicle_type:{
        type: Number,
        label: "Vehicle type"
    },
    notify_nearby:{
        type: Number,
        label: "Notify nearby"
    },
    zip_code:{
        type: String,
        label: "Zip code"
    }
});

DatabaseSchemas.ValidOutletsSchema = new SimpleSchema({
    connector: {
        type: Number,
        label: "Connector"
    },
    location_id: {
        type: Mongo.ObjectID,
        label: "Location id"
    },
    power: {
        type: Number,
        label: "Power",
        optional: true
    },
});

DatabaseSchemas.OutletsMeterValues = new SimpleSchema({
    transaction_id: {
        type: Mongo.ObjectID,
        label: "transaction_id"
    },
    outlets_id: {
        type: Mongo.ObjectID,
        label: "outlets_id"
    },
    value_timestamp: {
        type: Date,
        label: "value_timestamp"
    },
    value: {
        type: String,
        label: "value"
    },
    reading_context: {
        type: String,
        label: "reading_context",
        optional: true
    },
    form_at: {
        type: String,
        label: "form_at",
        optional: true
    },
    measurand: {
        type: String,
        label: "measurand",
        optional: true
    },
    location: {
        type: String,
        label: "location",
        optional: true
    },
    unit: {
        type: String,
        label: "unit",
        optional: true
    }
});

DatabaseSchemas.OutletsStatus = new SimpleSchema({
    outlets_id: {
        type: Mongo.ObjectID,
        label: "Connector id"
    },
    status_timestamp: {
        type: Date,
        label: "Status timestamp"
    },
    status: {
        type: String,
        label: "Status"
    },
    error_code: {
        type: String,
        label: "Error code"
    },
    error_info: {
        type: String,
        label: "Error info"
    },
    vendor_id: {
        type: String,
        label: "Vendor id"
    },
    vendor_error_code: {
        type: String,
        label: "Vendor error code"
    },
});

export {DatabaseSchemas};