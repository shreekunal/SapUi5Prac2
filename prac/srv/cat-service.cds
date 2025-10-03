using my.company as my from '../db/schema';

service CatalogService {
    entity Products           as projection on my.Products;
    entity Suppliers          as projection on my.Suppliers;
    entity ProductAttachments as projection on my.ProductAttachments;
    entity Categories         as projection on my.Categories;
    entity Countries          as projection on my.Countries;
    entity Regions            as projection on my.Regions;
}

annotate CatalogService.Products with @odata.draft.enabled;
// annotate CatalogService.Suppliers with @odata.draft.enabled;
// annotate CatalogService.ProductAttachments with @odata.draft.enabled;
annotate CatalogService.Categories with @odata.draft.enabled;
