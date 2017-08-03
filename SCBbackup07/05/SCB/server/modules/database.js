/**
 * Created by Aurimas on 02/01/17.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DatabaseSchemas } from '../schemas/databaseSchemas'


let Collections = {};

if (Meteor.isServer) {
//Collections for testing
    Collections.ReserveNow = new Mongo.Collection('reserveNow');
// True Collections
    Collections.Location = new Mongo.Collection('location');
    Collections.Station = new Mongo.Collection('station');
    Collections.Transaction = new Mongo.Collection('transaction');
    Collections.OcppTag = new Mongo.Collection('ocppTag');
    Collections.SCB = new Mongo.Collection('scb');
    Collections.Reservation = new Mongo.Collection('reservation');
    Collections.Amenities = new Mongo.Collection('amenities');
    Collections.Outlets = new Mongo.Collection('outlets');
    Collections.ReverseGeocodeAddressComponents = new Mongo.Collection('reverseGeocodeAddressComponents');
    Collections.Owner = new Mongo.Collection('owner');
    Collections.Network = new Mongo.Collection('network');
    Collections.Photos = new Mongo.Collection('photos');
    Collections.Promos = new Mongo.Collection('promos');
    Collections.ValidOutlets = new Mongo.Collection('validOutlets');
    Collections.Comments = new Mongo.Collection('comments');
    Collections.ChargingSessions = new Mongo.Collection('chargingSessions');
    Collections.UsersFavLocations = new Mongo.Collection('usersFavLocations');
    Collections.UsersStats = new Mongo.Collection('usersStats');
    Collections.LocationRatings = new Mongo.Collection('locationRatings');
    Collections.Imgs = new Mongo.Collection('imgs');

    //Collections.Location.attachSchema(DatabaseSchemas.LocationSchema);
    //Collections.Station.attachSchema(DatabaseSchemas.StationSchema);
    Collections.Transaction.attachSchema(DatabaseSchemas.TransactionSchema);
    Collections.OcppTag.attachSchema(DatabaseSchemas.OcppTagSchema);
    Collections.SCB.attachSchema(DatabaseSchemas.ScbSchema);
    Collections.Reservation.attachSchema(DatabaseSchemas.ReservationSchema);
    Collections.Amenities.attachSchema(DatabaseSchemas.AmenitiesSchema);
    Collections.Outlets.attachSchema(DatabaseSchemas.OutletsSchema);
    Collections.ReverseGeocodeAddressComponents.attachSchema(DatabaseSchemas.ReverseGeocodeAddressComponentsSchema);
    Collections.Owner.attachSchema(DatabaseSchemas.OwnerSchema);
    Collections.Network.attachSchema(DatabaseSchemas.NetworkSchema);
    Collections.Photos.attachSchema(DatabaseSchemas.PhotosSchema);
    Collections.Promos.attachSchema(DatabaseSchemas.PromosSchema);
    Collections.ValidOutlets.attachSchema(DatabaseSchemas.ValidOutletsSchema);

}
export {Collections};