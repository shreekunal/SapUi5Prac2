using ProcessorService as service from '../../srv/services';
using from '../../db/schema';

// Main UI annotations for the Incidents entity
// Defines the layout and behavior of the List Report and Object Page views
annotate service.Incidents with @(
    // Line items define the columns shown in the list report table
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Value: title,
            Label: '{i18n>Title}',
        },
        {
            $Type: 'UI.DataField',
            Value: customer.name,
            Label: '{i18n>Customer}',
        },
        {
            $Type      : 'UI.DataField',
            Value      : status.descr,
            Label      : '{i18n>Status}',
            Criticality: status.criticality,
        },
        {
            $Type: 'UI.DataField',
            Value: urgency.descr,
            Label: '{i18n>Urgency}',
        },
    ],
    // Header info defines the title and description shown in the object page header
    UI.HeaderInfo                : {
        Title         : {
            $Type: 'UI.DataField',
            Value: title,
        },
        TypeName      : '',
        TypeNamePlural: '',
        Description   : {
            $Type: 'UI.DataField',
            Value: customer.name,
        },
        TypeImageUrl  : 'sap-icon://alert',
    },
    // Facets define the sections and layout of the object page
    UI.Facets                    : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : '{i18n>GeneralInformation}',
            Target: '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.CollectionFacet',
            Label : '{i18n>Overview}',
            ID    : 'OverviewInfo',
            Facets: [{
                $Type : 'UI.ReferenceFacet',
                Label : '{i18n>Details}',
                ID    : 'Overview',
                Target: '@UI.FieldGroup#Overview',
            }, ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Conversations',
            ID    : 'Conversations',
            Target: 'conversation/@UI.LineItem#Conversations',
        },
    ],
    // Field group for general information displayed in the object page
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: '{i18n>Title}',
                Value: title,
            },
            {
                $Type: 'UI.DataField',
                Label: '{i18n>Customer}',
                Value: customer_ID,
            },
        ],
    },
    // Additional field group for details section
    UI.FieldGroup #Overview   : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: status_code,
            },
            {
                $Type: 'UI.DataField',
                Value: urgency_code,
            },
        ],
    },
    // Selection fields define the filters shown in the list report
    UI.SelectionFields           : [
        status_code,
        urgency_code,
    ],
    );

// Value list configuration for the customer field
// Enables a dropdown with customer data for selection
annotate service.Incidents with {
    customer @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Customers',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: customer_ID,
                    ValueListProperty: 'ID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'email',
                },
            ],
        },
        Common.Text                    : customer.name,
        Common.Text.@UI.TextArrangement: #TextOnly,
        Common.ValueListWithFixedValues: true,
    )
};

// Annotations for the status field
// Configures display text and value list behavior
annotate service.Incidents with {
    status @(
        Common.Label                   : '{i18n>Status}',
        Common.ValueListWithFixedValues: true,
        Common.Text                    : status.descr,
    )
};

// Annotations for the urgency field
// Configures display text and value list behavior
annotate service.Incidents with {
    urgency @(
        Common.Label                   : '{i18n>Urgency}',
        Common.ValueListWithFixedValues: true,
        Common.Text                    : urgency.descr,
    )
};

// Annotations for the Status entity
// Defines how status codes are displayed with their descriptions
annotate service.Status with {
    code @Common.Text: descr
};

// Annotations for the Urgency entity
// Defines how urgency codes are displayed with their descriptions
annotate service.Urgency with {
    code @Common.Text: descr
};

// Annotations for the conversation composition
// Defines the line items for the conversations table in the object page
annotate service.Incidents.conversation with @(UI.LineItem #Conversations: [
    {
        $Type: 'UI.DataField',
        Value: author,
        Label: '{i18n>Author}',
    },
    {
        $Type: 'UI.DataField',
        Value: message,
        Label: '{i18n>Message1}',
    },
    {
        $Type: 'UI.DataField',
        Value: timestamp,
        Label: '{i18n>Date}',
    },
]);
