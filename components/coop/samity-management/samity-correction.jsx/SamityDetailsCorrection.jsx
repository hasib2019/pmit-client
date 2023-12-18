import { Button, FormControlLabel, Grid, Switch } from '@mui/material';
import RequiredFile from 'components/utils/RequiredFile';
import { FetchWrapper } from 'helpers/fetch-wrapper';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import FromControlJSON from 'service/form/FormControlJSON';
import {
  insertSamityCorrection,
  samityCorrection1,
  samityCorrection2,
  updateSamityCorrection,
} from '../../../../url/coop/ApiList';

const SamityDetailsCorrection = ({ samityId, isApproval = false }) => {
  const serviceName = 'samity_details_correction_outOfByLaws';
  const [memberInfo, setMemberInfo] = useState([]);
  const [editId, setEditId] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [samityData, setSamityData] = useState({
    samityFormationDate: ' ',
    phone: ' ',
    mobile: ' ',
    email: ' ',
    website: ' ',
  });
  const [rankDisable, setRankDisable] = useState(false);
  const [disableSamity, setDisableSamity] = useState(false);
  const [disableAll, setDisableAll] = useState(false);
  const [btnText, setbtnText] = useState(true);
  const [memberData, setMemberData] = useState({
    committeeOrganizer: 0,
    committeeContactPerson: 0,
    committeeSignatoryPerson: 0,
    isMember: false,
  });

  const handleSamityChange = (e) => {
    const { name, value } = e.target;
    setSamityData({ ...samityData, [name]: value });
  };

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  const dateChanger = (date) => {
    setSamityData({ ...samityData, samityFormationDate: date });
  };

  const getdata = async (id) => {
    const data = await FetchWrapper.get(samityCorrection1 + `?type=samityCorrectionOutBylaws&samityId=${id}`);
    if (Object.keys(data).length != 0) {
      setbtnText(true);
      setEditId(data.id);

      setMemberData((prev) => ({
        ...prev,
        committeeOrganizer: data.data.committeeOrganizer,
        committeeContactPerson: data.data.committeeContactPerson,
        committeeSignatoryPerson: data.data.committeeSignatoryPerson,
        isMember: data.data.isMember,
      }));

      setSamityData({
        samityFormationDate: data.data.samityFormationDate,
        phone: data.data.phone,
        mobile: data.data.mobile,
        email: data.data.email,
        website: data.data.website,
      });
      const memberinfo = await FetchWrapper.get(samityCorrection2 + id);
      setMemberInfo(memberinfo.memberInfo);
      setDisableSamity(false);
      setRankDisable(false);
    } else {
      setbtnText(false);
      const data = await FetchWrapper.get(samityCorrection2 + id);
      if (data && data.memberInfo.length > 0) {
        let organizer = data.memberInfo.find((item) => {
          if (item.committeeOrganizer == 'Y') {
            return item.id;
          }
        });
        let contact = data.memberInfo.find((item) => {
          if (item.committeeContactPerson == 'Y') {
            return item.id;
          }
        });
        let Signatory = data.memberInfo.find((item) => {
          if (item.committeeSignatoryPerson == 'Y') {
            return item.id;
          }
        });
        if (Signatory == undefined) {
          Signatory = { id: 0 };
        }
        setMemberData((prev) => ({
          ...prev,
          committeeOrganizer: organizer?.id,
          committeeContactPerson: contact?.id,
          committeeSignatoryPerson: Signatory?.id,
        }));

        setRankDisable(false);
      } else {
        NotificationManager.warning('সমিতির তথ্য সংশোধন করতে হলে, নুন্যতম সমিতির সদস্য থাকতে হবে', '', 5000);
        setRankDisable(true);
      }
      setSamityData(data.samityInfo);
      setMemberInfo(data.memberInfo);
    }
  };
  const handlesubmit = async () => {
    let data = {
      serviceName: serviceName,
      samityId: samityId,
      data: {
        ...samityData,
        ...memberData,
        committeeSignatoryPerson: memberData.isMember == false ? 0 : memberData.committeeSignatoryPerson,
      },
    };
    let editdata = {
      ...samityData,
      ...memberData,
      committeeSignatoryPerson: memberData.isMember == false ? 0 : memberData.committeeSignatoryPerson,
    };
    let response;
    if (btnText) {
      response = await FetchWrapper.patch(updateSamityCorrection + editId, editdata);
    } else {
      response = await FetchWrapper.post(insertSamityCorrection, data);
      if (response) {
        setToggle(!toggle);
        NotificationManager.success('আবেদনটি সফলভাবে প্রেরণ করা হয়েছে', '', 5000);
      }
    }
  };

  useEffect(() => {
    getdata(samityId);
    setDisableAll(isApproval);
  }, [samityId, isApproval, toggle]);

  return (
    <>
      <h3
        style={{
          background: '#c2ddff',
          padding: '10px',
          marginBottom: '30px',
          borderRadius: '5px',
        }}
      >
        পদ বরাদ্দ্যকরন
      </h3>
      <Grid container spacing={2.5}>
        <FromControlJSON
          arr={[
            {
              labelName: RequiredFile('সংগঠক'),
              name: 'committeeOrganizer',
              onChange: handleMemberChange,
              value: memberData.committeeOrganizer,
              size: 'small',
              type: 'text',
              viewType: 'select',
              optionData: memberInfo,
              optionValue: 'id',
              optionName: 'memberNameBangla',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: disableAll ? disableAll : rankDisable,
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
            {
              labelName: RequiredFile('যোগাযোগের ব্যক্তি'),
              name: 'committeeContactPerson',
              onChange: handleMemberChange,
              value: memberData.committeeContactPerson,
              size: 'small',
              type: 'text',
              viewType: 'select',
              optionData: memberInfo,

              optionValue: 'id',
              optionName: 'memberNameBangla',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: disableAll ? disableAll : rankDisable,
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
          ]}
        />
        <Grid item xs={6} xl={3} lg={3} md={3}>
          <span>এই সমিতি কেন্দ্রিও/জাতিয় সমিতির সদস্য ভুক্ত হবে?</span>
        </Grid>
        <Grid item xs={1}>
          <FormControlLabel
            // sx={{
            //   display: "flex",
            // }}
            label=" "
            disabled={disableAll ? disableAll : rankDisable}
            control={
              <Switch
                checked={memberData.isMember}
                onChange={() => {
                  setMemberData({
                    ...memberData,
                    isMember: !memberData.isMember,
                  });
                }}
                value={memberData.isMember}
                name="isMember"
                color="primary"
              />
            }
          />
        </Grid>

        {memberData.isMember == true && (
          <FromControlJSON
            arr={[
              {
                labelName: RequiredFile('কেন্দ্রিও/জাতিয় সমিতির পক্ষে স্বাক্ষরের ব্যাক্তি'),
                name: 'committeeSignatoryPerson',
                onChange: handleMemberChange,
                value: memberData.committeeSignatoryPerson,
                size: 'small',
                type: 'text',
                viewType: 'select',
                optionData: memberInfo,
                optionValue: 'id',
                optionName: 'memberNameBangla',
                xl: 4,
                lg: 4,
                md: 4,
                xs: 12,
                isDisabled: disableAll ? disableAll : rankDisable,
                customClass: '',
                customStyle: {},
                errorMessage: '',
              },
            ]}
          />
        )}
      </Grid>

      <h3
        style={{
          background: '#c2ddff',
          padding: '10px',
          marginBottom: '30px',
          marginTop: '30px',
          borderRadius: '5px',
        }}
      >
        সমিতির অন্যান্য তথ্য
      </h3>
      <Grid container spacing={2.5} sx={{ mb: 2 }}>
        <FromControlJSON
          arr={[
            {
              labelName: RequiredFile('সমিতি গঠনের তারিখ'),
              name: 'samityFormationDate',
              onChange: dateChanger,
              value: samityData.samityFormationDate == null ? '' : samityData.samityFormationDate,
              size: 'small',
              type: 'date',
              viewType: 'date',
              dateFormet: 'dd/MM/yyyy',
              disableFuture: true,
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: disableAll ? disableAll : disableSamity,
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
            {
              labelName: RequiredFile('ফোন নং'),
              name: 'phone',
              onChange: handleSamityChange,
              value: samityData.phone == null ? '' : samityData.phone,
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: disableAll ? disableAll : disableSamity,
              placeholder: 'ফোন নং',
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
            {
              labelName: RequiredFile('মোবাইল নং'),
              name: 'mobile',
              onChange: handleSamityChange,
              value: samityData.mobile == null ? '' : samityData.mobile,
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: disableAll ? disableAll : disableSamity,
              placeholder: 'মোবাইল নং',
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
            {
              labelName: RequiredFile('ইমেইল'),
              name: 'email',
              onChange: handleSamityChange,
              value: samityData.email == null ? '' : samityData.email,
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: disableAll ? disableAll : disableSamity,
              placeholder: 'ইমেইল',
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
            {
              labelName: RequiredFile('ওয়েব সাইট'),
              name: 'website',
              onChange: handleSamityChange,
              value: samityData.website == null ? '' : samityData.website,
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: disableAll ? disableAll : disableSamity,
              placeholder: 'ওয়েব সাইট',
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
          ]}
        />
      </Grid>
      {!disableAll && (
        <div style={{ textAlign: 'center' }}>
          <Button disabled={disableSamity} onClick={handlesubmit} variant="contained">
            {btnText ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
          </Button>
        </div>
      )}
    </>
  );
};

export default SamityDetailsCorrection;
