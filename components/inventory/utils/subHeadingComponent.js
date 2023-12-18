// import { itemGroupSubHeading, itemGroupSubHeadingButtonTitle } from 'components/inventory/constants';
import AddIcons from '@mui/icons-material/AddCircle';
import { Button } from '@mui/material';
import SubHeading from 'components/shared/others/SubHeading';
const SubHeadingComponent = ({ onClickCreateButton, subHeadingTitle, subHeadingButtonTitle }) => {
  'typoffunc', typeof onClickCreateButton;
  return (
    <>
      <SubHeading>
        <span>{subHeadingTitle}</span>

        <Button className="btn btn-primary" variant="contained" size="small" onClick={onClickCreateButton}>
          <AddIcons />
          {subHeadingButtonTitle}
        </Button>
      </SubHeading>
    </>
  );
};
export default SubHeadingComponent;
