import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const handler = async (event) => {
  try {
    // Handle both API Gateway or direct invocation
    const data = typeof event.body === "string" ? JSON.parse(event.body) : event;

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid input: Expected a non-empty JSON array");
    }

    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(16);
    doc.text("Visitor Transit Report", 14, 20);

    // Extract headers dynamically
    const headers = [
      [
        "Transit ID",
        "Person Name",
        "Visitor Type",
        "Entry Gate",
        "Exit Gate",
        "Tower/Flat",
        "Vehicle",
        "Category",
        "Remark",
      ],
    ];

    // Prepare table rows
    const rows = data.map((item) => [
      item.transitId,
      item.personName || "N/A",
      item.visitorType || "N/A",
      `${item.entryGateName} (${item.entryDt})`,
      `${item.exitGateName} (${item.exitDt})`,
      `${item.towerName}-${item.flatName}`,
      `${item.vehicleType} (${item.lpNumber})`,
      item.vehicleCategory,
      item.transitRemark || "N/A",
    ]);

    // Generate AutoTable
    autoTable(doc, {
      startY: 30,
      head: headers,
      body: rows,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [52, 73, 94], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 10, right: 10 },
    });

    // Get Base64 PDF
    const pdfBase64 = doc.output("datauristring").split(",")[1];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=visitor-report.pdf",
      },
      body: pdfBase64,
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error("PDF generation error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "PDF generation failed",
        error: err.message,
      }),
    };
  }
};
