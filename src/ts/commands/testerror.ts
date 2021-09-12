import { Command, CommandResponse } from "../command";

const testerrorCommand: Command = {
    name: "testerror",
    exec: () => CommandResponse.ERROR
}
export default testerrorCommand;