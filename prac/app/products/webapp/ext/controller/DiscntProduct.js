sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    return {
        /**
         * Generated event handler.
         *
         * @param oContext the context of the page on which the event was fired. `undefined` for list report page.
         * @param aSelectedContexts the selected contexts of the table rows.
         */
        discntProduct: async function (oContext, aSelectedContexts) {
            if (!oContext) {
                MessageToast.show("No context available.");
                return;
            }

            try {
                // Set the Discontinued property to true
                await oContext.setProperty("Discontinued", true);

                // Refresh context to update UI
                oContext.refresh();

                MessageToast.show("Product discontinued successfully.");
            } catch (err) {
                MessageToast.show("Error discontinuing product: " + err.message);
                console.error(err);
            }
        }
    };
});
