sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (ControllerExtension, MessageToast, MessageBox) {
    "use strict";

    return ControllerExtension.extend("ns.incidents.ext.controller.IncidentEditFlowExtension", {
        override: {
            editFlow: {
                /**
                 * Ask the user for confirmation before switching a document to edit mode.
                 */
                onBeforeEdit: function (mParameters) {
                    return new Promise(function (resolve, reject) {
                        MessageBox.confirm(
                            "Do you want to switch this incident to edit mode?",
                            {
                                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                emphasizedAction: MessageBox.Action.OK,
                                onClose: function (sAction) {
                                    if (sAction === MessageBox.Action.OK) {
                                        resolve();
                                    } else {
                                        reject(new Error("EDIT_CANCELLED"));
                                    }
                                }
                            }
                        );
                    });
                },

                /**
                 * Provide lightweight confirmation once edit mode is active.
                 */
                onAfterEdit: function (mParameters) {
                    MessageToast.show("Edit mode activated for the incident. : )");
                },

                /**
                 * Validate mandatory fields before triggering the standard save flow.
                 */
                onBeforeSave: function (mParameters) {
                    var oContext = mParameters && mParameters.context;

                    if (!oContext) {
                        return;
                    }

                    var sTitle = oContext.getProperty("title");

                    if (!sTitle || !sTitle.trim()) {
                        MessageToast.show("Please provide a title for the incident before saving.");
                        return Promise.reject(new Error("TITLE_REQUIRED"));
                    }

                    return Promise.resolve();
                },

                /**
                 * Provide lightweight user feedback once the standard save was executed successfully.
                 */
                onAfterSave: function (mParameters) {
                    var oContext = mParameters && mParameters.context;

                    if (!oContext) {
                        return;
                    }

                    var oIncident = oContext.getObject();
                    var sInfoText = "Incident saved successfully.";

                    if (oIncident) {
                        if (oIncident.ID !== undefined && oIncident.ID !== null) {
                            sInfoText = "Incident " + oIncident.ID + " saved successfully.";
                        } else if (oIncident.title) {
                            sInfoText = "Incident '" + oIncident.title + "' saved successfully.";
                        }
                    }

                    MessageToast.show(sInfoText);
                }
            }
        }
    });
});