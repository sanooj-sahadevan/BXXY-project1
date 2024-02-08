const PDFDocument = require("pdfkit");





function generateHeader(doc) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("BXXY.", 110, 57)
    .fontSize(10)
    .text("BXXY World, BXXY Street, BXXY city, Coimbatore, Tamil Nadu", 200, 65, {
      align: "right",
    })
    .text(" Coimbatore, TN- 6100025", 200, 80, { align: "right" })
    .moveDown();
}

function generateFooter(doc) {
  doc.fontSize(10).text("Thank You! Shop with us again :)", 50, 750, {
    align: "center",
    width: 500,
  });
}
function generateCustomerInformation(doc, orderData) {
  const addressChosen = orderData.addressChosen;

  doc
    .text(`Order Number: ${orderData.orderNumber}`, 50, 100)
    .text(
      `Order Date: ${new Date(orderData.orderDate).toLocaleDateString()}`,
      50,
      115
    )
    .text(`Total Price: ${orderData.grandTotalCost}`, 50, 130)
    .text(
      `Name: ${addressChosen.firstName} ${addressChosen.lastName}`,
      300,
      100
    )
    .text(
      `Address: ${addressChosen.addressLine1} ${addressChosen.addressLine2} `,
      300,
      115
    )
    .text(`Phone: ${addressChosen.phone}`, 300, 150)
    .moveDown();
}

function generateBody(doc, orderData) {
  generateHr(doc, 90);

  doc.fontSize(15).text("Invoice", 210, 170);

  doc.font("Helvetica-Bold").fontSize(14).text("Product", 50, 240);
  doc.text("Quantity", 250, 240);
  doc.text("Price", 350, 240, { width: 100, align: "right" });

  doc.moveDown();
  generateHr(doc, 260);

  orderData.cartData.forEach((v, i) => {
    doc.fontSize(10).text(v.productId.productName, 50, 260 + (i + 1) * 20);
    doc.text(v.productQuantity.toString(), 250, 260 + (i + 1) * 20);
    doc.text('Rs.'+v.totalCostPerProduct, 350, 260 + (i + 1) * 20, {
      width: 100,
      align: "right",
    });

    if (i !== orderData.cartData.length - 1) {
      doc.moveDown();
    }
  });

  generateHr(doc, doc.y);
  doc.moveDown();

  doc
    .fontSize(14)
    .text(`Total Price: ${'Rs.'+orderData.grandTotalCost}`, 350, doc.y);
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}



const generatevoice = (dataCallback, endCallback, orderData) => {
    let doc = new PDFDocument({ size: "A4", margin: 50 });
console.log(doc);
    generateHeader(doc);
    generateCustomerInformation(doc, orderData);
    generateBody(doc, orderData);
    generateFooter(doc);
    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    doc.end();
  }



module.exports = {generatevoice}