//**NOTE: please keep 401 erro code for upload fail only */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/generic/app/navigation/service/NavigationHandler",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/SearchField",
    "sap/ui/model/type/String",
    "sap/ui/core/message/Message",
    "sap/ui/core/library",
    "sap/ui/table/Column",
    "sap/m/Column",
    "sap/m/Text",
    "com/pas/pasawardsf/custom/Formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, JSONModel, UIComponent, NavigationHandler,
        MessageBox, History, MessageToast, ValueState, Fragment, Filter,
        FilterOperator, SearchField, TypeString, Message, library, UIColumn, MColumn, Text, formatter) {
        "use strict";
        // shortcut for sap.ui.core.ValueState
        var ValueState = library.ValueState;
        // shortcut for sap.ui.core.MessageType
        var MessageType = library.MessageType
        return Controller.extend("com.pas.pasawardsf.custom.onCreate", {
            formatter: formatter,
            onInit: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.getRoute("AwardsCreatePage").attachPatternMatched(this._onRouteMatched, this);
                this.byId("btnCreate").setEnabled(true);
                this.byId("_IDGenButton1").setEnabled(true);
            },
            _onRouteMatched: async function (oEvent) {
                this._setDates();
                //Register Message Manager
                var oMessageManager, oModel, oView;
                oView = this.getView();
                // set message model
                oMessageManager = sap.ui.getCore().getMessageManager();
                oView.setModel(oMessageManager.getMessageModel(), "oMessages");
                // or just do it for the whole view
                oMessageManager.registerObject(oView, true);
            },
            _setDates: function () {
                let currDate = new Date();
                if (currDate.getMonth() < 6) {
                    var evalYear = currDate.getFullYear();
                }
                else {
                    evalYear = currDate.getFullYear() + 1;
                }
                this.byId("evaluationYear").setValue(evalYear.toString());
                this.byId("calendarYear").setValue(evalYear - 1);
                this._loadInitialMultipleAwardsDates(evalYear);
            },
            onMessagePopoverPress: function (oEvent) {
                var oSourceControl = oEvent.getSource();
                this._getMessagePopover().then(function (oMessagePopover) {
                    oMessagePopover.openBy(oSourceControl);
                });
            },
            _getMessagePopover: function () {
                var oView = this.getView();
                // create popover lazily (singleton)
                if (!this._pMessagePopover) {
                    this._pMessagePopover = Fragment.load({
                        id: oView.getId(),
                        name: "com.pas.pasawardsf.custom.MessageManager"
                    }).then(function (oMessagePopover) {
                        oView.addDependent(oMessagePopover);
                        return oMessagePopover;
                    });
                }
                return this._pMessagePopover;
            },
            onChange: function (oEvent) {

                this._onMandatoryValidation(oEvent.getSource());
            },
            _onMandatoryValidation: function (oSource) {
                var sValue;
                try {
                    sValue = oSource.getValue();
                } catch (e) {
                    sValue = oSource.getSelectedKey();
                }
                if (sValue === '' || sValue === ' ') {
                    oSource.setValueState(ValueState.Error);  // if the field is empty after change, it will go red
                    oSource.setValueStateText(oSource.getLabels()[0].getText() + " is mandatory");
                }
                else {
                    this.getOwnerComponent().getModel("oMessages").getData();
                    oSource.setValueState(ValueState.None); // if the field is not empty after change, the value state (if any) is removed
                }
            },
            onChangeEvalYear: function (oEvent) {
                if (oEvent !== undefined) {
                    this._onMandatoryValidation(oEvent.getSource());
                    this.byId("calendarYear").setValue(oEvent.getSource().getValue() - 1);
                    this._loadInitialMultipleAwardsDates(oEvent.getSource().getValue());
                }
            },
            _loadInitialMultipleAwardsDates: function (evalYear) {
                let startDate = +evalYear - 1
                startDate = startDate.toString() + '-07-01'
                let endDate = evalYear;
                endDate = endDate.toString() + '-06-30';
                let oObj = this.getView().getModel("oMAModel").getData().dates =
                    [{
                        "currency_code": "",
                        "amount": "",
                        "description": "",
                        "country": "",
                        "companyCode": "",
                        "StartDate": "",
                        "EndDate": "",
                        "EditableStartDate": true,
                        "EditableEndDate": false
                    }];
                oObj[0].StartDate = startDate;
                oObj[0].EndDate = endDate;
                // this.byId("startDate").setValue(startDate);
                // this.byId("endDate").setValue(endDate);
            },
            onAddDate: function (oEvent) {
                let sEvalYear = this.byId("evaluationYear").getValue();
                let sEndDate = (+sEvalYear).toString() + '-06-30';
                //let sData = this.getOwnerComponent().getModel("oMAModel").getData().dates;
                let aDates = this.getOwnerComponent().getModel("oMAModel").getProperty("/dates");
                var date = {
                    "currency_code": "",
                    "amount": "",
                    "description": "",
                    "country": "",
                    "companyCode": "",
                    "StartDate": "",
                    "EndDate": sEndDate,
                    "EditableStartDate": true,
                    "EditableEndDate": false
                };
                aDates.push(date);
                let length = aDates.length;
                aDates[length - 2].EndDate = "";
                this.getOwnerComponent().getModel("oMAModel").setProperty("/dates", aDates);
                // this.getView().getModel("oMAModel").refresh();
            },
            onDeleteDate: function (oEvent) {
                let oItem = oEvent.getSource().getParent().getBindingContextPath().slice(7);
                let sData = this.getOwnerComponent().getModel("oMAModel").getData().dates;
                let sEvalYear = this.byId("evaluationYear").getValue();
                let sEndDate = sEvalYear + '-06-30';
                if (oItem === '0') {
                    MessageBox.error('Default row cannot be deleted');
                } else if (+oItem === sData.length - 1) {
                    sData.splice(oItem, 1);
                    sData[sData.length - 1].EndDate = sEndDate;
                } else {
                    sData[+oItem - 1].EndDate = this._onEndDateSet(sData[+oItem + 1].StartDate);
                    sData.splice(oItem, 1);
                }
                this.getView().getModel("oMAModel").refresh();
            },
            _onEndDateSet: function (sPrevEndDate) {
                if (sPrevEndDate === "") {
                    return "";
                } else {
                    const current = new Date(sPrevEndDate);
                    const numberOfDaysToSubstract = 1;
                    const prior = new Date(sPrevEndDate).setDate(current.getDate() - numberOfDaysToSubstract);
                    return new Date(prior).toISOString().slice(0, 10);
                }
            },
            onChangeDate: function (oEvent) {
                //this._onMandatoryValidation(oEvent.getSource());
                let sData = this.getView().getModel("oMAModel").getData().dates;
                let oItem = oEvent.getSource().getParent().getBindingContextPath().slice(7);
                let sLastStartDate = sData[oItem - 1].StartDate;
                if (+oItem === sData.length - 1) {
                    var sNextStartDate = sData[+oItem].EndDate;
                } else {
                    sNextStartDate = sData[+oItem + 1].StartDate;
                };
                let sPrevEndDate = oEvent.getParameters("newValue").newValue;
                if (sPrevEndDate > sLastStartDate && sPrevEndDate < sNextStartDate) {
                    this.getView().getModel("oMAModel").getData().dates[+oItem - 1].EndDate = this._onEndDateSet(sPrevEndDate);
                } else {
                    this.getView().getModel("oMAModel").getData().dates[+oItem].StartDate = "";
                    MessageBox.error("Date Sequence is incorrect.");
                }
            },
            onLiveChangeAwards: function (oEvent) {
                var oldSelection = this.getView().getModel("oMAModel").getData().code_code;
                this._onMandatoryValidation(oEvent.getSource());
                var sNewValue = oEvent.getParameter("selectedItem");
                if (sNewValue.getProperty("key") === 'SA') {
                    // this.byId("multipleAwards").setEnabled(true);
                    this.byId("_IDGenButton1").setEnabled(true);
                } else {
                    // this.byId("multipleAwards").setEnabled(false);
                    // this.byId("multipleAwards").setSelected(false);
                    if (this.byId("tableId1").getItems().length > 1) {
                        MessageBox.information("Delete multiple awards before changing award type to Non-SA");
                        var SAItem = oEvent.getSource().getSelectableItems().filter(obj => obj.getProperty("key") === 'SA')
                        this.byId("awardType").setSelectedItem(SAItem[0]);
                    } else {
                        this.byId("_IDGenButton1").setEnabled(false);
                    }
                    // this.byId("_IDGenFormElement11").setVisible(true);
                    // this.byId("_IDGenFormElement12").setVisible(true);
                    // this.byId("tableId1").setVisible(false);
                    this.onChangeEvalYear();
                }
            },
            onMultipleAwards: function (oEvent) {
                var sNewValue = oEvent.getParameter("selected");
                if (sNewValue === true) {
                    this.byId("_IDGenFormElement11").setVisible(false);
                    this.byId("_IDGenFormElement12").setVisible(false);
                    this.byId("tableId1").setVisible(true);
                } else {
                    this.byId("_IDGenFormElement11").setVisible(true);
                    this.byId("_IDGenFormElement12").setVisible(true);
                    this.byId("tableId1").setVisible(false);
                    this.onChangeEvalYear();
                }
            },
            _setDisplay: function (editable) {
                this.byId("awardType").setEditable(editable),
                    this.byId("fmno").setEditable(editable),
                    // this.byId("companyCode").setEditable(editable),
                    this.byId("evaluationYear").setEditable(editable),
                    // this.byId("country").setEditable(editable),
                    // this.byId("currencyCode").setEditable(editable),
                    // this.byId("startDate").setEditable(editable),
                    // this.byId("endDate").setEditable(editable),
                    this.byId("active").setEditable(editable),
                    // this.byId("amount").setEditable(editable),
                    // this.byId("description").setEditable(editable),
                    this.byId("nature").setEditable(editable),
                    // this.byId("annualizedSA").setEditable(editable),
                    // this.byId("distributionPer").setEditable(editable),
                    // this.byId("prorationper").setEditable(editable),
                    this.byId("FormDisplayColumn_Awards").setEditable(editable);
                this.byId("btnCreate").setEnabled(editable);
                this.byId("btnCancel").setEnabled(editable);
            },
            _createEntity: function () {
                this.oDataJsonArray = [];
                //data type conversion (if necessary)
                // if (this.byId("multipleAwards").getSelected() === false) {
                //     var oDataJson = {
                //         "code_code": this.byId("awardType").getSelectedKey(),
                //         "fmno": this.byId("fmno").getValue(),
                //        // "companyCode": '1010',
                //         "companyCode": this.byId("companyCode").getValue(),
                //         "evaluationYear": this.byId("evaluationYear").getValue(),
                //         "country": this.byId("country").getValue(),
                //         //"currency_code": 'INR',
                //         "currency_code": this.byId("currencyCode").getValue(),
                //         "startDate": this.byId("startDate").getValue(),
                //         "endDate": this.byId("endDate").getValue(),
                //         "active": this.byId("active").getSelected(),
                //         "amount": this.byId("amount").getValue(),
                //         "description": this.byId("description").getValue(),
                //         "nature": this.byId("nature").getSelectedKey(),
                //         // "annualizedSA": this.byId("annualizedSA").getValue(),
                //         // "distributionPer": this.byId("distributionPer").getValue(),
                //         // "prorationper": this.byId("prorationper").getValue()
                //         //   "code_tableName" : "Annual Awards"
                //     };
                //     //create list binding
                //     this.oListBinding = this.getOwnerComponent().getModel().bindList("/Awards", {
                //         $$updateGroupId: "awards"
                //     });
                //     this.oListBinding.create(oDataJson);
                // } else {
                var aAwards = this.getOwnerComponent().getModel("oMAModel").getData();
                var aDates = this.getOwnerComponent().getModel("oMAModel").getData().dates;
                //var data = this.getOwnerComponent().getModel("oAwards").getData();
                var sAppendData = "";
                for (var i = 0; i < aDates.length; i++) {
                    var oDataJson = {
                        "code_code": aAwards.code_code,
                        "fmno": aAwards.fmno,
                        "evaluationYear": (aAwards.evaluationYear).toString(),
                        "active": aAwards.active,
                        "nature": aAwards.nature,
                        "grandFather":aAwards.grandFather,
                        "grandFather":aAwards.grandFather,
                        "transacTypeCode":aAwards.transacTypeCode,
                        // "code_code": this.byId("awardType").getSelectedKey(),
                        // "fmno": this.byId("fmno").getValue(),
                        // "evaluationYear": this.byId("evaluationYear").getValue(),
                        // "active": this.byId("active").getSelected(),
                        // "nature": this.byId("nature").getSelectedKey(),
                        //"companyCode": '1010',
                        // "companyCode": this.byId("companyCode").getValue(),
                        // "country": this.byId("country").getValue(),
                        //"currency_code": 'INR',
                        // "currency_code": this.byId("currencyCode").getValue(),
                        // "startDate": this.byId("startDate").getValue(),
                        // "endDate": this.byId("endDate").getValue(),
                        // "amount": this.byId("amount").getValue(),
                        // "description": this.byId("description").getValue(),
                        // "annualizedSA": this.byId("annualizedSA").getValue(),
                        // "distributionPer": this.byId("distributionPer").getValue(),
                        // "prorationper": this.byId("prorationper").getValue()
                        // "code_tableName" : "Annual Awards"
                    };
                    oDataJson.startDate = aDates[i].StartDate;
                    oDataJson.endDate = aDates[i].EndDate;
                    oDataJson.currency_code = aDates[i].currency_code;
                    oDataJson.country = aDates[i].country;
                    oDataJson.amount = aDates[i].amount;
                    oDataJson.description = aDates[i].description;
                    oDataJson.companyCode = aDates[i].companyCode;
                    oDataJson.costCenter = aDates[i].costCenter;
                    this.oDataJsonArray.push(oDataJson);
                    if (sAppendData === "") {
                        sAppendData = sAppendData + JSON.stringify(oDataJson);
                    } else {
                        sAppendData = sAppendData + "," + JSON.stringify(oDataJson);
                    }
                    oDataJson = {};
                }
                //create list binding
                sAppendData = '[' + sAppendData + ']';
                var oAppendObjects = { "description": sAppendData };
                var abc = JSON.stringify(this.oDataJsonArray);
                var data = { "stringData": abc }
                this.oListBinding = this.getOwnerComponent().getModel().bindList("/AwardsDummy", {
                    $$updateGroupId: "awards"
                });
                this.oListBinding.create(data);
                //  }
            },
            onPressCreate: async function (oEvent) {
                //var oModel = this.getView().getModel();
                this.getView().setBusy(true);
                if (this._onSubmitCheck() === false) {
                    this.getView().setBusy(false);
                } else {
                    this.onClearPress();
                    this._setDisplay(false);
                    this._createEntity();
                    this.getView().getModel().submitBatch("awards");
                    this.oListBinding.attachCreateCompleted(async function (oEvent) {
                        console.log("inside");
                        var value = oEvent.getParameters().context.getProperty("ID");
                        if (oEvent.getParameter("success") === true) {
                            this.getView().setBusy(false);
                            MessageBox.success('Award Created',
                            {
                                actions: [MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,
                                onClose: function (sAction) {
                                    this.onPressCancel();
                                    // if (this.oDataJsonArray.length <= 0) {
                                    //   //  UIComponent.getRouterFor(this).navTo("AwardsObjectPage", { "key": oEvent.getParameters().context.getProperty("ID") });
                                    // } else {
                                       
                                    //    //UIComponent.getRouterFor(this).navTo("AwardsList");
                                    // }
                                }.bind(this) });
                            
                        } else {
                            this.showErrorDialog(oEvent);
                        }
                    }.bind(this), oEvent);
                }
            },
            showErrorDialog: function (oEvent) {
                this._setDisplay(true);
                this.getView().setBusy(false);
                MessageBox.error('Not Saved', {
                    title: 'Not Saved'
                });
            },
            onPressCancel: function (oEvent) {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                //this.getView().destroy();
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AwardsList", {}, true);
                }
                this.getOwnerComponent().getModel("oMAModel").setData(
                    {
                        "code_code": "SA",
                        "fmno": "",
                        "evaluationYear": "",
                        "active": "",
                        "nature": "Normal",                        
                        // "startDate": "",
                        // "endDate": "",
                        // "companyCode": "",
                        // "country": "",
                        // "currency_code": "",
                        // "amount": "",
                        // "description": "",
                        // "annualizedSA": "",
                        // "distributionPer": "",
                        // "prorationper": ""
                        //  "code_tableName" : "Annual Awards"
                    }
                );
                this._setDates();
                this._setDisplay(true);
                this.onClearPress();
                this.byId("btnCreate").setEnabled(true);
            },
            validateForm: function (requiredInputs) {
                var _self = this;
                var valid = true;
                var data = this.getView().getModel("oMAModel").getData();
                const toSentenceCase = camelCase => {
                    if (camelCase) {
                        const result = camelCase.replace(/([A-Z])/g, ' $1');
                        return result[0].toUpperCase() + result.substring(1).toLowerCase();
                    }
                    return '';
                };
                requiredInputs.forEach(function (input) {

                    var sInput = _self.byId(input);
                    var condition = true;
                    if (input === 'awardType' || input === 'fmno' || input === 'evaluationYear') {
                        if (input === "awardType" && (sInput.getSelectedKey() == '' || sInput.getSelectedKey() == undefined)) {
                            condition = false;
                        } else if (input !== "awardType" && (sInput.getValue() == '' || sInput.getValue() == undefined)) {
                            condition = false;
                        };
                        if (condition === false) {
                            valid = false;
                            console.log(sInput);
                            sInput.setValueState("Error");
                            sInput.setValueStateText(sInput.getLabels()[0].getText() + " is mandatory");
                            var oMessage = new Message({
                                message: sInput.getLabels()[0].getText() + " is mandatory",
                                type: MessageType.Error,
                                target: "",
                                processor: _self.getOwnerComponent().getModel("oMAModel")
                            });
                        }
                        else {
                            sInput.setValueState("None");
                        }
                    } else if (input === 'country' || input === 'currency' || input === 'amount' || input === 'companyCode' || input === 'startDate' || input === 'endDate') {
                        if (data[input] === '' || data[input] === null) {
                            var oMessage = new Message({
                                message: toSentenceCase('input') + " is mandatory",
                                type: MessageType.Error,
                                target: "",
                                processor: _self.getOwnerComponent().getModel("oMAModel")
                            });
                        }
                    };

                });
                return valid;
            },

            onClearPress: function () {
                sap.ui.getCore().getMessageManager().removeAllMessages();
            },
            // on Submit
            _onSubmitCheck: function () {
                this.onClearPress();
                var sError = false;
                var mandatory = ["awardType", "fmno", "evaluationYear", "country", "currencyCode", "startDate", "endDate", "amount"];//"currencyCode",
                if (this.byId("companyCode").getRequired() === true) {
                    mandatory.push("companyCode");
                }
                var passedValidation = this.validateForm(mandatory);
                if (passedValidation === false) {
                    return false;
                }
            },
            //Value Helps
            //CompanyCodes
            onValueHelpRequestCC: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                var sTabIndex = oEvent.getSource().getBindingInfo("value").binding.getContext().getPath();
                if (!this._pValueHelpDialogCC) {
                    this._pValueHelpDialogCC = Fragment.load({
                        id: oView.getId(),
                        name: "com.pas.pasawardsf.custom.onCompanyCode",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogCC.then(function (oDialog) {
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("companyCode", FilterOperator.Contains, sInputValue)]);
                    if (oDialog.data("companyCode") === null) {
                        var oField = new sap.ui.core.CustomData();
                        oField.setKey("companyCode");
                        oField.setValue(sTabIndex);
                        oDialog.addCustomData(oField);
                    } else {
                        oDialog.getCustomData()[0].setValue(sTabIndex);
                    }
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(sInputValue);
                });
            },
            onValueHelpSearchCC: function (oEvent) {
                var sValue = oEvent.getParameter("value");

                var filter = new Filter({
                    filters: [
                        new Filter({
                            path: 'companyCode',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        }),
                        new Filter({
                            path: 'companyCodeName',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        })
                    ],
                    and: false
                });
                oEvent.getSource().getBinding("items").filter(filter);
            },
            onValueHelpCloseCC: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sFieldId = oEvent.getSource().data("companyCode");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                // this.byId("companyCode").setValue(oSelectedItem.getTitle());
                this.getView().getModel("oMAModel").setProperty(sFieldId + '/companyCode', oSelectedItem.getTitle());
            },
            //Currency
            onValueHelpRequest: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                var sTabIndex = oEvent.getSource().getBindingInfo("value").binding.getContext().getPath();
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.pas.pasawardsf.custom.onValueHelp",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oDialog) {
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("currencyCode", FilterOperator.Contains, sInputValue)]);
                    // Open ValueHelpDialog filtered by the input's value
                    if (oDialog.data("currency_code") === null) {
                        var oField = new sap.ui.core.CustomData();
                        oField.setKey("currency_code");
                        oField.setValue(sTabIndex);
                        oDialog.addCustomData(oField);
                    } else {
                        oDialog.getCustomData()[0].setValue(sTabIndex);
                    }
                    oDialog.open(sInputValue);
                });
            },
            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var filter = new Filter({
                    filters: [
                        new Filter({
                            path: 'currencyLongDescription',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        }),
                        new Filter({
                            path: 'currencyCode',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        })
                    ],
                    and: false
                });
                oEvent.getSource().getBinding("items").filter(filter);
            },
            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sFieldId = oEvent.getSource().data("currency_code");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.getView().getModel("oMAModel").setProperty(sFieldId + '/currency_code', oSelectedItem.getTitle());
                //this.byId("currencyCode").setValue(oSelectedItem.getTitle());

                this._pValueHelpDialog.destroy();
            },
            //CompanyCode
            handleValueHelp: function () {
                var oView = this.getView();
                if (!this._pValueHelpDialogCC) {
                    this._pValueHelpDialogCC = Fragment.load({
                        id: oView.getId(),
                        name: "com.pas.pasawardsf.custom.onCompanyCode",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialogCC.then(function (oValueHelpDialog) {
                    this._configValueHelpDialog();
                    oValueHelpDialog.open();
                }.bind(this));
            },
            _configValueHelpDialog: function () {
                var sInputValue = this.byId("companyCode").getValue();
            },
            handleValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput = this.byId("companyCode");
                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }
                oInput.setValue(oSelectedItem.getCells()[0].getText());
            },
            handleValueHelpCancel: function (oEvent) {
                // this._pValueHelpDialogCC.then(function (oValueHelpDialog) {
                //     oValueHelpDialog.close();
                // }.bind(this));
            },
            handleSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var filter = new Filter({
                    filters: [
                        new Filter({
                            path: 'companyCode',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        }),
                        new Filter({
                            path: 'companyCodeName',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        })
                    ],
                    and: false
                });
                oBinding = oEvent.getSource().getBinding("items").filter(filter);
            },
            
             //Cost enter
             onValueHelpRequestCostCenter: function (oEvent) {
                var comCd = this.getView().getModel("oMAModel").getProperty(oEvent.getSource().getBindingContext("oMAModel").getPath() + "/companyCode");
                if(!comCd || comCd ===""){
                    MessageBox.error('Please select Company Code to fetch respected Cost Center');
                    return;
                }
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                var sTabIndex = oEvent.getSource().getBindingInfo("value").binding.getContext().getPath();
                if (!this._pValueHelpDialogCostCenter) {
                    this._pValueHelpDialogCostCenter = Fragment.load({
                        id: oView.getId(),
                        name: "com.pas.pasawardsf.custom.onCostCenter",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogCostCenter.then(function (oDialog) {
                    // Create a filter for the binding  
                    var today = new Date().toISOString().split('T')[0];
                    var sfilters = new Filter({
                        filters: [
                          new Filter("costCenterCode", FilterOperator.Contains, sInputValue),
                          new Filter("companyCode", FilterOperator.EQ, comCd),
                          new Filter("lockIndicatorForPlanSecondaryCost", FilterOperator.EQ, ''),
                          new Filter("lockIndicatorForActualSecondaryCost", FilterOperator.EQ, ''),
                          new Filter("maxDateFlag", FilterOperator.EQ, 'Y'),
                          new Filter("validTo", FilterOperator.GE, today),
                        ],
                        and: true,
                      });
                    oDialog.getBinding("items").filter(sfilters);
                   // oDialog.getBinding("items").filter([new Filter("costCenterCode", FilterOperator.Contains, sInputValue)]);
                    if (oDialog.data("costCenter") === null) {
                        var oField = new sap.ui.core.CustomData();
                        oField.setKey("costCenter");
                        oField.setValue(sTabIndex);
                        oDialog.addCustomData(oField);
                    } else {
                        oDialog.getCustomData()[0].setValue(sTabIndex);
                    }
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(sInputValue);
                });
            },
            onValueHelpSearchCostCenter: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var today = new Date().toISOString().split('T')[0];
                var comCd = this.getView().getModel("oMAModel").getProperty(oEvent.getSource().data("costCenter") + "/companyCode");
                var filter = new Filter({
                    filters: [
                        new Filter({ path: 'costCenterCode', operator: FilterOperator.Contains, value1: sValue }),
                        new Filter({ path: 'costCenterName', operator: FilterOperator.Contains, value1: sValue })
                    ],
                    and: false
                });
                var filter2 = new Filter({
                    filters: [filter,                        
                        new Filter({  path: 'companyCode',  operator: FilterOperator.EQ,  value1: comCd, }),
                        new Filter("lockIndicatorForPlanSecondaryCost", FilterOperator.EQ, ''),
                        new Filter("lockIndicatorForActualSecondaryCost", FilterOperator.EQ, ''),
                        new Filter("maxDateFlag", FilterOperator.EQ, 'Y'),
                        new Filter("validTo", FilterOperator.GE, today),
                    ],
                    and: true
                });
                oEvent.getSource().getBinding("items").filter(filter2);
            },
            onValueHelpCloseCostCenter: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sFieldId = oEvent.getSource().data("costCenter");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                // this.byId("CostCenter").setValue(oSelectedItem.getTitle());
                this.getView().getModel("oMAModel").setProperty(sFieldId + '/costCenter', oSelectedItem.getTitle());
            },

             //Country
             onValueHelpRequestCountry: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                var sTabIndex = oEvent.getSource().getBindingInfo("value").binding.getContext().getPath();
                if (!this._pValueHelpDialogCountry) {
                    this._pValueHelpDialogCountry = Fragment.load({
                        id: oView.getId(),
                        name: "com.pas.pasawardsf.custom.onCountry",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogCountry.then(function (oDialog) {
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("countryCode", FilterOperator.Contains, sInputValue)]);
                    if (oDialog.data("country") === null) {
                        var oField = new sap.ui.core.CustomData();
                        oField.setKey("country");
                        oField.setValue(sTabIndex);
                        oDialog.addCustomData(oField);
                    } else {
                        oDialog.getCustomData()[0].setValue(sTabIndex);
                    }
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(sInputValue);
                });
            },
            onValueHelpSearchCountry: function (oEvent) {
                var sValue = oEvent.getParameter("value");

                var filter = new Filter({
                    filters: [
                        new Filter({
                            path: 'countryCode',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        }),
                        new Filter({
                            path: 'countryName',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        })
                    ],
                    and: false
                });
                oEvent.getSource().getBinding("items").filter(filter);
            },
            onValueHelpCloseCountry: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sFieldId = oEvent.getSource().data("country");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }             
                this.getView().getModel("oMAModel").setProperty(sFieldId + '/country', oSelectedItem.getTitle());
            },
        });
    });

