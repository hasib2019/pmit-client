
import axios from 'axios';
import { useEffect, useState } from 'react';
import { errorHandler } from 'service/errorHandler';
import { RoleCreate } from '../../../../../url/coop/RoleApi';
import FeatureByIdInner from './FeatureByIdInner';

import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';

import { Paper } from '@mui/material';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { localStorageData } from 'service/common';

const FeatureById = ({ id, status }) => {
  const token = localStorageData('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-auth-type': 'DEV',
    },
  };
  const [featureById, setFeatureById] = useState([]);

  useEffect(() => {
    getFeatureById();
  }, []);

  const getFeatureById = async () => {
    try {
      if (status) {
        let resById = await axios.get(RoleCreate + id, config);
        setFeatureById(resById.data.data.role.featureList);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const fontSizeChanger = (label) => {
    return (
      <p
        style={{
          fontSize: '20px',
          color: '#151515',
          fontFamily: "'Bangla', sans-serif",
          margin: '0',
          padding: '5px',
        }}
      >
        {label}
      </p>
    );
  };

  return (
    <>
      <Paper>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {featureById.map((valTwo, indOne) => (
            <>
              {valTwo.isRoot ? (
                <>
                  <TreeItem nodeId={indOne} label={fontSizeChanger(valTwo.featureNameBan)}>
                    {featureById.map((valThree, indTwo) => (
                      <>
                        {valThree.isRoot === false && valTwo.id === valThree.parentId ? (
                          <>
                            <FeatureByIdInner
                              key={indTwo}
                              feature={valThree}
                              allFeatures={featureById}
                              index={indTwo}
                            />
                          </>
                        ) : (
                          ''
                        )}
                      </>
                    ))}
                  </TreeItem>
                </>
              ) : (
                ''
              )}
            </>
          ))}
        </TreeView>
      </Paper>
    </>
  );
};

export default FeatureById;
