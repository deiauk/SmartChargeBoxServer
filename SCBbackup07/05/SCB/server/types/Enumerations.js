/**
 * Created by Aurimas on 08/01/17.
 */

let Enumerations = {};
Enumerations.AuthorizationStatus = ["Accepted", "Blocked", "Expired", "Invalid", "ConcurrentTx"];
Enumerations.AvailabilityStatus = ["Accepted", "Rejected", "Scheduled"];
Enumerations.AvailabilityType = ["Inoperative", "Operative"];
Enumerations.CancelReservationStatus = ["Accepted", "Rejected"];
Enumerations.ChargePointErrorCode = ["ConnectorLockFailure", "EVCommunicationError", "GroundFailure", "HighTemperature",
    "InternalError", "LocalListConflict", "NoError", "OtherError", "OverCurrentFailure", "OverVoltage", "PowerMeterFailure",
    "PowerSwitchFailure", "ReaderFailure", "ReaderFailure", "ResetFailure", "UnderVoltage", "WeakSignal"];

Enumerations.ChargePointStatus = ["Available", "Preparing", "Charging", "SuspendedEVSE", "SuspendedEV", "Finishing", "Reserved",
    "Unavailable", "Faulted"];
Enumerations.ChargingProfileKindType = ["Absolute", "Recurring", "Relative"];
Enumerations.ChargingProfilePurposeType = ["ChargePointMaxProfile", "TxDefaultProfile", "TxProfile"];
Enumerations.ChargingProfileStatus = ["Accepted", "Rejected", "NotSupported"];
Enumerations.ChargingRateUnitType = ["W", "A"];
Enumerations.ClearCacheStatus = ["Accepted", "Rejected"];
Enumerations.ClearChargingProfileStatus = ["Accepted", "Unknown"];
Enumerations.ConfigurationStatus = ["Accepted", "Rejected", "RebootRequired", "NotSupported"];
Enumerations.DataTransferStatus = ["Accepted", "Rejected", "UnknownMessageId", "UnknownVendorId"];
Enumerations.DiagnosticsStatus = ["Idle", "Uploaded", "UploadFailed", "Uploading"];
Enumerations.FirmwareStatus = ["Downloaded", "DownloadFailed", "Downloading", "Idle", "InstallationFailed", "Installing", "Installed"];
Enumerations.GetCompositeScheduleStatus = ["Accepted", "Rejected"];
Enumerations.Location = ["Body", "Cable", "EV", "Inlet", "Outlet"];
Enumerations.Measurand = ["Current.Export", "Current.Import", "Current.Offered", "Energy.Active.Export.Register",
    "Energy.Active.Import.Register", "Energy.Reactive.Export.Register", "Energy.Reactive.Import.Register", "Energy.Active.Export.Interval",
    "Energy.Active.Import.Interval", "Energy.Reactive.Export.Interval", "Energy.Reactive.Import.Interval", "Frequency",
    "Power.Active.Export", "Power.Active.Import", "Power.Factor", "Power.Offered", "Power.Reactive.Export",
    "Power.Reactive.Import", "RPM", "SoC", "Temperature", "Voltage"];
Enumerations.MessageTrigger = ["BootNotification", "DiagnosticsStatusNotification", "FirmwareStatusNotification", "Heartbeat",
    "MeterValues", "StatusNotification"];
Enumerations.Phase = ["L1", "L2", "L3", "N", "L1-N", "L2-N","L3-N", "L1-L2", "L2-L3", "L3-L1"];
Enumerations.ReadingContext = ["Interruption.Begin", "Interruption.End", "Other", "Sample.Clock",
    "Sample.Periodic", "Transaction.Begin","Transaction.End", "Trigger"];
//Need to end
export {Enumerations};
