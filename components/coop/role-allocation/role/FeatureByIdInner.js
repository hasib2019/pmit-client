

import BeenhereIcon from '@mui/icons-material/Beenhere';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { Collapse, Grid, List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const FeatureByIdInner = (props) => {
  const { feature, allFeatures } = props;
  const updatedColor = useSelector((state) => state.ColorSlice.colorBucket);
  const [menuOpen, setMenuOpen] = React.useState([]);

  useEffect(() => {
    let menuTemp = [];
    for (let v of allFeatures) {
      if (v.type === 'P' && v.isRoot === false) {
        menuTemp.push({
          id: v.id,
          status: false,
        });
      }
    }
    setMenuOpen(menuTemp);
  }, []);

  const fontSizeChanger = (label) => {
    return <p style={{ fontSize: '14px', fontFamily: "'Bangla', sans-serif", margin: '0', padding: '5px' }}>{label}</p>;
  };

  const getMenuOpenStatus = (id) => {
    if (menuOpen.length === 0) return false;
    const status = menuOpen.find((v) => v.id === id).status;
    return status;
  };

  const handleMenuClick = (id) => {
    const menuArr = [...menuOpen];
    for (let [i, f] of menuArr.entries()) {
      if (f.id === id) menuArr[i].status = !f.status;
    }
    setMenuOpen([...menuArr]);
  };

  // const getInnerItems = () => {
  //   let temporary = [...allFeatures];
  //   let filterFeature = temporary.filter((v) => v.parentId === feature.id);
  //   // return filterFeature
  //   return filterFeature.map((v, i) => (
  //     <ListItemButton key={i} sx={{ pl: 4 }}>
  //       <ListItemIcon>
  //         <StarBorder />
  //       </ListItemIcon>
  //       <ListItemText primary={fontSizeChanger(v.featureNameBan)} />
  //     </ListItemButton>
  //   ));
  // };

  return (
    <>
      {feature.type === 'P' ? (
        <Grid item xl={6} lg={6} md={6} xs={12} sm={12}>
          <Paper>
            <ListItemButton onClick={() => handleMenuClick(feature.id)}>
              <ListItemIcon>
                <SettingsApplicationsIcon />
              </ListItemIcon>
              <ListItemText primary={fontSizeChanger(feature.featureNameBan)} />
              {getMenuOpenStatus(feature.id) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={getMenuOpenStatus(feature.id)} timeout="auto" unmountOnExit>
              <List component="div" disablePadding></List>
            </Collapse>
          </Paper>
        </Grid>
      ) : (
        <Grid item xl={6} lg={6} md={6} xs={12} sm={12}>
          <Paper>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <BeenhereIcon sx={{ color: updatedColor }} />
              </ListItemIcon>
              <ListItemText primary={fontSizeChanger(feature.featureNameBan)} />
            </ListItemButton>
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default FeatureByIdInner;
