const officeparser = require("officeparser");
const fs = require("fs");

async function test() {
    console.log("OfficeParser version:", require("officeparser/package.json").version);
    console.log("Available exports:", Object.keys(officeparser));

    if (typeof officeparser.parseOffice === 'function') {
        console.log("parseOffice is a function");
        // We can't easily parse a real file here without one, but let's check for parseOfficeAsync
        console.log("parseOfficeAsync type:", typeof officeparser.parseOfficeAsync);
    }
}
test();
