const officeparser = require("officeparser");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

async function testPdf() {
    const pdfPath = path.join(process.cwd(), "DocumentQA", "uploads", "data_mining.pdf");

    if (!fs.existsSync(pdfPath)) {
        console.error("PDF file not found at:", pdfPath);
        return;
    }

    try {
        console.log("Attempting to parse:", pdfPath);

        // Fix for Windows ESM issue in pdfjs-dist
        // const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
        // const workerUrl = pathToFileURL(workerPath).href;

        const ast = await officeparser.parseOffice(fs.readFileSync(pdfPath), {
            pdfWorkerSrc: "https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs"
        });
        const data = ast.toText();
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
