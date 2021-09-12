"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const testerrorCommand = {
    name: "testerror",
    exec: () => command_1.CommandResponse.ERROR
};
exports.default = testerrorCommand;
