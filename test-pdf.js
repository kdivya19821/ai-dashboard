const officeparser = require("officeparser");
const fs = require("fs");
const path = require("path");

async function testPdf() {
    const pdfPath = path.join(process.cwd(), "public", "uploads", "R Programming.pdf");

    if (!fs.existsSync(pdfPath)) {
        console.error("PDF file not found at:", pdfPath);
        return;
    }

    try {
        console.log("Attempting to parse:", pdfPath);
        const data = await officeparser.parseUint8Array(fs.readFileSync(pdfPath));
        console.log("--- EXTRACTION SUCCESS ---");
        console.log("Length:", data.length);
        console.log("First 500 characters:");
        console.log(data.substring(0, 500));
        console.log("--- END ---");
    } catch (err) {
        console.error("EXTRACTION FAILED:", err);
    }
}

testPdf();
