
module.exports = function(RED) {
    "use strict";

    function ibanUtilsNode(n) {

        var IBAN = require('iban');

        RED.nodes.createNode(this, n);
        this.action = n.action;
        this.property = n.property || "payload";
        var node = this;

        this.on('input', function (msg) {
            try {
                var nodeContext = this.context();
                nodeContext.prop = msg[this.property];
                if (node.action === "bban2iban") {
                    //Array check
                    if(Array.isArray(nodeContext.prop)) {
                        for(var i=0;i<nodeContext.prop.length;i++){
                            if(IBAN.isValidBBAN(nodeContext.prop[i].countryCode, nodeContext.prop[i].bban)){
                                nodeContext.prop[i].iban=IBAN.fromBBAN(nodeContext.prop[i].countryCode, nodeContext.prop[i].bban);
                                nodeContext.prop[i].electronicFormat = IBAN.electronicFormat(nodeContext.prop[i].iban);
                                nodeContext.prop[i].printFormat = IBAN.printFormat(nodeContext.prop[i].iban, nodeContext.prop[i].separator);                            
                                nodeContext.prop[i].isValidIban=true;
                            }
                            else{
                                nodeContext.prop[i].isValidIban=false;
                                try{
                                    IBAN.fromBBAN(nodeContext.prop[i].countryCode, nodeContext.prop[i].bban);
                                }
                                catch(e){
                                    nodeContext.prop[i].err=e;
                                }
                                nodeContext.prop.returnError = true;
                            }
                        }
                        nodeContext.prop.returnError? node.send([null,msg]) : node.send([msg,null]);
                    }
                    else{
                        //Single conversion
                        if(IBAN.isValidBBAN(nodeContext.prop.countryCode, nodeContext.prop.bban)){
                            nodeContext.prop.iban=IBAN.fromBBAN(nodeContext.prop.countryCode, nodeContext.prop.bban);
                            nodeContext.prop.electronicFormat = IBAN.electronicFormat(nodeContext.prop.iban);
                            nodeContext.prop.printFormat = IBAN.printFormat(nodeContext.prop.iban, nodeContext.prop.separator);                            
                            nodeContext.prop.isValidIban=true;
                            node.send([msg,null]);
                        }
                        else{
                            nodeContext.prop.isValidBban=false;
                            try{
                                IBAN.fromBBAN(nodeContext.prop.countryCode, nodeContext.prop.bban);
                            }
                            catch(e){
                                nodeContext.prop.err=e;
                            }
                            node.send([null,msg]);
                        }
                    }

                }
                if (node.action === "iban2bban") {
                    //Array check
                    if(Array.isArray(nodeContext.prop)) {
                        for(var i=0;i<nodeContext.prop.length;i++){
                            if(IBAN.isValid(nodeContext.prop[i].iban)){
                                nodeContext.prop[i].bban=IBAN.toBBAN(nodeContext.prop[i].iban, nodeContext.prop[i].separator);
                                nodeContext.prop[i].electronicFormat = IBAN.electronicFormat(nodeContext.prop[i].iban);
                                nodeContext.prop[i].printFormat = IBAN.printFormat(nodeContext.prop[i].iban, nodeContext.prop[i].separator); 
                                nodeContext.prop[i].isValidIban=true;
                            }
                            else{
                                nodeContext.prop[i].isValidIban=false;
                                try{
                                    IBAN.toBBAN(nodeContext.prop[i].iban, nodeContext.prop[i].separator);
                                }
                                catch(e){
                                    nodeContext.prop[i].err=e;
                                }
                                nodeContext.prop.returnError = true;
                            }
                        }
                        nodeContext.prop.returnError? node.send([null,msg]) : node.send([msg,null]);
                    }
                    else{
                        //Single conversion
                        if(IBAN.isValid(nodeContext.prop.iban)){
                            nodeContext.prop.bban = IBAN.toBBAN(nodeContext.prop.iban, nodeContext.prop.separator);
                            nodeContext.prop.electronicFormat = IBAN.electronicFormat(nodeContext.prop.iban);
                            nodeContext.prop.printFormat = IBAN.printFormat(nodeContext.prop.iban, nodeContext.prop.separator);
                            node.send([msg,null]);
                        }
                        else{
                            nodeContext.prop.isValidIban=false;
                            try{
                                IBAN.toBBAN(nodeContext.prop.iban, nodeContext.prop.separator);
                            }
                            catch(e){
                                nodeContext.prop.err=e;
                            }
                            node.send([null,msg]);
                        }
                    }            
                }
            }
            catch(e){
                msg.error = e;
                node.send([null,msg]);
            };
        });

    }
    RED.nodes.registerType("IbanUtils", ibanUtilsNode);
}
