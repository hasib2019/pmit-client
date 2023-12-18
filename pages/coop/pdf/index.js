/* eslint-disable react-hooks/rules-of-hooks */
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
import GeneratePDF from 'service/pdf/GeneratePDF';
const index = () => {
  const title = 'সভার কার্যবিবরণী';

  const headerCss = {
    fontSize: 30,
    font: 'englishFront',
    bold: false,
    margin: [0, 0, 0, 10],
  };

  const bodyCss = {
    fontSize: 12,
    font: 'SolaimanLipi',
    margin: [0, 0, 0, 5],
    lineHeight: 1.5,
  };

  const footerCss = {
    fontSize: 13,
    font: 'englishFront',
    padding: '10px',
    margin: [0, 0, 0, 5],
  };

  const bodyData = '<h1>(২) সমিতির ঠিকানা পরিবর্তন করিতে হইলে ব্যবস্থাপনা কমিটির সিদ্ধান্তক্রমে </h1>';

  const generatePDF = async () => {
    GeneratePDF({
      header: 'By Laws Generator',
      body: bodyData,
      footer: '<h4>This is emphasized text using a different font.</h4>',
      headerCss,
      bodyCss,
      footerCss,
    });
  };

  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <div>
            <h1>Next.js PDF Generation</h1>
            <button onClick={generatePDF}>Generate PDF</button>
          </div>
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default index;
