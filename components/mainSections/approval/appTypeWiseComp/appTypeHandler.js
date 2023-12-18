/* eslint-disable react/display-name */
import InventoryItemRequisitionApprovalDetails from 'components/inventory/mainSections/itemRequisition/inventoryItemRequisitionApprovalDetails';
import ReturnedItemsApprovalDetails from 'components/inventory/mainSections/itemReturn/returnedItemsApprovalDetails';
import PurchaseOrderApprovalDetails from 'components/inventory/mainSections/purchaseOrder/purchaseOrderApprovalDetails';
import StoreInMigrationApprovalDetails from '../../../inventory/mainSections/itemStoreInMigration/storeInMigrationApprovalDetails';
import ProductDetails from './ProductDetails';
import UpdateProductDetails from './UpdateProductDetails';
import UpdateSavingsProduct from './UpdateSavingsProductDetails';
import BalanceMigration from './balanceMigration';
import CashWithdrawApplication from './cashWithdrawApplication';
import DpsApplication from './dpsApplication';
import DpsClose from './dpsClose';
import FdrApplication from './fdrApplication';
import FdrClose from './fdrClose';
import FieldOffier from './fieldOffier';
import LoanAdjustmentApplication from './loanAdjustmentApplication';
import LoanInfoMigrationApproval from './loanInfoMigrationApproval';
import LoanSettlementApplication from './loanSettlementApplication';
import LoanShedule from './loanShedule';
import MemberCreateApproval from './memberCreateApproval';
import ProjectAssign from './projectAssign';
import ReverseTranApplication from './reverseTranApplication';
import SamityCreateApprovel from './samityCreateApprovel';
import SamityUpdateApproval from './samityUpdateApproval';
import SanctionApplication from './sanctionApplication';
import SavingsProduct from './savingsProductDetails';
import SubGL from './subGl';
import UpdateFieldOfficer from './updateFieldOfficer';
export const applicationTypeBaseData = (appliType) => {
  switch (appliType) {
    case 'product':
      return (data) => <ProductDetails allData={data} />;
    case 'updateProduct':
      return (data) => <UpdateProductDetails allData={data} />;
    case 'projectAssign':
      return (data) => <ProjectAssign allData={data} />;
    case 'sanctionApply':
      return (data) => <SanctionApplication allData={data} />;
    case 'loanSchedule':
      return (data) => <LoanShedule allData={data} />;
    case 'subGl':
      return (data) => <SubGL allData={data} />;
    case 'fieldOfficer':
      return (data) => <FieldOffier allData={data} />;
    case 'updateFieldOfficer':
      return (data) => <UpdateFieldOfficer allData={data} />;
    case 'samityCreate':
      return (data) => <SamityCreateApprovel allData={data} />;
    case 'loanInfoMigration':
      return (data) => <LoanInfoMigrationApproval allData={data} />;
    case 'balanceMigration':
      return (data) => <BalanceMigration allData={data} />;
    case 'memberCreate':
      return (data) => <MemberCreateApproval allData={data} />;
    case 'samityUpdate':
      return (data) => <SamityUpdateApproval allData={data} />;
    case 'dpsApplication':
      return (data) => <DpsApplication allData={data} />;
    case 'storeInMigration':
      return (data) => <StoreInMigrationApprovalDetails allData={data} />;
    case 'inventoryItemRequisition':
      return (data) => <InventoryItemRequisitionApprovalDetails allData={data} />;
    case 'purchaseOrder':
      return (data) => <PurchaseOrderApprovalDetails allData={data} />;
    case 'inventoryItemReturn':
      return (data) => <ReturnedItemsApprovalDetails allData={data} />;
    case 'cashWithdraw':
      return (data) => <CashWithdrawApplication allData={data} />;
    case 'reverseTransaction':
      return (data) => <ReverseTranApplication allData={data} />;
    case 'dpsClose':
      return (data) => <DpsClose allData={data} />;
    case 'fdrApplication':
      return (data) => <FdrApplication allData={data} />;
    case 'loanSettlement':
      return (data) => <LoanSettlementApplication allData={data} />;
    case 'fdrClose':
      return (data) => <FdrClose allData={data} />;
    case 'savingsProduct':
      return (data) => <SavingsProduct allData={data} />;
    case 'savingsProductUpdate':
      return (data) => <UpdateSavingsProduct allData={data} />;
    case 'loanAdjustment':
      return (data) => <LoanAdjustmentApplication allData={data} />;
    default:
      return () => '';
  }
};
