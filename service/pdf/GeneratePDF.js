import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfMake from 'html-to-pdfmake';
import { frontEndIp } from '../../config/IpAddress';
// Register fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  SolaimanLipi: {
    normal: frontEndIp + 'fonts/SolaimanLipi.ttf', // Ensure the file path is correct
    bold: frontEndIp + 'fonts/SolaimanLipi.ttf',
    italics: frontEndIp + 'fonts/SolaimanLipi.ttf',
    bolditalics: frontEndIp + 'fonts/SolaimanLipi.ttf',
  },
  Nikos: {
    normal: frontEndIp + 'fonts/NikoshRegular.ttf', // Ensure the file path is correct
    bold: frontEndIp + 'fonts/NikoshRegular.ttf',
    italics: frontEndIp + 'fonts/NikoshRegular.ttf',
    bolditalics: frontEndIp + 'fonts/NikoshRegular.ttf',
  },
  englishFront: {
    normal: frontEndIp + 'fonts/times_new_roman.ttf', // Ensure the file path is correct
    bold: frontEndIp + 'fonts/times_new_roman.ttf',
    italics: frontEndIp + 'fonts/times_new_roman.ttf',
    bolditalics: frontEndIp + 'fonts/times_new_roman.ttf',
  },
};

const GeneratePDF = (pdfData) => {
  const docDefinition = {
    content: pdfData?.content, //Here is Html content print
    footer: (currentPage, pageCount) => {
      return { text: `Page ${currentPage} of ${pageCount}`, alignment: 'center' };
    },
    styles: {
      heading: pdfData?.headerCss,
      body: pdfData?.bodyCss,
      footer: pdfData?.footerCss,
    },

    defaultStyle: {
      font: 'englishFront', // Set the default font for the document
    },
  };

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  pdfDocGenerator.getBlob((blob) => {
    // Log the generated blob object for debugging purposes
  });

  pdfDocGenerator.download('sample.pdf');
};

export default GeneratePDF;
