import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { jsPDF } from "jspdf";
import mammoth from "mammoth";
import { PERSONAL_INFO } from "@/data";

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public");

    // Candidate PDF files in public/
    const pdfCandidates = [
      "Harish_Chintala_Resume.pdf",
      "resume.pdf",
      "Resume.pdf",
      "Harish-Chintala-Resume.pdf",
    ];

    for (const filename of pdfCandidates) {
      const filePath = path.join(publicDir, filename);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(new Uint8Array(fileBuffer), {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="Harish_Chintala_Resume.pdf"',
            "Content-Length": fileBuffer.byteLength.toString(),
          },
        });
      }
    }

    // Candidate DOCX / DOC files in public/ -> convert text to PDF output
    const docxCandidates = [
      "Harish_Chintala_Resume.docx",
      "resume.docx",
      "Resume.docx",
      "Harish_Chintala_Resume.doc",
      "resume.doc",
    ];

    for (const filename of docxCandidates) {
      const filePath = path.join(publicDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          const docxBuffer = fs.readFileSync(filePath);
          const result = await mammoth.extractRawText({ buffer: docxBuffer });
          const text = result.value;

          // Generate PDF from extracted DOCX text
          const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
          const margin = 40;
          const contentWidth = doc.internal.pageSize.getWidth() - margin * 2;
          let y = 50;

          const lines = text.split("\n").filter((line) => line.trim().length > 0);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);

          for (const line of lines) {
            if (y > 780) {
              doc.addPage();
              y = 50;
            }
            const wrapped = doc.splitTextToSize(line, contentWidth);
            doc.text(wrapped, margin, y);
            y += wrapped.length * 13 + 4;
          }

          const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
          return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": 'attachment; filename="Harish_Chintala_Resume.pdf"',
              "Content-Length": pdfBuffer.byteLength.toString(),
            },
          });
        } catch (err) {
          console.error("Error converting DOCX to PDF:", err);
        }
      }
    }

    // Fallback: Generate clean structured PDF from portfolio data
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    let y = 45;
    const margin = 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(20, 30, 60);
    doc.text(PERSONAL_INFO.name, margin, y);
    y += 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(56, 189, 248);
    doc.text(PERSONAL_INFO.title, margin, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 90, 110);
    doc.text(`${PERSONAL_INFO.location} | ${PERSONAL_INFO.email} | ${PERSONAL_INFO.phone}`, margin, y);

    const pdfArrayBuffer = doc.output("arraybuffer");
    const pdfUint8 = new Uint8Array(pdfArrayBuffer);

    return new NextResponse(pdfUint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Harish_Chintala_Resume.pdf"',
        "Content-Length": pdfUint8.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Resume API error:", error);
    return new NextResponse("Error generating resume PDF", { status: 500 });
  }
}
