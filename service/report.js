/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-06-08 10:13:48
 * @desc [description]
 */
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Avatar, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import { liveIp } from '../config/IpAddress';

export const allReports = (reportName, image, md, xs, padding, Download, ReportNo, id) => {
  return (
    <Grid item md={md} xs={xs} p={padding}>
      <Card>
        <Button onClick={() => Download(ReportNo, id)} sx={{ width: '100%', justifyContent: 'left' }}>
          <CardContent>
            <Grid container spacing={2.5} sx={{ justifyContent: 'left' }}>
              <Grid item mt={1} pl={1.5}>
                <Avatar
                  sx={{
                    backgroundColor: purple[600],
                    height: 50,
                    width: 50,
                  }}
                >
                  <CloudDownloadIcon />
                </Avatar>
              </Grid>
              <Grid item pl={2}>
                <Typography
                  mt={2}
                  sx={{
                    color: '#008000',
                    fontSize: '20px',
                    fontWeight: '700',
                    p: '2px',
                  }}
                >
                  {reportName}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Button>
      </Card>
    </Grid>
  );
};
