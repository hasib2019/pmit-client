/* eslint-disable jsx-a11y/aria-props */
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';
import DayClose from './DayClose';
import DayOpen from './DayOpen';

function TabPanel(props) {
  // eslint-disable-next-line no-unused-vars
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      // eslint-disable-next-line react/no-unknown-property
      aria-lablelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.prototype = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function DayOpneClose() {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        width: '100%',
        // "& .MuiBox-root": {
        //   padding: " 24px 0px",ss
        // },
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="ডে ওপেন" {...a11yProps(0)} />
          <Tab label="ডে ওপেন ক্লোজ" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0} className="tabData" sx={{}}>
        <DayOpen />
      </TabPanel>
      <TabPanel value={tabValue} index={1} className="tabData">
        <DayClose />
      </TabPanel>
    </Box>
  );
}
