sap.ui.define(["sap/m/MessageBox", "sap/m/MessageToast", "sap/ui/core/UIComponent"],
    function (MessageBox, MessageToast, UIComponent) {
        "use strict";
        function _createUploadController(oExtensionAPI, Entity) {
            var oUploadDialog;

            function setOkButtonEnabled(bOk) {
                oUploadDialog && oUploadDialog.getBeginButton().setEnabled(bOk);
            }

            function setDialogBusy(bBusy) {
                oUploadDialog.setBusy(bBusy)
            }

            function closeDialog() {
                oUploadDialog && oUploadDialog.close()
            }

            function showError(code, target, sMessage) {
                if (code === '401') {
                    MessageBox.error("Upload failed, press close to download error details, if available", {
                        title: "Error",
                        onClose: function (oAction) {
                            var workbook = XLSX.utils.book_new();
                            // var sMessage = oRawResponse.error.message;
                            var oMessage = JSON.parse(sMessage);
                            var worksheet = XLSX.utils.json_to_sheet(oMessage);
                            workbook.SheetNames.push("First");
                            workbook.Sheets["First"] = worksheet;
                            // TO BINARY STRING
                            var xlsbin = XLSX.write(workbook, {
                                bookType: "xlsx",
                                type: "binary"
                            });

                            // TO BLOB OBJECT
                            var buffer = new ArrayBuffer(xlsbin.length),
                                array = new Uint8Array(buffer);
                            for (var i = 0; i < xlsbin.length; i++) {
                                array[i] = xlsbin.charCodeAt(i) & 0XFF;
                            }
                            var xlsblob = new Blob([buffer], { type: "application/octet-stream" });

                            // (C5) "FORCE DOWNLOAD"
                            var url = window.URL.createObjectURL(xlsblob),
                                anchor = document.createElement("a");
                            document.body.appendChild(anchor);
                            anchor.style = "display: none";
                            anchor.href = url;
                            anchor.download = "demo.xlsx";
                            anchor.click();
                            window.URL.revokeObjectURL(url);
                            oUploadDialog && oUploadDialog.close()
                        }
                    } || "Upload failed");
                }
                else {
                    sMessage = sMessage + "\n" + target;
                    MessageBox.error(sMessage);
                    oUploadDialog && oUploadDialog.close();

                }
            }

            // TODO: Better option for this?
            function byId(sId) {
                return sap.ui.core.Fragment.byId("uploadDialog", sId);
            }

            return {
                onBeforeOpen: function (oEvent) {
                    oUploadDialog = oEvent.getSource();
                    oExtensionAPI.addDependent(oUploadDialog);
                },

                onAfterClose: function (oEvent) {
                    oExtensionAPI.removeDependent(oUploadDialog);
                    oUploadDialog.destroy();
                    oUploadDialog = undefined;
                },

                onOk: function (oEvent) {
                    setDialogBusy(true)

                    var oFileUploader = byId("uploader");
                    var headPar = new sap.ui.unified.FileUploaderParameter();
                    headPar.setName('slug');
                    headPar.setValue(Entity);
                    oFileUploader.removeHeaderParameter('slug');
                    oFileUploader.removeAllHeaderParameters();
                    oFileUploader.addHeaderParameter(headPar);

                    // Get the service URL directly from the model like webapp does
                    var oModel = oExtensionAPI.getModel();
                    var sServiceUrl = oModel.sServiceUrl || "/odata/v4/processor/";
                    var sUploadUri = sServiceUrl + "Upload/excel";

                    oFileUploader.setUploadUrl(sUploadUri);
                    oFileUploader
                        .checkFileReadable()
                        .then(function () {
                            oFileUploader.upload();
                        })
                        .catch(function (error) {
                            showError("The file cannot be read.");
                            setDialogBusy(false)
                        })
                },

                onCancel: function (oEvent) {
                    closeDialog();
                },

                onTypeMismatch: function (oEvent) {
                    var sSupportedFileTypes = oEvent
                        .getSource()
                        .getFileType()
                        .map(function (sFileType) {
                            return "*." + sFileType;
                        })
                        .join(", ");

                    showError(
                        "The file type *." +
                        oEvent.getParameter("fileType") +
                        " is not supported. Choose one of the following types: " +
                        sSupportedFileTypes
                    );
                },

                onFileAllowed: function (oEvent) {
                    setOkButtonEnabled(true)
                },

                onFileEmpty: function (oEvent) {
                    setOkButtonEnabled(false)
                },

                onUploadComplete: function (oEvent) {
                    var iStatus = oEvent.getParameter("status");
                    var oFileUploader = oEvent.getSource()

                    oFileUploader.clear();
                    setOkButtonEnabled(false)
                    setDialogBusy(false)

                    if (iStatus >= 400) {
                        var oRawResponse;
                        try {
                            oRawResponse = JSON.parse(oEvent.getParameter("responseRaw"));
                        } catch (e) {
                            oRawResponse = oEvent.getParameter("responseRaw");
                        }
                        if (oRawResponse && oRawResponse.error && oRawResponse.error.message) {
                            showError(oRawResponse.error.code, oRawResponse.error.target, oRawResponse && oRawResponse.error && oRawResponse.error.message);
                        }
                    } else {
                        MessageToast.show("File uploaded successfully");
                        oExtensionAPI.refresh()
                        closeDialog();
                    }
                }
            };
        };

        return {
            Upload: function (oBindingContext, aSelectedContexts) {
                this.loadFragment({
                    id: "uploadDialog",
                    name: "ns.incidents.ext.fragment.UploadDialog",
                    controller: _createUploadController(this, 'Incidents')
                }).then(function (oDialog) {
                    oDialog.open();
                });
            }
        };
    });