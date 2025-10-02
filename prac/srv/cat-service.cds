using my.company as my from '../db/schema';

service CatalogService {
    @readonly
    entity Products           as projection on my.Products;

    @readonly
    entity Suppliers          as projection on my.Suppliers;

    @readonly
    entity ProductAttachments as projection on my.ProductAttachments;

    @readonly
    entity Categories         as projection on my.Categories;
}

annotate CatalogService.Products with @odata.draft.enabled;
