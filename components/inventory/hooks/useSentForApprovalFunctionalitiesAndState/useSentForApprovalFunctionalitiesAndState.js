import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  getAdminEmployee,
  // getOfficeLayerData,
  getOfficeNames,
  onResetAdminEmployees,
} from '../../../../features/inventory/storeInWithMigration/storeInMigrationSlice';
import { useFormikContext } from 'formik';
// import UseOwnOfficesLayerAndOfficeObj from 'components/inventory/utils/UseOwnOfficesLayerAndOfficeObj';
import { useErrorBoundary } from 'react-error-boundary';
const UseSentForApprovalStateAndFunctionalites = (props) => {
  const { showBoundary } = useErrorBoundary();
  // const { layerObj: layer, officeObj: office } =
  //   UseOwnOfficesLayerAndOfficeObj();

  const [layerObj, setLayerObj] = useState(null);
  const [officeObj, setOfficeObj] = useState(null);

  const [adminEmployeeObj, setAdminEmployeeObj] = useState(null);
  useEffect(() => {
    if (!formik) {
      if (!layerObj) {
        setLayerObj(props?.layerObj);
      }
      if (!officeObj) {
        setOfficeObj(props?.officeObj);
      }
    }
  }, [layerObj, officeObj]);
  const formik = useFormikContext();

  const dispatch = useDispatch();

  const handlChangeOfficeLayerData = useCallback((e, value) => {
    try {
      if (value) {
        if (props) {
          props.setFieldValue('layerObj', value);

          props.setFieldValue('officeObj', null);
          props.setFieldValue('adminEmployeeObj', null);
        } else {
          setLayerObj(value);
          setOfficeObj(null);
          setAdminEmployeeObj(null);
        }
        dispatch(getOfficeNames(value.id));
        dispatch(onResetAdminEmployees());
      }
    } catch (error) {
      showBoundary(error);
    }
  }, []);
  const handleChangeOfficeNamesData = useCallback((e, value) => {
    try {
      if (value) {
        if (props) {
          props.setFieldValue('officeObj', value);
          props.setFieldValue('adminEmployeeObj', null);
        } else {
          setOfficeObj(value);
          setAdminEmployeeObj(null);
        }
        dispatch(getAdminEmployee(value.id));
      }
    } catch (error) {
      showBoundary(error);
    }
  }, []);
  const handleAdminEmployeeChange = useCallback((e, value) => {
    try {
      if (value) {
        if (props) {
          props.setFieldValue('adminEmployeeObj', value);
        } else {
          setAdminEmployeeObj(value);
        }
      }
    } catch (erro) {
      showBoundary(erro);
    }
  }, []);

  if (props) {
    return {
      handlChangeOfficeLayerData,
      handleChangeOfficeNamesData,
      handleAdminEmployeeChange,
    };
  } else {
    return {
      handlChangeOfficeLayerData,
      handleChangeOfficeNamesData,
      handleAdminEmployeeChange,
      layerObj,
      officeObj,
      adminEmployeeObj,
    };
  }
};
export default UseSentForApprovalStateAndFunctionalites;
