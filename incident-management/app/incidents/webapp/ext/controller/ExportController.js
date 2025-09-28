sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {
        onExportData: function () {
            try {
                // Get the service URL for incidents
                var sServiceUrl = "/odata/v4/processor/Incidents?$expand=customer,status,urgency";

                jQuery.ajax({
                    url: sServiceUrl,
                    type: "GET",
                    success: function (oData) {
                        var aIncidents = oData.value || oData.results;
                        if (aIncidents && aIncidents.length > 0) {
                            // Create Excel data from incidents
                            var excelData = [
                                ['ID', 'Title', 'Customer', 'Status', 'Urgency', 'Created At', 'Modified At']
                            ];

                            aIncidents.forEach(function (incident) {
                                excelData.push([
                                    incident.ID || '',
                                    incident.title || '',
                                    (incident.customer && incident.customer.name) || '',
                                    (incident.status && incident.status.descr) || '',
                                    (incident.urgency && incident.urgency.descr) || '',
                                    incident.createdAt ? new Date(incident.createdAt).toLocaleDateString() : '',
                                    incident.modifiedAt ? new Date(incident.modifiedAt).toLocaleDateString() : ''
                                ]);
                            });

                            // Create workbook and worksheet
                            var wb = XLSX.utils.book_new();
                            var ws = XLSX.utils.aoa_to_sheet(excelData);

                            // Add worksheet to workbook
                            XLSX.utils.book_append_sheet(wb, ws, "Incidents");

                            // Generate Excel file and download
                            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                            var blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                            var url = URL.createObjectURL(blob);
                            var a = document.createElement('a');
                            a.href = url;
                            a.download = 'incidents_export.xlsx';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            MessageToast.show("Data exported successfully.");
                        } else {
                            MessageToast.show("No data to export.");
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        MessageToast.show("Error reading data: " + textStatus);
                        console.error("Export error:", jqXHR, textStatus);
                    }
                });
            } catch (error) {
                MessageToast.show("Error exporting data: " + error.message);
                console.error("Export error:", error);
            }
        }
    };
});