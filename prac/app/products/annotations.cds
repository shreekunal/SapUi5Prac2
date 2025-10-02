using CatalogService as service from '../../srv/cat-service';

annotate service.Products with @(
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'ProductID',
                Value: ProductID,
            },
            {
                $Type: 'UI.DataField',
                Label: 'ProductName',
                Value: ProductName,
            },
            {
                $Type: 'UI.DataField',
                Label: 'SupplierID',
                Value: SupplierID,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Category',
                Value: category.CategoryName,
            },
            {
                $Type: 'UI.DataField',
                Label: 'QuantityPerUnit',
                Value: QuantityPerUnit,
            },
            {
                $Type: 'UI.DataField',
                Label: 'UnitPrice',
                Value: UnitPrice,
            },
            {
                $Type: 'UI.DataField',
                Label: 'UnitsInStock',
                Value: UnitsInStock,
            },
            {
                $Type: 'UI.DataField',
                Label: 'UnitsOnOrder',
                Value: UnitsOnOrder,
            },
            {
                $Type: 'UI.DataField',
                Label: 'ReorderLevel',
                Value: ReorderLevel,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Discontinued',
                Value: Discontinued,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Image',
                Value: Image,
            },
        ],
    },
    UI.Facets                    : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup',
    }, ],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Label: '{i18n>ProductId}',
            Value: ProductID,
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>ProductName}',
            Value: ProductName,
        },
        {
            $Type : 'UI.DataField',
            Value : Image,
            Label : '{i18n>Image}',
        },
        {
            $Type : 'UI.DataField',
            Value : category.CategoryName,
            Label : '{i18n>CategoryName}',
        },
        {
            $Type : 'UI.DataField',
            Value : Discontinued,
            Label : '{i18n>Discontinued}',
        },
        {
            $Type : 'UI.DataField',
            Value : QuantityPerUnit,
            Label : '{i18n>Quantity}',
        },
        {
            $Type : 'UI.DataField',
            Value : UnitPrice,
            Label : '{i18n>UnitPrice}',
        },
        {
            $Type : 'UI.DataField',
            Value : UnitsInStock,
            Label : '{i18n>Stock}',
            Criticality : UnitsInStock,
        },
        {
            $Type : 'UI.DataField',
            Value : UnitsOnOrder,
            Label : '{i18n>Order}',
            Criticality : UnitsOnOrder,
        },
        {
            $Type : 'UI.DataField',
            Value : suppliers.ID,
            Label : '{i18n>SupplierId}',
        },
    ],
    UI.SelectionFields           : [
        category_CategoryID,
    ],
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
                    LocalDataProperty: category_CategoryID,
                    ValueListProperty: 'CategoryID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'CategoryName',
                },
            ],
        },
        Common.ValueListWithFixedValues: true,
        Common.Text : category.CategoryName,
        )
};

annotate service.Categories with {
    CategoryName @Common.Label : 'category/CategoryName'
};

annotate service.Categories with {
    CategoryID @Common.Text : CategoryName
};

