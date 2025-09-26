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
                // Update the status code directly
                await oContext.setProperty("status_code", 'R');

                // Refresh context to update UI
                oContext.refresh();

                MessageToast.show("Incident marked as completed.");
            } catch (err) {
                MessageToast.show("Error updating incident: " + err.message);
                console.error(err);
            }
        }
    };
});
