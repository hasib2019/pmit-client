import AddIcons from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import React from 'react';
import SubHeading from '../../../shared/others/SubHeading';
const DocSectionHeader = ({ addMoreDoc }) => {
  return (
    <>
      <SubHeading>
        <span>প্রয়োজনীয় ডকুমেন্ট</span>
        <Button className="btn btn-primary" variant="contained" onClick={addMoreDoc} size="small">
          <AddIcons /> ডকুমেন্ট যোগ করুন
        </Button>
      </SubHeading>
    </>
  );
};

export default DocSectionHeader;
