
import { fetchOfficeLayerData, fetchOfficeNames } from 'features/inventory/storeInWithMigration/storeInMigrationApi';
import {
  getAdminEmployee,
  getOfficeNames,
  getStoreAdminInfo,
} from 'features/inventory/storeInWithMigration/storeInMigrationSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { tokenData } from 'service/common';
const UseOwnOfficesLayerAndOfficeObj = () => {
  const [layerObj, setLayerObj] = useState(null);
  const [officeObj, setOfficeObj] = useState(null);
  const dispatch = useDispatch();
  const tokenDecodeData = tokenData();
  useEffect(() => {
    getOfficeObj(+tokenDecodeData.layerId);
    getLayerObj();
    dispatch(getAdminEmployee(+tokenDecodeData.officeId));
    dispatch(getOfficeNames(+tokenDecodeData.layerId));
    dispatch(getStoreAdminInfo());
    return () => { };
  }, []);

  const getLayerObj = async () => {
    const layerData = await fetchOfficeLayerData();
    const officeLayers = layerData.data;
    if (officeLayers) {
      setLayerObj(officeLayers.find((layer) => layer.id === +tokenDecodeData.layerId));
    } else {
      setLayerObj(null);
    }
  };
  const getOfficeObj = async (layerId) => {
    const officeData = await fetchOfficeNames(layerId);

    const offices = officeData.data;
    if (offices) {
      setOfficeObj(offices.find((office) => office.id === tokenDecodeData.officeId.toString()));
    } else {
      setOfficeObj(null);
    }
  };
  return {
    layerObj: layerObj,
    officeObj: officeObj,
  };
};
export default UseOwnOfficesLayerAndOfficeObj;
