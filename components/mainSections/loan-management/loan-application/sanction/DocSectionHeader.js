import AddIcons from '@mui/icons-material/Add';
import { Button, Grid } from '@mui/material';
import SubHeading from '../../../../shared/others/SubHeading';
const DocSectionHeader = ({ addMoreDoc, disableAddDoc }) => {
  return (
    <>
      <Grid container>
        <Grid item sm={12} md={12} xs={12}>
          <SubHeading>
            <span>প্রয়োজনীয় ডকুমেন্ট </span>
            <Button
              className="btn btn-primary"
              variant="contained"
              onClick={addMoreDoc}
              size="small"
              disabled={disableAddDoc}
              startIcon={<AddIcons />}
            >
              {' '}
              ডকুমেন্ট যোগ করুন
            </Button>
          </SubHeading>
        </Grid>
      </Grid>
    </>
  );
};

export default DocSectionHeader;
