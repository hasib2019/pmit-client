import { configureStore } from '@reduxjs/toolkit';
import byLawAmendmentSliceReducer from 'features/coop/byLawsAmendment/byLawAmendmentSlice';
import { apiSlice } from '../features/coop/api/apiSlice';
import dropdownReducer from '../features/dropdowns/dropdownSlice';
import allotmentReducer from '../features/inventory/allotment/allotmentSlice';
import ItemCategoryReducer from '../features/inventory/category/categorySlice';
import documentSectionReducer from '../features/inventory/documentSection/documentSectionSlice';
import ItemGroupReducer from '../features/inventory/item-group/ItemGroupSlice';
import itemRequisitionReducer from '../features/inventory/item-requisition/itemRequisitionSlice';
import itemStoreReducer from '../features/inventory/item-store/item-store-slice';
import InventoryItemReducer from '../features/inventory/item/itemSlice';
import itemReturnReducer from '../features/inventory/itemReturn/item-return-slice';
import MeasurementUnitReducer from '../features/inventory/measurementUnit/measurementUnitSlice';
import purchaseOrderReducer from '../features/inventory/purchase-order/purchaseOrderSlice';
import storeInWithMigrationReducer from '../features/inventory/storeInWithMigration/storeInMigrationSlice';
import supplierReducer from '../features/inventory/supplier/supplierSlice';
import dpsAndFdrMigrationReducer from '../features/loan/dpsFdrMigration/dpsFdrMigrationSlice';
import voucherPostingReducer from '../features/voucherPosting/voucherPostingSlice';
import transactionApprovalReducer from '../features/voucherPostingApproval/voucherPostingApprovalSlice';
import savingsProductReducer from '../redux/feature/savingsProduct/savingsProductSlice';
import officeSelectApprovalReducer from './feature/approvalOfficeSelectionlSlice';
import manualSamityReducer from './feature/manualSamity/manualSamitySlice';
import ColorSlice from './slices/ColorSlice';
import LevelSlice from './slices/LevelSlice';
import PaginationSlice from './slices/PaginationSlice';
export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    DesigLevel: LevelSlice,
    ColorSlice: ColorSlice,
    PaginationSlice: PaginationSlice,
    dropdown: dropdownReducer,
    voucherPosting: voucherPostingReducer,
    transactionApproval: transactionApprovalReducer,
    officeSelectApproval: officeSelectApprovalReducer,
    manualSamity: manualSamityReducer,
    itemGroup: ItemGroupReducer,
    measurementUnit: MeasurementUnitReducer,
    itemCategory: ItemCategoryReducer,
    itemOrProduct: InventoryItemReducer,
    itemStore: itemStoreReducer,
    supplier: supplierReducer,
    allotment: allotmentReducer,
    savingsProduct: savingsProductReducer,
    storeInWithMigration: storeInWithMigrationReducer,
    itemRequisition: itemRequisitionReducer,
    byLawAmendment: byLawAmendmentSliceReducer,
    purchaseOrder: purchaseOrderReducer,
    docSection: documentSectionReducer,
    itemReturn: itemReturnReducer,
    dpsAndFdrMigration: dpsAndFdrMigrationReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddlewares) => getDefaultMiddlewares().concat(apiSlice.middleware),
});
