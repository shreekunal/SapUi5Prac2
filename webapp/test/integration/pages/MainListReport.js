sap.ui.define(["sap/fe/test/ListReport"], function (ListReport) {
    "use strict";

    // OPTIONAL
    var AdditionalCustomListReportDefinition = {
        actions: {},
        assertions: {},
    };

    return new ListReport(
        {
            appId: "com.pas.pasawardsf",
            componentId: "AwardsList",
            entitySet: "Awards",
        },
        AdditionalCustomListReportDefinition
    );
})