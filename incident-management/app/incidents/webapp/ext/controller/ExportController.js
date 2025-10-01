sap.ui.define(["sap/m/MessageBox", "sap/m/MessageToast", "sap/m/BusyDialog"],
    function (MessageBox, MessageToast, BusyDialog) {
        "use strict";

        function _createExportController(oExtensionAPI, Entity) {
            var oBusyDialog;

            function setBusyDialogState(bBusy, sText) {
                if (bBusy) {
                    if (!oBusyDialog) {
                        oBusyDialog = new BusyDialog({
                            title: "Exporting Data",
                            text: sText || "Please wait while we prepare your export..."
                        });
                    }
                    oBusyDialog.open();
                } else {
                    if (oBusyDialog) {
                        oBusyDialog.close();
                    }
                }
            }

            function handleExportError(oError) {
                console.error("Export error:", oError);

                var sUserMessage = "Export failed. Please try again.";

                if (oError.message.indexOf("fetch") > -1) {
                    sUserMessage = "Unable to connect to server. Please check your connection and try again.";
                } else if (oError.message.indexOf("No data") > -1) {
                    sUserMessage = "No data available to export.";
                } else if (oError.message.indexOf("processing") > -1) {
                    sUserMessage = "Error processing data. The dataset might be too large.";
                }

                MessageToast.show(sUserMessage);
            }

            function fetchIncidentsData() {
                var oModel = oExtensionAPI.getModel();
                var sServiceUrl = oModel.sServiceUrl || "/odata/v4/processor/";
                var sFullUrl = sServiceUrl + "Incidents?$expand=customer,status,urgency";

                return fetch(sFullUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error("HTTP " + response.status + ": " + response.statusText);
                        }
                        return response.json();
                    })
                    .then(function (oData) {
                        return oData.value || oData.results || [];
                    })
                    .catch(function (oError) {
                        console.error("Error fetching incidents data:", oError);
                        throw new Error("Failed to fetch data: " + oError.message);
                    });
            }

            function processDataForExport(aIncidents) {
                return new Promise(function (resolve, reject) {
                    try {
                        var iChunkSize = 1000;
                        var aProcessedData = [];

                        var aHeaders = ['customer_ID', 'title', 'urgency_code', 'status_code'];
                        aProcessedData.push(aHeaders);

                        var processChunk = function (iStartIndex) {
                            var iEndIndex = Math.min(iStartIndex + iChunkSize, aIncidents.length);

                            for (var i = iStartIndex; i < iEndIndex; i++) {
                                var oIncident = aIncidents[i];
                                aProcessedData.push([
                                    (oIncident.customer && oIncident.customer.ID) || '',
                                    oIncident.title || '',
                                    (oIncident.urgency && oIncident.urgency.code) || '',
                                    (oIncident.status && oIncident.status.code) || ''
                                ]);
                            }

                            if (iEndIndex < aIncidents.length) {
                                setTimeout(function () { processChunk(iEndIndex); }, 10);
                            } else {
                                resolve({
                                    data: aProcessedData,
                                    recordCount: aIncidents.length
                                });
                            }
                        };

                        processChunk(0);

                    } catch (oError) {
                        reject(new Error("Data processing failed: " + oError.message));
                    }
                });
            }

            function generateExcelFile(oExportData) {
                return new Promise(function (resolve, reject) {
                    try {
                        var oWorkbook = XLSX.utils.book_new();
                        var oWorksheet = XLSX.utils.aoa_to_sheet(oExportData.data);

                        XLSX.utils.book_append_sheet(oWorkbook, oWorksheet, "Incidents");

                        var aWorkbookOutput = XLSX.write(oWorkbook, {
                            bookType: 'xlsx',
                            type: 'array',
                            compression: true
                        });

                        var oBlob = new Blob([aWorkbookOutput], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });

                        var sUrl = URL.createObjectURL(oBlob);
                        var oDownloadLink = document.createElement('a');

                        oDownloadLink.href = sUrl;
                        oDownloadLink.download = 'incidents_export.xlsx';
                        oDownloadLink.style.display = 'none';

                        document.body.appendChild(oDownloadLink);
                        oDownloadLink.click();
                        document.body.removeChild(oDownloadLink);

                        setTimeout(function () {
                            URL.revokeObjectURL(sUrl);
                            resolve(oExportData.recordCount);
                        }, 100);

                    } catch (oError) {
                        reject(new Error("Excel file generation failed: " + oError.message));
                    }
                });
            }

            return {
                onExportData: function () {
                    try {
                        setBusyDialogState(true);

                        fetchIncidentsData()
                            .then(function (aIncidents) {
                                if (!aIncidents || aIncidents.length === 0) {
                                    throw new Error("No data available for export");
                                }

                                return processDataForExport(aIncidents);
                            })
                            .then(function (oExportData) {
                                return generateExcelFile(oExportData);
                            })
                            .then(function (iRecordCount) {
                                setBusyDialogState(false);
                                MessageToast.show("Excel file exported successfully. " + iRecordCount + " records processed.");
                            })
                            .catch(function (oError) {
                                setBusyDialogState(false);
                                handleExportError(oError);
                            });

                    } catch (oError) {
                        setBusyDialogState(false);
                        handleExportError(oError);
                    }
                }
            };
        }

        return {
            Export: function (oBindingContext, aSelectedContexts) {
                var oController = _createExportController(this, 'Incidents');
                oController.onExportData();
            },

            onExportData: function () {
                var oController = _createExportController(this, 'Incidents');
                oController.onExportData();
            }
        };
    });
