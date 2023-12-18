import AcUnitIcon from '@mui/icons-material/AcUnit';
import CalculateIcon from '@mui/icons-material/Calculate';
import Check from '@mui/icons-material/Check';
import CreateIcon from '@mui/icons-material/Create';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import InsightsIcon from '@mui/icons-material/Insights';
import PaymentIcon from '@mui/icons-material/Payment';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { samityStepReg } from '../../../url/coop/ApiList';

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 14,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 15,
  },
  '& .QontoStepIcon-circle': {
    width: 5,
    height: 5,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      // backgroundImage: url('/images.png'),
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 90deg, var(--color-save), #3282B8) ',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

let ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : 'transparent',
  zIndex: 1,
  color: 'var(--color-primary-variant)',
  width: 30,
  height: 30,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #ccc',
  transition: 'all .15s ease-in',
  ...(ownerState.active && {
    // backgroundImage: "linear-gradient( 136deg, #019267 0%, #00C897 50%, #019267 100%)",
    // background:"#5FD068",
    background: 'transparent',
    // color:"blue",
    color: 'var(--color-save)',
    boxShadow: 'inset 5px 5px 20px -18px #000,4px 7px 10px -7px #000',
  }),
  ...(ownerState.completed && {
    // backgroundImage:"linear-gradient( 136deg, #019267 0%, #00C897 50%, #019267 100%) ",
    // background:"#5FD068",
    background: 'transparent',
    color: 'var(--color-save)',

    boxShadow: 'inset 5px 5px 20px -18px #000,4px 7px 10px -7px #000',
  }),
  ...(ownerState.pageActive && {
    // backgroundImage: "linear-gradient( 136deg, #0F4C75 0%, #3282B8 50%, #0F4C75 100%) ",
    // background:"#3282B8",
    color: 'tomato',
    background: 'transparent',
    boxShadow: 'inset 5px 5px 20px -18px #000,4px 7px 10px -7px #000',
  }),
  '&:hover': {
    boxShadow: 'inset -5px -5px 20px -18px #000, -5px -5px 10px -7px #000',
  },
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;
  const activePage = typeof window !== 'undefined' ? localStorage.getItem('activePage') : null;
  const stapperData = typeof window !== 'undefined' ? localStorage.getItem('stepId') : null;

  const icons = {
    ...(stapperData >= 0
      ? {
        1: (
          <Link href="/coop/samity-management/coop/registration" passHref>
            <a>
              <CreateIcon />
            </a>
          </Link>
        ),
      }
      : { 1: <CreateIcon /> }),
    ...(stapperData >= 1
      ? {
        2: (
          <Link href="/coop/samity-management/coop/add-by-laws" passHref>
            <a>
              <FormatAlignLeftIcon />
            </a>
          </Link>
        ),
      }
      : { 2: <FormatAlignLeftIcon /> }),
    ...(stapperData >= 2
      ? {
        3: (
          <Link href="/coop/samity-management/coop/member-registration" passHref>
            <a>
              <GroupsIcon />
            </a>
          </Link>
        ),
      }
      : { 3: <GroupsIcon /> }),
    ...(stapperData >= 3
      ? {
        4: (
          <Link href="/coop/samity-management/coop/designation" passHref>
            <a>
              <GroupAddIcon />
            </a>
          </Link>
        ),
      }
      : { 4: <GroupAddIcon /> }),
    ...(stapperData >= 4
      ? {
        5: (
          <Link href="/coop/samity-management/coop/member-expenditure" passHref>
            <a>
              <PaymentIcon />
            </a>
          </Link>
        ),
      }
      : { 5: <PaymentIcon /> }),
    ...(stapperData >= 5
      ? {
        6: (
          <Link href="/coop/samity-management/coop/income-expense" passHref>
            <a>
              <InsightsIcon />
            </a>
          </Link>
        ),
      }
      : { 6: <InsightsIcon /> }),
    ...(stapperData >= 6
      ? {
        7: (
          <Link href="/coop/samity-management/coop/budget" passHref>
            <a>
              <CalculateIcon />
            </a>
          </Link>
        ),
      }
      : { 7: <CalculateIcon /> }),
    ...(stapperData >= 7
      ? {
        8: (
          <Link href="/coop/samity-management/coop/required-doc" passHref>
            <a>
              <PhotoLibraryIcon />
            </a>
          </Link>
        ),
      }
      : { 8: <PhotoLibraryIcon /> }),
    ...(stapperData >= 8
      ? {
        9: (
          <Link href="/coop/samity-management/coop/samity-reg-report" passHref>
            <a>
              <AcUnitIcon />
            </a>
          </Link>
        ),
      }
      : { 9: <AcUnitIcon /> }),
  };

  const [pageActive, setPageActive] = useState(false);

  useEffect(() => {
    reloadPage();
  }, [activePage]);

  const reloadPage = () => {
    if (props.icon == activePage) {
      setPageActive(true);
    } else {
      setPageActive(false);
    }
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active, pageActive }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = [
  'প্রাথমিক তথ্য',
  'লক্ষ্য ও উদ্দেশ্য',
  'সদস্য নিবন্ধন',
  'কমিটি ব্যবস্থাপনা',
  'আর্থিক তথ্যাদি',
  'সমিতির আয়-ব্যয়',
  'সমিতির বাজেট',
  'কাগজ পত্রাদি',
  'চূড়ান্ত ডেটাসমূহ',
];

const StepperMenu = () => {
  const token = localStorageData('token');
  const config = localStorageData('config', token);
  const samityId = localStorageData('getSamityId');

  const [stepper, setStepper] = useState(0);

  useEffect(() => {
    steeperFun();
  }, []);

  const steeperFun = async () => {
    try {
      if (samityId) {
        const steeperData = await axios.get(samityStepReg + '/' + samityId, config);
        const data = steeperData.data.data;
        if (data.lastStep) {
          setStepper(data.lastStep);
        } else {
          setStepper(0);
        }
      }
    } catch (error) {
      errorHandler(error)
    }
  };

  return (
    <Stack
      sx={{
        width: '100%',
        background: 'white',
        position: 'sticky',
        top: 0,
        display: 'flex',
        zIndex: '10',
        borderBottom: '1px solid #c1c1c1',
        overflow: 'auto',
        transform: ' translateY(-14px)',
        padding: '8px 0 4px',
      }}
      spacing={4}
    >
      <Stepper alternativeLabel activeStep={stepper} connector={<ColorlibConnector />} sx={{ marginTop: '7px' }}>
        {steps.map((label, i) => (
          <Step key={i}>
            <StepLabel sx={{ lineHeight: '0' }} StepIconComponent={ColorlibStepIcon}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
};

export default StepperMenu;
