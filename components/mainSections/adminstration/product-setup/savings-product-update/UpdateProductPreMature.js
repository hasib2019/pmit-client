
import { Button, Grid, Paper, TextField } from '@mui/material';
import { engToBang } from '../../../samity-managment/member-registration/validator';


const UpdateProductPreMature = ({
  productInstallment,
  prevProductInstallment,
  handleProductInstallment,
  deleteProductInstallment,
}) => {


  return (
    <>
      {productInstallment.map((v, i) => (
        <Paper
          sx={{
            padding: '30px 20px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            marginBottom: '10px',
          }}
          key={i}
        >
          <Grid container spacing={2.5} className="section">
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="সময়কাল"
                name="timePeriod"
                onChange={(e) => handleProductInstallment(e, i)}
                id="numberWithCharge"
                // disabled={prevProductInstallment?.length > i}
                value={engToBang(v.timePeriod)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="মুনাফার হার"
                name="interestRate"
                onChange={(e) => handleProductInstallment(e, i)}
                id="numberWithCharge"
                // disabled={prevProductInstallment?.length > i}
                value={engToBang(v.interestRate)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="ম্যাচুরিটি পরিমাণ"
                name="maturityAmount"
                onChange={(e) => handleProductInstallment(e, i)}
                id="numberWithCharge"
                // disabled={prevProductInstallment?.length > i}
                value={engToBang(v.maturityAmount)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            {i >= prevProductInstallment?.length && (
              <Grid item md={4} xs={12}>
                <Button variant="contained" className="buttonCancel" onClick={(e) => deleteProductInstallment(e, i)}>
                  বাতিল করুন
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}
    </>
  );
};

export default UpdateProductPreMature;
