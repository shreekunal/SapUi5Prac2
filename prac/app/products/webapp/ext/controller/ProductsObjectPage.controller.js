sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("products.ext.controller.ProductsObjectPage", {

        // Stock Status Formatters
        formatStockText: function (unitsInStock) {
            if (unitsInStock === undefined || unitsInStock === null) return "";
            return unitsInStock + " units in stock";
        },

        formatStockStatus: function (unitsInStock) {
            if (unitsInStock === undefined || unitsInStock === null) return "None";
            if (unitsInStock === 0) return "Error";
            if (unitsInStock < 10) return "Warning";
            if (unitsInStock < 50) return "Information";
            return "Success";
        },

        formatStockIcon: function (unitsInStock) {
            if (unitsInStock === undefined || unitsInStock === null) return "";
            if (unitsInStock === 0) return "sap-icon://status-error";
            if (unitsInStock < 10) return "sap-icon://status-critical";
            if (unitsInStock < 50) return "sap-icon://status-inactive";
            return "sap-icon://status-positive";
        },

        calculateStockPercentage: function (unitsInStock) {
            if (unitsInStock === undefined || unitsInStock === null) return 0;
            // Assuming max stock level is 100 for percentage calculation
            return Math.min((unitsInStock / 100) * 100, 100);
        },

        formatStockDisplay: function (unitsInStock) {
            if (unitsInStock === undefined || unitsInStock === null) return "";
            var unitsOnOrder = this.getView().getBindingContext().getProperty("UnitsOnOrder") || 0;
            return unitsInStock + "/" + (unitsInStock + unitsOnOrder);
        },

        formatProgressState: function (unitsInStock) {
            if (unitsInStock === undefined || unitsInStock === null) return "None";
            if (unitsInStock === 0) return "Error";
            if (unitsInStock < 10) return "Warning";
            return "Success";
        }

    });
});