using {
    cuid,
    managed
} from '@sap/cds/common';

namespace my.company;

entity Products : cuid, managed {
    key ProductID       : Int32;
        ProductName     : String(40)     @mandatory;
        SupplierID      : Int32;
        category        : Association to Categories;
        QuantityPerUnit : String(20)     @mandatory;
        UnitPrice       : Decimal(19, 4) @mandatory;
        UnitsInStock    : Int16          @mandatory;
        UnitsOnOrder    : Int16          @mandatory;
        ReorderLevel    : Int16          @mandatory;
        Discontinued    : Boolean        @mandatory default false;
        Image           : LargeBinary; // Added Image field for product

        suppliers       : Composition of many Suppliers
                              on suppliers.product = $self;

        attachments     : Composition of many ProductAttachments
                              on attachments.product = $self;
}

entity Categories : managed {
    key CategoryID   : Int32;
        CategoryName : String(100) @mandatory;
        Description  : String(500);

        products     : Association to many Products
                           on products.category = $self;
}

entity Suppliers : cuid, managed {
    key SupplierID   : Int32;
        CompanyName  : String(100) @mandatory;
        ContactName  : String(100) @mandatory;
        ContactTitle : String(50);
        Address      : String(200);
        City         : String(50);
        Region       : String(50);
        PostalCode   : String(20);
        Country      : String(50);
        Phone        : String(30);
        Fax          : String(30);
        HomePage     : String(200);

        product      : Association to Products;
}

entity ProductAttachments : cuid, managed {
    key ID       : UUID;
        fileName : String(200) @mandatory;
        mimeType : String(100);
        fileSize : Integer64;
        content  : LargeBinary; // actual image or file
        product  : Association to Products;
}
