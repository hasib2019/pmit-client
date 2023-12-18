
import { useEffect } from 'react';
import GeneratePDF from 'service/pdf/GeneratePDF';

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

const ByLawsInfo = ({ samityId }) => {
  // heading,body,footer
  // const [content, setContent] = useState([]);
  useEffect(() => {
    getSamityDataByUser(samityId);
  }, [samityId]);

  const getSamityDataByUser = async () => {
    // const getData = await axios.get(byLawsInfoReportApi + id);
    // let byLawsInfo = getData?.data?.data;
    // const first = byLaws[0]?.data[1]?.data
    // let updatedContent = [...content]; // Create a copy of the existing content

    // byLaws?.map((element) => {
    //     if (element.name_En == "samityName_Address") {

    //     } else if (element.name_En == "memberWorking_Area") {

    //     } else {
    //         updatedContent.push({
    //             text: htmlToPdfMake(`<h4 style="text-align: center">${element?.name}</h4>`),
    //             style: 'heading'
    //         });
    //         element.data.map((row) => {
    //             if (row.type == "partial") {
    //                 updatedContent.push({
    //                     text: htmlToPdfMake(`<p><b>${engToBang(row?.section_no)}| ${row?.section_name}:- </b> ${row.data.map(obj => obj.data).join(' ')}</p>`),
    //                     style: 'body'
    //                 });
    //             } else if (row.type == "text") {
    //                 updatedContent.push({
    //                     text: htmlToPdfMake(`<p><b>${engToBang(row?.section_no)}| ${row?.section_name}:- </b> ${row?.data}</p></br></br></br>`),
    //                     style: 'body'
    //                 });
    //             }
    //         });

    //     }
    // });
    // setContent(updatedContent); // Update the state after the loop
    GeneratePDF({
      content: '',
      headerCss,
      bodyCss,
      footerCss,
    });
  };

  return (
    <div>
      <h1>Next.js PDF Generation</h1>
      {/* <button onClick={generatePDF}>Generate PDF</button> */}
    </div>
  );
};

export default ByLawsInfo;
