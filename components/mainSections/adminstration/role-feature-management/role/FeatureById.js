import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import TreeView from '@mui/lab/TreeView';
import { Box } from '@mui/material';
import { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

const FeatureById = ({ allFeatureList }) => {
  const { featureList } = allFeatureList;
  const [expanded, setExpanded] = useState([]);
  return (
    <>
      <Box>
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
      </Box>
    </>
  );
};

export default FeatureById;
