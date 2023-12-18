/* eslint-disable import/no-anonymous-default-export */
// pages/api/pdf.js
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Register the fonts with pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default async (req, res) => {
  try {
    // Define the content of your PDF
    const documentDefinition = {
      content: [
        {
          text: 'হ্যালো, বিশ্ব!',
          fontSize: 20,
          font: 'SolaimanLipi',
        },
      ],
      defaultStyle: {
        font: 'SolaimanLipi',
      },
    };

    // Create the PDF
    const pdfDoc = pdfMake.createPdf(documentDefinition);

    // Generate a buffer containing the PDF data
    const buffer = await new Promise((resolve) => {
      pdfDoc.getBuffer((buffer) => {
        resolve(buffer);
      });
    });

    // Set the response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');

    // Send the PDF buffer as the response
    res.send(buffer);
  } catch (error) {
    res.status(500).send(error);
  }
};
