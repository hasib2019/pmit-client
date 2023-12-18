
import axios from 'axios';
import htmlToPdfMake from 'html-to-pdfmake';
import { useEffect, useState } from 'react';
import { engToBang } from 'service/numberConverter';
import GeneratePDF from 'service/pdf/GeneratePDF';
import { byLawsReportApi } from '../../../../url/coop/ApiList';

const headerCss = {
  fontSize: 13,
  font: 'Nikos',
  bold: true,
  lineHeight: 1.5,
  margin: [0, 10],
  textAlign: 'center',
};
const bodyCss = {
  fontSize: 13,
  lineHeight: 3,
  font: 'Nikos',
  margin: [0, 0, 0, 5],
};
const footerCss = {
  fontSize: 13,
  lineHeight: 3,
  font: 'englishFront',
  padding: '10px',
  margin: [0, 0, 0, 5],
};

const ByLawsReport = ({ samityId }) => {
  // heading,body,footer
  const [content, setContent] = useState([]);
  useEffect(() => {
    getSamityDataByUser(samityId);
  }, [samityId]);

  const getSamityDataByUser = async (id) => {
    const getData = await axios.get(byLawsReportApi + id);
    let byLaws = getData?.data?.data?.by_laws;
    let updatedContent = [...content]; // Create a copy of the existing content

    byLaws?.map((element) => {
      if (element.name_En == 'samityName_Address') {
        //
      } else if (element.name_En == 'memberWorking_Area') {
        //
      } else {
        updatedContent.push({
          text: htmlToPdfMake(`<h4 style="text-align: center">${element?.name}</h4>`),
          style: 'heading',
        });
        element.data.map((row) => {
          if (row.type == 'partial') {
            updatedContent.push({
              text: htmlToPdfMake(
                `<p><b>${engToBang(row?.section_no)}| ${row?.section_name}:- </b> ${row.data
                  .map((obj) => obj.data)
                  .join(' ')}</p>`,
              ),
              style: 'body',
            });
          } else if (row.type == 'text') {
            updatedContent.push({
              text: htmlToPdfMake(
                `<p><b>${engToBang(row?.section_no)}| ${row?.section_name}:- </b> ${row?.data}</p></br></br>`,
              ),
              style: 'body',
            });
          }
        });
      }
    });
    setContent(updatedContent); // Update the state after the loop
    GeneratePDF({
      content: updatedContent,
      headerCss,
      bodyCss,
      footerCss,
    });
    // setContent([
    //     ...content,
    //     {
    //         text: htmlToPdfMake(first),
    //         style: 'heading'
    //     }
    // ])
  };

  // const generatePDF = async () => {
  //     GeneratePDF({
  //         content,
  //         headerCss,
  //         bodyCss,
  //         footerCss
  //     })
  // };
  return (
    <div>
      <h1>Next.js PDF Generation</h1>
      {/* <button onClick={generatePDF}>Generate PDF</button> */}
    </div>
  );
};

export default ByLawsReport;
