

import AddIcons from '@mui/icons-material/AddCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { RoleCreate, roleFeatureTreeListRought } from '../../../../url/coop/RoleApi';
import RoleList from './RoleList';

const CreateRole = () => {
  const config = localStorageData('config');
  const [createRole, setCreateRole] = useState({
    roleName: '',
    description: '',
    checkedArray: [],
  });

  const [listRole, setListRole] = useState([]);
  const [switchActive, setSwitchActive] = useState(false);

  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [featureListTree, setFeatureListTree] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    getFreatureList();
    getRoleList();
  }, []);

  const handleChange = (e) => {
    setCreateRole({ ...createRole, [e.target.name]: e.target.value });
  };

  const toggleSwitch = () => {
    setSwitchActive(!switchActive);
  };
  const { roleName, description } = createRole;
  let getRoleList = async () => {
    try {
      let roleData = await axios.get(RoleCreate + '?isPagination=false', config);
      let resData = roleData.data.data;
      setListRole(resData);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getFreatureList = async () => {
    try {
      let allFeature = await axios.get(roleFeatureTreeListRought, config);
      setFeatureListTree(allFeature.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  let onSubmitData = async () => {
    const obj = {
      roleName: createRole.roleName,
      description: createRole.description,
      isActive: switchActive,
      features: checked ? checked : [],
    };
    if (checked.length > 0) {
      if (update) {
        try {
          let updateRole = await axios.put(RoleCreate + updateId, obj, config);
          let msg = updateRole.data.message;
          NotificationManager.success(msg, '', 5000);
        } catch (err) {
          errorHandler(err);
        }
        getRoleList();
        clearState();
        setExpanded([]);
        setChecked([]);
      } else {
        try {
          let newRole = await axios.post(RoleCreate, obj, config);
          NotificationManager.success(newRole.data.message, '', 5000);
          getRoleList();
          setExpanded([]);
          setChecked([]);
        } catch (err) {
          errorHandler(err);
        }
        clearState();
        setUpdate(false);
      }
    } else {
      NotificationManager.error('কোন ফিচার সংযুক্ত নাই');
      return;
    }
  };

  let getData = async (id, name, description, isActive) => {
    setUpdate(true);
    setUpdateId(id);
    setOpen(true);
    try {
      let allFeatures = await axios.get(RoleCreate + id, config);
      let features = allFeatures.data.data;
      if (features) {
        const newArray = features.assignedFeaturesIds.map((res) => res.toString());
        setCreateRole({
          ...createRole,
          roleName: features.roleName,
          description: features.description,
          checkedArray: newArray,
        });
        setSwitchActive(features.isActive);
        setChecked(newArray);
        setExpanded(newArray);
      } else {
        setCreateRole({
          ...createRole,
          roleName: name,
          description: description,
          checkedArray: [],
        });
        setSwitchActive(isActive);
        setChecked([]);
        setExpanded([]);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const clearState = () => {
    setOpen(false);
    setUpdateId(null);
    setUpdate(false);
    setCreateRole({
      roleName: '',
      description: '',
      features: [],
    });
  };
  return (
    <>
      <SubHeading>
        <span>রোলের তালিকা</span>
        <Button
          className="btn btn-primary"
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
          size="small"
        >
          <AddIcons sx={{ display: 'block' }} /> { }
        </Button>
      </SubHeading>
      <Dialog
        maxWidth="lg"
        open={open}
        onClose={() => {
          setOpen(false);
          clearState();
          setChecked([]);
          setExpanded([]);
        }}
        onBackdropClick={() => {
          setOpen(false);
          clearState();
          setChecked([]);
          setExpanded([]);
        }}
      >
        <DialogTitle>{`রোল তৈরী`}</DialogTitle>

        <DialogContent dividers>
          <Grid container className="section">
            <Grid container spacing={2.5}>
              <Grid item md={4} sm={8} xs={12}>
                <TextField
                  fullWidth
                  label="রোল নাম"
                  name="roleName"
                  onChange={handleChange}
                  text
                  variant="outlined"
                  size="small"
                  disabled={roleName == 'AUTHORIZED_PERSON' || (roleName == 'ORGANIZER' && true)}
                  value={roleName}
                ></TextField>
              </Grid>

              <Grid item md={5} sm={8} xs={12}>
                <TextField
                  fullWidth
                  placeholder="বিস্তারিত"
                  name="description"
                  onChange={handleChange}
                  text
                  variant="outlined"
                  size="small"
                  value={description}
                ></TextField>
              </Grid>
              <Grid item md={3} sm={8} xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      // value={isActive}
                      checked={switchActive}
                      onChange={toggleSwitch}
                      color="primary"
                    />
                  }
                  label="সক্রিয়/নিষ্ক্রিয়"
                  labelPlacement="start"
                  name="isActive"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container className="section">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <SubHeading>ফিচারসমূহ</SubHeading>
              <CheckboxTree
                nodes={featureListTree}
                checked={checked}
                expanded={expanded}
                onCheck={(checked) => setChecked(checked)}
                onExpand={(expanded) => setExpanded(expanded)}
                checkModel="all"
                nativeCheckboxes={true}
                icons={{
                  expandClose: <FolderIcon />,
                  expandOpen: <ArrowForwardIosIcon />,
                  expandAll: <ArrowForwardIosIcon />,
                  collapseAll: <ArrowForwardIosIcon />,
                  parentClose: '',
                  parentOpen: '',
                  leaf: <DescriptionOutlinedIcon />,
                }}
              />
            </Grid>
          </Grid>
          <Grid container className="btn-container">
            <Tooltip title={update ? 'হালদানাগাদ করুন' : 'সংরক্ষণ করুন'}>
              <Button
                variant="contained"
                className="btn btn-save"
                onClick={onSubmitData}
                startIcon={<SaveOutlinedIcon />}
              >
                {' '}
                {update ? 'হালদানাগাদ করুন' : 'সংরক্ষণ করুন'}
              </Button>
            </Tooltip>
          </Grid>
        </DialogContent>
      </Dialog>
      <RoleList updateFunction={getData} roleList={listRole} />
    </>
  );
};

export default CreateRole;
