import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  TextField,
  // Dialog,
  // DialogContent,
  // Tooltip,
  FormHelperText,
  FormControl,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  Autocomplete,
  Select,
  MenuItem,
  // useFormControl,
  InputLabel,
} from '@mui/material';
// import { onItemErrorInfoChange, onItemInfoChange } from '../../../../features/inventory/item/itemSlice';
import {
  groupAutocompleteFieldTitle,
  groupAutocompleteFieldUnselectedTitle,
  categoryAutocompleteFieldTitle,
  categoryAutocompleteFieldUnselectedTitle,
  itemNameTextfieldTitle,
  itemCodeTextFieldTitle,
  itemModelTextfieldTitle,
  itemMeasurementUnitAutocompleteUnselectedTitle,
  itemMeasurementUnitAutocompleteTitle,
  itemDescriptionTitle,
  reorderLevelQuantityTexfieldTitle,
  itemStatusRadioLabel,
  itemTypeTextFieldLabel,
  itemTypeTextFieldLabelErrorMessage,
  measurementIsActiveTitle,
  measurementIsInActiveTitle,
  // itemTypeRadioOption1,
  // itemTypeRadioOption2,
  itemPricePerUnitTextfieldTitle,
  // itemCodeLengthErrorMessage,
  // itemNameLengthErrorMessage,
  // itemModelLengthErrorMessage,
  // itemDescriptionLengthErrorMessage,
  itemHashCodeTextFieldTitle,
} from '../../constants';
// import { getAllItemGroup } from '../../../../features/inventory/item-group/ItemGroupSlice';
import { getAllItemCategory } from '../../../../features/inventory/category/categorySlice';
// import { getAllMeasurementUnit } from '../../../../features/inventory/measurementUnit/measurementUnitSlice';
import { memo } from 'react';
// import useItemsTextFieldStateAndFunctionalities from '../../hooks/item/useItemStateAndFunction';
import star from 'components/mainSections/loan-management/loan-application/utils';
import { useFormikContext } from 'formik';
import { bangToEng, engToBang } from 'service/numberConverter';
// const regex = /^([০-৯0-9]+|[০-৯0-9]+[.,][০-৯0-9]+)$/;

// const regex = /^[০-৯0-9]+([.,][০-৯0-9]+)?$/;
// const regex = /^([0-9১-৯]+(\.[0-9১-৯]*)?)$/;
// import DoptorSelectionComponent from "./doptorSelectionComponent";
const FormComponent = () => {
  const dispatch = useDispatch();
  const { codeMasterTypes } = useSelector((state) => state.itemOrProduct);
  const { itemGroups } = useSelector((state) => state.itemGroup);
  const { itemCategories } = useSelector((state) => state.itemCategory);
  const { allMeasurementUnits } = useSelector((state) => state.measurementUnit);
  // const formik = useFormikContext();

  const { handleChange, values, touched, errors, setFieldValue } = useFormikContext();
  const {
    itemName,
    groupId,
    categoryId,
    model,
    unitPrice,
    mouId,
    goodsType,
    reorderLevelQuantity,
    hsCode,
    itemCode,
    isEditMode,
    isActive,
    isAsset,
    description,
    doptorAndFixedAssetInfos,
  } = values;
  return (
    <>
      <Grid container spacing={3} className="section">
        <Grid item md={4} lg={4} xs={12}>
          <TextField
            fullWidth
            size="small"
            id="itemName"
            name="itemName"
            label={star(itemNameTextfieldTitle)}
            value={itemName}
            onChange={handleChange}
            error={Boolean(touched.itemName && errors.itemName)}
            helperText={touched.itemName && errors.itemName}
          />
        </Grid>
        <Grid item md={4} lg={4} xs={12}>
          <Autocomplete
            // key={groupId}
            fullWidth
            name="groupId"
            size="small"
            disablePortal
            value={groupId}
            options={itemGroups}
            getOptionLabel={(option) => option.groupName}
            onChange={(e, value) => {
              if (value) {
                dispatch(getAllItemCategory(`&group_id=${value.id}`));
                setFieldValue('groupId', value);
                setFieldValue('categoryId', null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={star(groupId ? groupAutocompleteFieldTitle : groupAutocompleteFieldUnselectedTitle)}
              />
            )}
          />
        </Grid>
        <Grid item md={4} lg={4} xs={12}>
          <Autocomplete
            // key={categoryId}
            name="categoryId"
            size="small"
            disablePortal
            value={categoryId}
            options={itemCategories}
            getOptionLabel={(option) => option.categoryName}
            onChange={(e, value) => {
              if (value) {
                setFieldValue('categoryId', value);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={star(categoryId ? categoryAutocompleteFieldTitle : categoryAutocompleteFieldUnselectedTitle)}
                error={Boolean(touched.categoryId && errors.categoryId?.id)}
                helperText={touched.categoryId && errors.categoryId?.id}
              />
            )}
          />
        </Grid>
        <Grid item md={4} lg={4} xs={12}>
          <TextField
            fullWidth
            size="small"
            name="model"
            label={star(itemModelTextfieldTitle)}
            value={model}
            onChange={handleChange}
            error={Boolean(touched.model && errors.model)}
            helperText={touched.model && errors.model}
          />
        </Grid>
        <Grid item md={4} lg={4} xs={12}>
          <TextField
            fullWidth
            size="small"
            name="unitPrice"
            label={star(itemPricePerUnitTextfieldTitle)}
            value={engToBang(unitPrice)}
            onChange={(e) => {
              setFieldValue(
                'unitPrice',
                bangToEng(e.target.value.replace(/।/g, '.').replace(/[^\d০-৯.]|\.(?=.*\.)|।(?=.*।)/g, '')),
              );
            }}
            error={Boolean(touched.unitPrice && errors.unitPrice)}
            helperText={touched.unitPrice && errors.unitPrice}
          />
        </Grid>
        <Grid item md={4} lg={4} xs={12}>
          <Autocomplete
            name="mouId"
            size="small"
            disablePortal
            value={mouId}
            options={allMeasurementUnits}
            getOptionLabel={(elm) => elm.mouName}
            onChange={(e, value) => {
              if (value) {
                setFieldValue('mouId', value);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={star(
                  mouId ? itemMeasurementUnitAutocompleteTitle : itemMeasurementUnitAutocompleteUnselectedTitle,
                )}
                error={Boolean(touched.mouId && errors.mouId?.id)}
                helperText={touched.mouId && errors.mouId?.id}
              />
            )}
          />
        </Grid>
        <Grid item md={4} lg={4} xs={12}>
          <FormControl fullWidth>
            <InputLabel id="officeId">
              {goodsType ? star(itemTypeTextFieldLabel) : star(itemTypeTextFieldLabelErrorMessage)}
            </InputLabel>
            <Select
              name="goodsType"
              fullWidth
              size="small"
              id="goodsType"
              SelectProps={{ native: true }}
              label={star(goodsType ? star(itemTypeTextFieldLabel) : star(itemTypeTextFieldLabelErrorMessage))}
              onChange={(e) => {
                const { value } = e.target;
                setFieldValue('goodsType', value);
                const selectedGoodsTypeObject = codeMasterTypes?.find((type) => type.id === +value);
                const codeOfSelectedGoodsType = selectedGoodsTypeObject?.returnValue;
                if (codeOfSelectedGoodsType === 'FAT') {
                  setFieldValue('isAsset', true);
                } else {
                  setFieldValue('isAsset', false);
                }
                const doptorIAndFixedAssetArray = doptorAndFixedAssetInfos.map((info) => {
                  return {
                    ...info,
                    goodsType: value,
                    isAsset: codeOfSelectedGoodsType === 'FAT' ? true : false,
                  };
                });
                setFieldValue('doptorAndFixedAssetInfos', doptorIAndFixedAssetArray);
                // doptorAndFixedAssetInfos
              }}
              value={goodsType}
              error={Boolean(touched.goodsType && errors.goodsType)}
            >
              {codeMasterTypes?.map((option) => (
                <MenuItem value={option?.id} key={option?.id}>
                  {option?.displayValue}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText error={Boolean(touched.goodsType && errors.goodsType)}>
              {touched.goodsType && errors.goodsType}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={4} lg={4} xs={12}>
          <TextField
            fullWidth
            size="small"
            id="reorderLevelQuantity"
            name="reorderLevelQuantity"
            label={reorderLevelQuantityTexfieldTitle}
            // type="number"
            value={engToBang(reorderLevelQuantity)}
            onChange={(e) => {
              setFieldValue('reorderLevelQuantity', bangToEng(e.target.value.replace(/[^\d০-৯]/g, '')));
            }}
            // InputProps={{ inputProps: { step: 1 } }}
            // inputProps={{ step: 1, pattern: "\\d+" }}

            // inputProps={{
            //   type: "number",
            //   step: "1",
            //   min: "0",
            //   max: "100",
            //   inputMode: "numeric",
            //   pattern: "[0-9]*",
            // }}
          />
        </Grid>
        <Grid item md={4} lg={4} xs={12}>
          <TextField
            fullWidth
            size="small"
            id="hsCode"
            name="hsCode"
            label={itemHashCodeTextFieldTitle}
            value={hsCode}
            onChange={handleChange}
          />
        </Grid>
        {isEditMode ? (
          <Grid item md={4} lg={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              name="itemCode"
              disabled={isEditMode ? true : false}
              label={star(itemCodeTextFieldTitle)}
              value={itemCode}
              onChange={handleChange}
            />
          </Grid>
        ) : (
          ''
        )}{' '}
        {isEditMode ? (
          <Grid item md={4} lg={4} xs={12}>
            <FormControl component="fieldset" size="small">
              <FormLabel>{star(itemStatusRadioLabel)}</FormLabel>
              <RadioGroup row name="isActive" value={isActive} onChange={handleChange}>
                <FormControlLabel value={true} control={<Radio />} label={measurementIsActiveTitle} />
                <FormControlLabel value={false} control={<Radio />} label={measurementIsInActiveTitle} />
              </RadioGroup>
            </FormControl>
            <FormHelperText error={Boolean(touched.isActive && errors.isActive)}>
              {touched.isActive && errors.isActive}
            </FormHelperText>
          </Grid>
        ) : (
          ''
        )}
        <Grid item md={4} lg={4} xs={12}>
          <FormControl component="fieldset" size="small">
            <FormLabel>{star('মালামালের ধরন')}</FormLabel>
            <RadioGroup
              row
              name="isAsset"
              value={isAsset}
              onChange={(e) => {
                const { value } = e.target;
                const boolValue = value === 'true';
                setFieldValue('isAsset', boolValue);
                const doptorIAndFixedAssetArray = doptorAndFixedAssetInfos.map((info) => {
                  return {
                    ...info,

                    isAsset: boolValue,
                  };
                });
                setFieldValue('doptorAndFixedAssetInfos', doptorIAndFixedAssetArray);
              }}
            >
              <FormControlLabel value={true} control={<Radio />} label={'স্থায়ী সম্পদ'} />
              <FormControlLabel value={false} control={<Radio />} label={'স্থায়ী সম্পদ নয়'} />
            </RadioGroup>
          </FormControl>
          <FormHelperText error={Boolean(touched.isActive && errors.isActive)}>
            {touched.isActive && errors.isActive}
          </FormHelperText>
        </Grid>
        <Grid item md={12} lg={12} xs={12}>
          <TextField
            fullWidth
            size="small"
            name="description"
            label={itemDescriptionTitle}
            value={description}
            onChange={handleChange}
            error={Boolean(touched.description && errors?.description)}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default memo(FormComponent);
