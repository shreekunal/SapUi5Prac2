# SAP Fiori Elements: Export Button Extension Guide

This guide explains how to add and wire an Export button to your SAP Fiori Elements app, using a custom controller extension for exporting data (e.g., to Excel).

## 1. Manifest Configuration

Add the Export button to the Object Page or List Report header actions in your `manifest.json`:

```json
"content": {
  "header": {
    "actions": {
      "exportIncidents": {
        "press": "ns.incidents.ext.controller.ExportController.onExportData",
        "visible": true,
        "enabled": true,
        "text": "Export"
      }
    }
  }
}
```

- The `press` property points to the handler in your custom controller.
- Place this block under the relevant target's `content.header.actions`.

## 2. Export Controller Implementation

Create your controller at `app/incidents/webapp/ext/controller/ExportController.js`:

```javascript
sap.ui.define(
  ["sap/m/MessageBox", "sap/m/MessageToast"],
  function (MessageBox, MessageToast) {
    "use strict";
    return {
      onExportData: function (oEvent) {
        // Implement export logic here (e.g., generate and download Excel)
        MessageBox.information(
          "Export button pressed. Implement export logic."
        );
      },
    };
  }
);
```

- The function name (`onExportData`) must match the `press` property in the manifest.
- Add your export logic inside the handler (e.g., use XLSX.js for Excel export).

**Tips:**

- Use `MessageBox` or `MessageToast` for user feedback.
- For advanced scenarios, use the ExtensionAPI for backend calls or file generation.
