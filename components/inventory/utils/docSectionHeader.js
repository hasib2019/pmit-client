import React from 'react';
import { Button, Grid } from '@mui/material';

import AddIcons from '@mui/icons-material/Add';
import SubHeading from '../../shared/others/SubHeading';
import { handleAddDocumentList } from 'features/inventory/documentSection/documentSectionSlice';
import { useSelector, useDispatch } from 'react-redux';
const DocSectionHeader = () => {
  const dispatch = useDispatch();
  const { disableAddDoc } = useSelector((state) => state.docSection);
  // const { documentTypes } = useSelector((state) => state.purchaseOrder);
  return (
    <>
      <Grid item sm={12} md={12} xs={12}>
        <SubHeading>
          <span>প্রয়োজনীয় ডকুমেন্ট </span>
          <Button
            className="btn btn-primary"
            variant="contained"
            onClick={() => {
              dispatch(handleAddDocumentList());
            }}
            size="small"
            disabled={disableAddDoc}
            startIcon={<AddIcons />}
          >
            {' '}
            ডকুমেন্ট যোগ করুন
          </Button>
        </SubHeading>
      </Grid>
    </>
  );
};

export default DocSectionHeader;
