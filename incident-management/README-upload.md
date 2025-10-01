# SAP Fiori Elements: Upload Button Extension Guide

This guide explains how to add and wire an Upload button to your SAP Fiori Elements app, using a custom controller extension for handling file uploads.

## 1. Manifest Configuration

Add the Upload button to the Object Page or List Report header actions in your `manifest.json`:

```json
"content": {
  "header": {
    "actions": {
      "uploadIncidents": {
        "press": "ns.incidents.ext.controller.UploadController.Upload",
        "visible": true,
        "enabled": true,
        "text": "Upload"
      }
    }
  }
}
```

- The `press` property points to the handler in your custom controller.
- Place this block under the relevant target's `content.header.actions`.

## 2. Upload Controller Implementation

Create your controller at `app/incidents/webapp/ext/controller/UploadController.js`:

```javascript
sap.ui.define(
  ["sap/m/MessageBox", "sap/m/MessageToast"],
  function (MessageBox, MessageToast) {
    "use strict";
    return {
      Upload: function (oEvent) {
        // Implement file selection and upload logic here
        MessageBox.information(
          "Upload button pressed. Implement file upload logic."
        );
      },
    };
  }
);
```

- The function name (`Upload`) must match the `press` property in the manifest.
- Add your file dialog and upload logic inside the handler.

**Tips:**

- Use `MessageBox` or `MessageToast` for user feedback.
- For advanced scenarios, use the ExtensionAPI for backend calls or dialog fragments.
