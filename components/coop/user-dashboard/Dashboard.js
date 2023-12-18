import { Box, Container, Grid } from '@mui/material';
import EditComponentList from 'components/utils/coop/EditComponentList';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AllApplication from './AllApplication';
import AplApplication from './AplApplication';
import CancelApplication from './CancelApplication';
import NewApplication from './NewApplication';

const Dashboard = () => {
  const [stepId] = useState(0);
  useEffect(() => {
    dataStore();
  }, [stepId]);
  const dataStore = () => {
    const stepfoundId = localStorage && localStorage.stepId ? localStorage.stepId : null;
    if (stepfoundId == null) {
      localStorage.setItem('stepId', JSON.stringify(stepId));
    }
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
        }}
        xs={12}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2.5}>
            {/* <Grid item lg={4} md={4} xs={12}>
              <Paper sx={{ p: { xs: 1, md: 2 } }} elevation={3} rounded="true">
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    sx={{
                      height: 80,
                      mb: 2,
                      width: 80,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <List sx={{ width: "100%" }}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              নাম
                            </Typography>
                            {" — মোঃ সাইফুর রহমান"}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              এনআইডি
                            </Typography>
                            {" — 235 586 3548"}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              ফোন
                            </Typography>
                            {" — +৮৮ ০১৮২৯-০৪১৬৯৯ "}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              জন্ম তারিখ
                            </Typography>
                            {" — 17/07/1985 "}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              ইমেইল
                            </Typography>
                            {" — saifur1985bd@gmail.com "}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              অফিস
                            </Typography>
                            {" — জেলা সমবায় অফিসার , ঢাকা "}
                          </>
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              </Paper>
            </Grid> */}
            <Grid item lg={12} md={12} xs={12}>
              <Grid container>
                <Grid item lg={12} md={12} xs={12}>
                  <Grid container spacing={2.5}>
                    <Link href="#" passHref>
                      <Grid item lg={3} md={3} xs={12}>
                        <AllApplication />
                      </Grid>
                    </Link>
                    <Link href="#" passHref>
                      <Grid item lg={3} md={3} xs={12}>
                        <NewApplication />
                      </Grid>
                    </Link>
                    <Link href="#" passHref>
                      <Grid item lg={3} md={3} xs={12}>
                        <AplApplication />
                      </Grid>
                    </Link>
                    <Link href="#" passHref>
                      <Grid item lg={3} md={3} xs={12}>
                        <CancelApplication />
                      </Grid>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <EditComponentList />
    </>
  );
};

export default Dashboard;
