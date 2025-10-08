sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    return {
        /**
         * Continue product action - sets Discontinued to false
         *
         * @param oContext the context of the page on which the event was fired
         * @param aSelectedContexts the selected contexts of the table rows
         */
        continueProduct: async function (oContext, aSelectedContexts) {
            if (!oContext) {
                MessageToast.show("No context available.");
                return;
            }

            try {
                // Set the Discontinued property to false
                await oContext.setProperty("Discontinued", false);

                // Refresh context to update UI
                oContext.refresh();

                MessageToast.show("Product continued successfully.");
            } catch (err) {
                MessageToast.show("Error continuing product: " + err.message);
                console.error(err);
            }
        },

        /**
         * Discontinue product action - sets Discontinued to true
         *
         * @param oContext the context of the page on which the event was fired
         * @param aSelectedContexts the selected contexts of the table rows
         */
        discontinueProduct: async function (oContext, aSelectedContexts) {
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