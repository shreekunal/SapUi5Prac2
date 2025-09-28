sap.ui.define([
], function () {
    "use strict";

    function newWindowOpenerSafe(url) {
        var oWindow = window.open();
        oWindow.opener = null;
        oWindow.location = url
    }

    return {
        onDownloadTemplate: function () {
            // Use the working fallback endpoint
            var sUrlFile = this._controller.extensionAPI._controller._oAppComponent.getManifestObject().resolveUri("../../../template/incidents");
            console.log("Downloading template from:", sUrlFile);
            newWindowOpenerSafe(sUrlFile);
        }
    };
});