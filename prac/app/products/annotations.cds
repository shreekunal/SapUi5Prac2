using CatalogService as service from '../../srv/cat-service';

annotate service.Products with @(
    UI.DeleteHidden              : true,
    odata.draft.bypass           : true,
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type            : 'UI.DataField',
                Label            : '{i18n>ProductName}',
                Value            : ProductName,
                ![@UI.Importance]: #High,
            },
            {
                $Type            : 'UI.DataField',
                Label            : '{i18n>Category}',
                Value            : category_ID,
                ![@UI.Importance]: #High,
            },
            {
                $Type            : 'UI.DataField',
                Label            : '{i18n>QuantityPerUnit}',
                Value            : QuantityPerUnit,
                ![@UI.Importance]: #High,
            },
            {
                $Type            : 'UI.DataField',
                Label            : '{i18n>UnitPrice}',
                Value            : UnitPrice,
                ![@UI.Importance]: #High,
            },
            {
                $Type            : 'UI.DataField',
                Label            : 'Units In Stock',
                Value            : UnitsInStock,
                ![@UI.Importance]: #High,
            },
            {
                $Type            : 'UI.DataField',
                Label            : '{i18n>UnitsOnOrder}',
                Value            : UnitsOnOrder,
                ![@UI.Importance]: #High,
            },
            {
                $Type            : 'UI.DataField',
                Label            : '{i18n>ReorderLevel}',
                Value            : ReorderLevel,
                ![@UI.Importance]: #High,
            },
            {
                $Type            : 'UI.DataField',
                Label            : '{i18n>Discontinued}',
                Value            : Discontinued,
                ![@UI.Importance]: #High,
            },
            {
                $Type            : 'UI.DataField',
                Label            : '{i18n>ProductImage}',
                Value            : image,
                ![@UI.Importance]: #High,
            },
        ],
    },
    UI.FieldGroup #ImageGroup    : {
        $Type: 'UI.FieldGroupType',
        Data : [{
            $Type            : 'UI.DataField',
            Label            : '{i18n>ProductImage}',
            Value            : image,
            ![@UI.Importance]: #High,
        }, ],
    },
    UI.DataPoint #stockChart     : {
        $Type        : 'UI.DataPointType',
        Value        : UnitsInStock,
        TargetValue  : 50,
        ForecastValue: UnitsOnOrder,
        Criticality  : stockCriticality,
    },
    UI.Chart #stockChart         : {
        $Type            : 'UI.ChartDefinitionType',
        Title            : 'Stock Level',
        Description      : 'Stock Micro Chart',
        ChartType        : #Bullet,
        Measures         : [UnitsInStock],
        MeasureAttributes: [{
            $Type    : 'UI.ChartMeasureAttributeType',
            Measure  : UnitsInStock,
            Role     : #Axis1,
            DataPoint: '@UI.DataPoint#stockChart',
        }]
    },
    UI.Facets                    : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : '{i18n>GeneralInformation}',
            Target: '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'SuppliersFacet',
            Label : 'Suppliers',
            Target: 'suppliers/@UI.LineItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'AttachmentsFacet',
            Label : 'Attachments',
            Target: 'attachments/@UI.LineItem',
        },
    ],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Label: '{i18n>ProductId}',
            Value: ProductID,
        },
        {
            $Type            : 'UI.DataField',
            Value            : image,
            Label            : '{i18n>Image}',
            ![@UI.Importance]: #High,
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>ProductName}',
            Value: ProductName,
        },
        {
            $Type : 'UI.DataField',
            Value : UnitsInStock,
            Label : '{i18n>Stocks}',
        },
        {
            $Type : 'UI.DataFieldForAnnotation',
            Target: '@UI.Chart#stockChart',
            Label : '{i18n>StockChart}',
        },
        {
            $Type: 'UI.DataField',
            Value: category.CategoryName,
            Label: '{i18n>CategoryName}',
        },
        {
            $Type: 'UI.DataField',
            Value: UnitPrice,
            Label: '{i18n>UnitPrice}',
        },
        {
            $Type: 'UI.DataField',
            Value: Discontinued,
            Label: '{i18n>Discontinued}',
        },
        {
            $Type      : 'UI.DataField',
            Value      : UnitsOnOrder,
            Label      : '{i18n>Order}',
            Criticality: UnitsOnOrder,
        },
        {
            $Type : 'UI.DataField',
            Value : createdAt,
        },
    ],
    UI.SelectionFields           : [category_ID, ],
    UI.HeaderInfo                : {
        Title         : {
            $Type: 'UI.DataField',
            Value: ProductName,
        },
        TypeName      : '',
        TypeNamePlural: '',
        Description   : {
            $Type: 'UI.DataField',
            Value: UnitsInStock,
        },
        ImageUrl      : ProductName,
    },
);

annotate service.Products with {
    category @(
        Common.Label                   : '{i18n>Category}',
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Categories',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: category_ID,
                    ValueListProperty: 'ID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'CategoryName',
                },
            ],
        },
        Common.ValueListWithFixedValues: true,
        Common.Text                    : category.CategoryName,
        Common.Text.@UI.TextArrangement: #TextOnly,
    )
};

annotate service.Products with @(UI.SelectionVariant #AllProducts: {
    $Type        : 'UI.SelectionVariantType',
    Text         : 'All Products',
    SelectOptions: []
});

annotate service.Products with @(UI.SelectionVariant #HighStock: {
    $Type        : 'UI.SelectionVariantType',
    Text         : 'High Stock Products',
    SelectOptions: [{
        PropertyName: UnitsInStock,
        Ranges      : [{
            Sign  : #I,
            Option: #GT,
            Low   : '50',
        }, ],
    }, ],
});

annotate service.Products with @(UI.SelectionVariant #MediumStock: {
    $Type        : 'UI.SelectionVariantType',
    Text         : 'Medium Stock Products',
    SelectOptions: [{
        PropertyName: UnitsInStock,
        Ranges      : [{
            Sign  : #I,
            Option: #BT,
            Low   : '10',
            High  : '50'
        }, ],
    }, ],
});

annotate service.Products with @(UI.SelectionVariant #LowStock: {
    $Type        : 'UI.SelectionVariantType',
    Text         : 'Low Stock Product',
    SelectOptions: [{
        PropertyName: UnitsInStock,
        Ranges      : [{
            Sign  : #I,
            Option: #LT,
            Low   : '10',
        }, ],
    }, ],
});

annotate service.Categories with {
    CategoryName @Common.Label: 'category/CategoryName'
};

annotate service.Categories with {
    CategoryID @Common.Text: CategoryName
};

// Annotate image field for proper display and upload
annotate service.Products with {
    image     @(
        UI.IsImageURL            : false,
        Core.AcceptableMediaTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif'
        ]
    );
    imageType @(Core.IsMediaType: true);
};

// Suppliers annotations
annotate service.Suppliers with @(
    UI.LineItem                   : [
        {
            $Type: 'UI.DataField',
            Value: CompanyName,
            Label: 'Company Name',
        },
        {
            $Type: 'UI.DataField',
            Value: ContactName,
            Label: 'Contact Name',
        },
        {
            $Type: 'UI.DataField',
            Value: Country,
            Label: 'Country',
        },
        {
            $Type: 'UI.DataField',
            Value: Region,
            Label: 'Region',
        },
        {
            $Type: 'UI.DataField',
            Value: City,
            Label: 'City',
        },
    ],
    UI.FieldGroup #SupplierDetails: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: CompanyName,
                Label: 'Company Name',
            },
            {
                $Type: 'UI.DataField',
                Value: ContactName,
                Label: 'Contact Name',
            },
            {
                $Type: 'UI.DataField',
                Value: ContactTitle,
                Label: 'Contact Title',
            },
            {
                $Type: 'UI.DataField',
                Value: Address,
                Label: 'Address',
            },
            {
                $Type: 'UI.DataField',
                Value: City,
                Label: 'City',
            },
            {
                $Type: 'UI.DataField',
                Value: Region,
                Label: 'Region',
            },
            {
                $Type: 'UI.DataField',
                Value: PostalCode,
                Label: 'Postal Code',
            },
            {
                $Type: 'UI.DataField',
                Value: Country,
                Label: 'Country',
            },
            {
                $Type: 'UI.DataField',
                Value: Phone,
                Label: 'Phone',
            },
            {
                $Type: 'UI.DataField',
                Value: Fax,
                Label: 'Fax',
            },
            {
                $Type: 'UI.DataField',
                Value: HomePage,
                Label: 'Home Page',
            },
        ],
    },
    UI.Facets                     : [{
        $Type : 'UI.ReferenceFacet',
        Label : 'Supplier Details',
        Target: '@UI.FieldGroup#SupplierDetails',
    }, ],
);

// Add dropdown value helps for Country, Region, City
annotate service.Suppliers with {
    Country @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Countries',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Country,
                    ValueListProperty: 'CountryName',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'CountryCode',
                },
            ],
        },
        Common.ValueListWithFixedValues: false,
    );
    Region  @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Regions',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Region,
                    ValueListProperty: 'RegionName',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'RegionCode',
                },
            ],
        },
        Common.ValueListWithFixedValues: false,
    );
    City    @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Suppliers',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: City,
                ValueListProperty: 'City',
            }, ],
        },
        Common.ValueListWithFixedValues: false,
    );
};

// ProductAttachments annotations
annotate service.ProductAttachments with @(
    UI.LineItem                     : [
        {
            $Type: 'UI.DataField',
            Value: description,
            Label: 'Description',
        },
        {
            $Type: 'UI.DataField',
            Value: content,
            Label: 'Content',
        },
    ],
    UI.FieldGroup #AttachmentDetails: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: description,
                Label: 'Description',
            },
            {
                $Type: 'UI.DataField',
                Value: mimeType,
                Label: 'MIME Type',
            },
            {
                $Type: 'UI.DataField',
                Value: content,
                Label: 'Content',
            },
        ],
    },
    UI.Facets                       : [{
        $Type : 'UI.ReferenceFacet',
        Label : 'Attachment Details',
        Target: '@UI.FieldGroup#AttachmentDetails',
    }, ],
);

annotate service.Categories with {
    ID @(
        Common.Text                    : CategoryName,
        Common.Text.@UI.TextArrangement: #TextOnly,
    )
};
