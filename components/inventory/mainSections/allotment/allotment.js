import {
  Grid,
  Autocomplete,
  TextField,
  Box,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Typography,
  TableCell,
  Table,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { useEffect, useState } from 'react';

import {
  getOfficeOrigin,
  getOfficeUnits,
  upsertAllotment,
} from '../../../../features/inventory/allotment/allotmentSlice';
import { fetchAllotmentInfo } from '../../../../features/inventory/allotment/allotmentApi';
import { LoadingButton } from '@mui/lab';
import {
  savButtonLabel,
  layerFieldTitle,
  unitFieldTitle,
  itemNameColumnTitle,
  allotmentViewButtonTitle,
} from '../../constants';
import star from 'components/mainSections/loan-management/loan-application/utils';
import { bangToEng, engToBang } from 'service/numberConverter';

const Allotment = () => {
  const dispatch = useDispatch();

  const { isLoading, officeOrigins, officeUnits } = useSelector((state) => state.allotment);

  const [itemAllotmentInfo, setAllotmentInfo] = useState([]);
  const [allDesignations, setAllDesignations] = useState([]);

  const [layerId, setLayerId] = useState(undefined);
  const [unitId, setUnitId] = useState(undefined);
  const [isLoadingForAllotmentOfItems, setIsLoadingForAllotmentOfItems] = useState(false);
  const getAllotmentsOfItems = async () => {
    if (layerId?.id && unitId?.id) {
      // const result = await fetchAllotmentInfo(layerId.id, unitId.id);
      setIsLoadingForAllotmentOfItems(true);
      const result = await fetchAllotmentInfo(70, 228);
      setIsLoadingForAllotmentOfItems(false);
      setAllotmentInfo(result.data.allotmentInfo);
      setAllDesignations(result.data.designations);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const allotmentArray = [];
    itemAllotmentInfo.forEach((elm) => {
      elm.item.forEach((it) => {
        allotmentArray.push({
          itemId: +it.designationWiseAllotmentInfo?.itemId,
          originDesignationId: +it.designationWiseAllotmentInfo?.designationId,
          quantity: +it.designationWiseAllotmentInfo?.quantity,
        });
      });
    });

    const payload = allotmentArray.filter((elm) => elm.quantity != '');
    dispatch(upsertAllotment(payload));
    setLayerId(undefined);
    setUnitId(undefined);
    setAllotmentInfo([]);
  };
  useEffect(() => {
    dispatch(getOfficeOrigin());
    dispatch(getOfficeUnits());
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={6} lg={6} xs={12}>
          <Autocomplete
            key={layerId}
            id="layerId"
            name="layerId"
            options={officeOrigins}
            getOptionLabel={(option) => option.nameBn}
            onChange={(e, value) => {
              setLayerId(value);
            }}
            value={layerId}
            renderInput={(params) => <TextField {...params} label={star(layerFieldTitle)} size="small" fullWidth />}
          />
        </Grid>
        <Grid item md={6} lg={6} xs={12}>
          <Autocomplete
            key={unitId}
            id="unitId"
            name="unitId"
            onChange={(e, value) => {
              setUnitId(value);
            }}
            value={unitId}
            options={officeUnits}
            getOptionLabel={(option) => option.nameBn}
            renderInput={(params) => <TextField {...params} label={star(unitFieldTitle)} size="small" fullWidth />}
          />
        </Grid>
        <Grid item md={12} lg={12} xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <LoadingButton
            className="btn btn-primary"
            loadingPosition="end"
            disabled={isLoadingForAllotmentOfItems}
            onClick={() => {
              getAllotmentsOfItems();
            }}
          >
            {allotmentViewButtonTitle}
          </LoadingButton>
        </Grid>

        <Grid item md={12} lg={12} xs={12}>
          <Box>
            <form onSubmit={handleSubmit}>
              {itemAllotmentInfo?.length > 0 ? (
                <TableContainer className="table-container">
                  <Table className="input-table" aria-label="customized table" size="small">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell width="30%">{itemNameColumnTitle}</TableCell>
                        {allDesignations?.map((des) => {
                          console.log('desdes', des);
                          return (
                            <TableCell key={des?.id} width="30%">
                              {des.name_bn}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {itemAllotmentInfo?.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography>{item?.itemNameBn}</Typography>
                            </TableCell>
                            {item?.item?.map((elm, i) => {
                              return (
                                <TableCell width="20%" key={item?.designationWiseAllotmentInfo?.designationId}>
                                  {/* friends[${index}].name */}

                                  <TextField
                                    sx={{ textAlign: 'center' }}
                                    size="small"
                                    value={engToBang(
                                      itemAllotmentInfo[index]?.item[i]?.designationWiseAllotmentInfo?.quantity,
                                    )}
                                    onChange={(e) => {
                                      let allotInfo = [...itemAllotmentInfo];
                                      const value = bangToEng(e.target.value);
                                      allotInfo[index].item[i].designationWiseAllotmentInfo.quantity = value.replace(
                                        /\D/gi,
                                        '',
                                      );

                                      setAllotmentInfo(allotInfo);
                                    }}
                                    // InputProps={{
                                    //   textAlign: "center",
                                    // }}
                                  />
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                ''
              )}
              {itemAllotmentInfo?.length > 0 ? (
                <Grid container className="btn-container">
                  <Grid item md={12} lg={12} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <LoadingButton type="submit" className="btn btn-save" loadingPosition="end" disabled={isLoading}>
                      {savButtonLabel}
                    </LoadingButton>
                  </Grid>
                </Grid>
              ) : (
                ''
              )}
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default Allotment;
