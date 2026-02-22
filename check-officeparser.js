const officeparser = require("officeparser");
const fs = require("fs");

async function test() {
    console.log("OfficeParser version:", require("officeparser/package.json").version);
    console.log("Available exports:", Object.keys(officeparser));

    // Test with a dummy buffer if needed, but let's just see the keys
}
test();
