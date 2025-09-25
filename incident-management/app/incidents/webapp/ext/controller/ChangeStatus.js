sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {
        markDone: async function (oContext) {
            const sID = oContext.getProperty("ID");
            if (!sID) {
                MessageToast.show("Could not determine Incident ID.");
                return;
            }

            try {
                // In V4, associations are updated via @odata.id reference string
                await oContext.setProperty("status", { "@odata.id": `/ProcessorService.Status('C')` });

                // Refresh context to update UI
                oContext.refresh();

                MessageToast.show("Incident marked as Closed.");
            } catch (err) {
                MessageToast.show("Error updating incident: " + err.message);
                console.error(err);
            }
        }
    };
});
