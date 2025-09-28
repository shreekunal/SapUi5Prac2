using {sap.capire.incidents as my} from '../db/schema';

// Service used by support personell, i.e. the incidents' 'processors'.

service ProcessorService {
    entity Incidents as projection on my.Incidents;
    entity Status    as projection on my.Status;

    @readonly
    entity Customers as projection on my.Customers;

    @cds.persistence.skip
    @odata.singleton
    entity Upload {
        excel : LargeBinary
        @Core.MediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
}

annotate ProcessorService.Incidents with @odata.draft.enabled;
annotate ProcessorService.Incidents with @odata.draft.bypass;

annotate ProcessorService.Status with @(Capabilities.Updatable: true);
// Service used by administrators to manage customers and incidents.

service AdminService {
    entity Customers as projection on my.Customers;
    entity Incidents as projection on my.Incidents;
}
