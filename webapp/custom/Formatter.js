
sap.ui.define([], function () {
    "use strict";
    return {
        disbaleOnMA: function (dates) {
            if(dates.length === 1 ){
                return true;
            } else {
                return false;
            }
         }


    };
});