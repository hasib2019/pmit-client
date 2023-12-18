import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfMake from 'html-to-pdfmake';
// Register fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  SolaimanLipi: {
    normal: 'http://localhost:3090/fonts/NikoshRegular.ttf', // Ensure the file path is correct
    bold: 'http://localhost:3090/fonts/NikoshRegular.ttf',
    italics: 'http://localhost:3090/fonts/NikoshRegular.ttf',
    bolditalics: 'http://localhost:3090/fonts/NikoshRegular.ttf',
  },
  englishFront: {
    normal: 'http://localhost:3090/fonts/times_new_roman.ttf', // Ensure the file path is correct
    bold: 'http://localhost:3090/fonts/times_new_roman.ttf',
    italics: 'http://localhost:3090/fonts/times_new_roman.ttf',
    bolditalics: 'http://localhost:3090/fonts/times_new_roman.ttf',
  },
};

const GeneratePDF = () => {
  const html = `<h1>(২) সমিতির ঠিকানা পরিবর্তন করিতে হইলে ব্যবস্থাপনা কমিটির সিদ্ধান্তক্রমে </h1><p>নিবদ্ধককে লিখিতভাবে অবহিত করতে হইবে এবং উপ-আইন সংশোধন করিতে হইবে। বিষয় বা প্রসঙ্গের প্রয়োজনে ভিন্নরূপ না হইলে, এই উপ-আইনে</p>`;
  const docDefinition = {
    content: [
      {
        text: 'Heading',
        style: 'heading',
      },
      {
        text: htmlToPdfMake(html),
        style: 'body',
      },
      {
        text: htmlToPdfMake('<h4>This is emphasized text using a different font.</h4>'),
        style: 'emphasis',
      },
    ],
    styles: {
      heading: {
        fontSize: 16,
        font: 'SolaimanLipi',
        bold: true,
        margin: [0, 0, 0, 10],
      },
      body: {
        fontSize: 13,
        font: 'SolaimanLipi',
        margin: [0, 0, 0, 5],
        lineHeight: 1.5,
      },
      emphasis: {
        fontSize: 13,
        font: 'SolaimanLipi',
        decoration: 'underline',
        margin: [0, 0, 0, 5],
      },
    },

    defaultStyle: {
      font: 'englishFront', // Set the default font for the document
    },
  };

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  // pdfDocGenerator.getBlob((blob) => {
  //   // Log the generated blob object for debugging purposes
  // });

  pdfDocGenerator.download('sample.pdf');
};

export default GeneratePDF;
