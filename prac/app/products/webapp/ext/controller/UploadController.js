sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    function _createUploadController(oExtensionAPI, oBindingContext) {
        var oUploadDialog;
        var oSelectedFile;
        var oFileInput;

        function byId(sId) {
            return sap.ui.core.Fragment.byId("productImageUploadDialog", sId);
        }

        function closeDialog() {
            oUploadDialog && oUploadDialog.close();
        }

        return {
            onBeforeOpen: function (oEvent) {
                oUploadDialog = oEvent.getSource();
                oExtensionAPI.addDependent(oUploadDialog);
                
                if (oBindingContext) {
                    oUploadDialog.setBindingContext(oBindingContext);
                }
            },

            onAfterClose: function (oEvent) {
                if (oFileInput && oFileInput.parentNode) {
                    oFileInput.parentNode.removeChild(oFileInput);
                    oFileInput = null;
                }
                
                oExtensionAPI.removeDependent(oUploadDialog);
                oUploadDialog.destroy();
                oUploadDialog = undefined;
                oSelectedFile = null;
            },

            onFileSelectPress: function () {
                if (!oFileInput) {
                    oFileInput = document.createElement("input");
                    oFileInput.type = "file";
                    oFileInput.accept = "image/jpeg,image/jpg,image/png,image/gif";
                    oFileInput.style.display = "none";
                    document.body.appendChild(oFileInput);
                    
                    oFileInput.addEventListener("change", function(event) {
                        var oFile = event.target.files[0];
                        var oFileNameText = byId("imageSelectedFileName");
                        
                        if (!oFile) {
                            if (oFileNameText) {
                                oFileNameText.setText("No file selected");
                            }
                            oSelectedFile = null;
                            return;
                        }

                        var sFileType = oFile.type;
                        var aAllowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

                        if (aAllowedTypes.indexOf(sFileType) === -1) {
                            MessageToast.show("Please select a valid image file (JPEG, PNG, GIF)");
                            if (oFileNameText) {
                                oFileNameText.setText("No file selected");
                            }
                            return;
                        }

                        var iMaxSize = 5 * 1024 * 1024;
                        if (oFile.size > iMaxSize) {
                            MessageToast.show("File size must be less than 5MB");
                            if (oFileNameText) {
                                oFileNameText.setText("No file selected");
                            }
                            return;
                        }

                        oSelectedFile = oFile;
                        if (oFileNameText) {
                            oFileNameText.setText(oFile.name + " (" + Math.round(oFile.size / 1024) + " KB)");
                        }
                    });
                }
                
                oFileInput.click();
            },

            onUploadPress: function () {
                if (!oUploadDialog) {
                    MessageToast.show("Upload dialog is not ready yet");
                    return;
                }

                var oContext = oUploadDialog.getBindingContext();
                if (!oContext) {
                    MessageToast.show("Error: No context available");
                    return;
                }

                if (!oSelectedFile) {
                    MessageToast.show("Please select an image file first");
                    return;
                }

                var oReader = new FileReader();
                oReader.onload = function (e) {
                    var sBase64 = e.target.result;
                    var sBase64Data = sBase64.split(',')[1];

                    // For OData V4, use setProperty on the context
                    oContext.setProperty("image", sBase64Data);
                    oContext.setProperty("imageType", oSelectedFile.type);
                    oContext.setProperty("imageName", oSelectedFile.name);

                    MessageToast.show("Image uploaded successfully");
                    oExtensionAPI.refresh();
                    closeDialog();
                };

                oReader.onerror = function () {
                    MessageToast.show("Error reading file");
                };

                oReader.readAsDataURL(oSelectedFile);
            },

            onUploadCancel: function () {
                closeDialog();
            },

            onRemoveImage: function () {
                if (!oUploadDialog) {
                    MessageToast.show("Upload dialog is not ready yet");
                    return;
                }

                var oContext = oUploadDialog.getBindingContext();
                if (!oContext) {
                    MessageToast.show("Error: No context available");
                    return;
                }

                // For OData V4, use setProperty on the context
                oContext.setProperty("image", "");
                oContext.setProperty("imageType", "");
                oContext.setProperty("imageName", "");

                MessageToast.show("Image removed successfully");
                oExtensionAPI.refresh();
                closeDialog();
            }
        };
    }

    return {
        onUploadImage: function (oBindingContext, aSelectedContexts) {
            if (!oBindingContext) {
                MessageToast.show("No context available");
                return;
            }

            this.loadFragment({
                id: "productImageUploadDialog",
                name: "products.ext.fragment.ImageUploadDialog",
                controller: _createUploadController(this, oBindingContext)
            }).then(function (oDialog) {
                oDialog.open();
            });
        }
    };
});
