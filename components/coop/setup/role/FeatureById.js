import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeView from '@mui/lab/TreeView';
import { Paper } from '@mui/material';
import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const FeatureById = ({ allFeatureList }) => {
  const { featureList } = allFeatureList;
  const [expanded, setExpanded] = useState([]);
  return (
    <>
      <Paper>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <CheckboxTree
            nodes={featureList}
            //checked={checked}
            expanded={expanded}
            // onCheck={checked => setChecked(checked)}
            onExpand={(expanded) => setExpanded(expanded)}
            // checkModel="all"
            showCheckbox={false}
            // showExpandAll={true}
            // nativeCheckboxes={false}
            icons={{
              check: '',
              uncheck: '',
              expandClose: <FolderIcon />,
              expandOpen: <ArrowForwardIosIcon />,
              expandAll: <ArrowForwardIosIcon />,
              collapseAll: <ArrowForwardIosIcon />,
              parentClose: '',
              parentOpen: '',
              leaf: <DescriptionOutlinedIcon />,
            }}
          />
        </TreeView>
      </Paper>
    </>
  );
};

export default FeatureById;
