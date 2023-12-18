/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { certificateVerify } from '../../../url/coop/ApiList';

const CertifiateCheck = (props) => {
  const { checkData } = props;
  useEffect(() => {
    parmanentReport();
  }, []);

  const [pdfView, setPdfView] = useState();
  const parmanentReport = async () => {
    try {
      const getReportData = await axios.get(certificateVerify + checkData.samityId, { responseType: 'arraybuffer' });
      var file = new Blob([getReportData.data], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      setPdfView(fileURL);
    } catch (error) {
      //
    }
  };

  // return <iframe src={pdfView} frameBorder="0" width="100%" height="700px" allow="fullscreen"></iframe>;
  return (
    <iframe
      src={pdfView}
      frameBorder="0"
      width="100%"
      height="700px"
      allowFullScreen
      style={{ border: 'none' }}
    ></iframe>
  );
};

export default CertifiateCheck;
