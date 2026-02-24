const officeparser = require("officeparser");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

async function verifyFix() {
    const pdfPath = path.join(process.cwd(), "DocumentQA", "uploads", "data_mining.pdf");

    if (!fs.existsSync(pdfPath)) {
        console.error("PDF file not found at:", pdfPath);
        return;
    }

    console.log("Starting verification...");

    // Mimic the API route logic
    let workerSrc = "";
    try {
        const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
        workerSrc = pathToFileURL(workerPath).href;
        console.log("Resolved local worker URL:", workerSrc);
    } catch (e) {
        console.warn("Could not resolve local worker, using CDN fallback.");
        workerSrc = "https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs";
    }

    try {
        console.log("Attempting to parse PDF with config...");
        const buffer = fs.readFileSync(pdfPath);
        const ast = await officeparser.parseOffice(buffer, {
            pdfWorkerSrc: workerSrc
        });
        const text = ast.toText();
        console.log("--- SUCCESS ---");
        console.log("Extracted text length:", text.length);
        console.log("First 200 chars:", text.substring(0, 200).replace(/\n/g, ' '));
        console.log("Verification PASSED.");
    } catch (err) {
        console.error("Verification FAILED:", err);
        process.exit(1);
    }
}

verifyFix();
