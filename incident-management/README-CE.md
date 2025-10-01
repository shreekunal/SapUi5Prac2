# SAP Fiori Elements Controller Extension Quick Guide

## 1. Manifest Configuration

To register a controller extension, add the following block to the `sap.ui5.extends.extensions` section of your `manifest.json`:

```json
"sap.ui.controllerExtensions": {
  "sap.fe.templates.ObjectPage.ObjectPageController#ns.incidents::IncidentsObjectPage": {
    "controllerName": "ns.incidents.ext.controller.IncidentEditFlowExtension"
  }
}
```

**How to build the key:**

- The part before `#` is the template controller (e.g., `sap.fe.templates.ObjectPage.ObjectPageController`).
- The part after `#` is `<appID>::<targetID>`, where:
  - `appID` is from `sap.app.id` in manifest (e.g., `ns.incidents`).
  - `targetID` is the routing target name (e.g., `IncidentsObjectPage`).
- The `controllerName` is the namespace matching your `.controller.js` file (e.g., `ns.incidents.ext.controller.IncidentEditFlowExtension`).

Repeat this pattern for other pages or templates as needed.

## 2. Controller Extension Implementation

Create your extension file at `app/incidents/webapp/ext/controller/IncidentEditFlowExtension.controller.js`:

```javascript
sap.ui.define(
  [
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (ControllerExtension, MessageToast, MessageBox) {
    "use strict";

    return ControllerExtension.extend(
      "ns.incidents.ext.controller.IncidentEditFlowExtension",
      {
        override: {
          editFlow: {
            onBeforeEdit: function () {
              return new Promise(function (resolve, reject) {
                MessageBox.confirm(
                  "Do you want to switch this incident to edit mode?",
                  {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                      sAction === MessageBox.Action.OK
                        ? resolve()
                        : reject(new Error("EDIT_CANCELLED"));
                    },
                  }
                );
              });
            },
            onAfterEdit: function () {
              MessageToast.show("Edit mode activated for the incident.");
            },
            onBeforeSave: function (mParameters) {
              var oContext = mParameters && mParameters.context;
              if (!oContext) {
                return;
              }
              var sTitle = oContext.getProperty("title");
              if (!sTitle || !sTitle.trim()) {
                MessageToast.show(
                  "Please provide a title for the incident before saving."
                );
                return Promise.reject(new Error("TITLE_REQUIRED"));
              }
              return Promise.resolve();
            },
            onAfterSave: function (mParameters) {
              var oContext = mParameters && mParameters.context;
              if (!oContext) {
                return;
              }
              var oIncident = oContext.getObject();
              var sInfoText = "Incident saved successfully.";
              if (oIncident) {
                if (oIncident.ID !== undefined && oIncident.ID !== null) {
                  sInfoText =
                    "Incident " + oIncident.ID + " saved successfully.";
                } else if (oIncident.title) {
                  sInfoText =
                    "Incident '" + oIncident.title + "' saved successfully.";
                }
              }
              MessageToast.show(sInfoText);
            },
          },
        },
      }
    );
  }
);
```

**Tips:**

- Always use `.controller.js` suffix for your extension file.
- Namespace in `controllerName` must match the file path and name.
- Use promises in hooks to control FE flow (resolve to continue, reject to block).
- Add more hooks or custom logic as needed for your scenario.
