module.exports = {
    executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
        console.log("Product action called: " + actionDefinition.name);

        if (actionDefinition.name === "continueProduct") {
            odataRequest.addMessage(0, "Product continued successfully", 2, "");
        } else if (actionDefinition.name === "discontinueProduct") {
            odataRequest.addMessage(0, "Product discontinued successfully", 2, "");
        }
        return undefined;
    }
};