/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2023/05/31 10:13:48
 * @modify date 2023/05/31 10:13:48
 * @desc [description]
 */
import AddIcons from '@mui/icons-material/Add';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { formValidator } from 'service/formValidator';
import { bangToEng, engToBang } from 'service/numberConverter';
import { GlacList } from '../../../../../url/coop/ApiList';
const DynamicLedger = ({ listData, setListData, accountsName, glacType, returnType, drcrCode, isApproval }) => {
  const config = localStorageData('config');
  const [dropDownInfo, setDropDownInfo] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const showData = await axios.get(GlacList + glacType, config);
      const data = showData.data.data;
      setDropDownInfo(data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleInputChangeIncome = (e, i) => {
    const { name, value } = e.target;
    let resultObj;
    switch (name) {
      case 'tranAmount':
        resultObj = formValidator('number', value);
        if (resultObj?.status) {
          return;
        }
        setListData((draft) => {
          draft[i][name] = resultObj?.value ? resultObj?.value : 0;
          draft[i].tranAmountError = resultObj?.value ? false : true;
        });
        break;
      default:
        setListData((draft) => {
          draft[i][name] = parseInt(value);
          draft[i].glacIdError = value === '0' ? true : false;
        });
        break;
    }
  };

  // handle click event of the Add button
  const handleAddClickIncome = () => {
    setListData([
      ...listData,
      {
        glacId: '',
        glacIdError: false,
        returnType,
        tranDate: '',
        tranAmount: 0,
        tranAmountError: false,
        drcrCode,
        status: 'A',
      },
    ]);
  };
  const handleRemoveClickIncome = (index) => {
    let list = [...listData];
    list.splice(index, 1);
    setListData(list);
  };

  const totalAmountCalculation = (arrayData) => {
    let sum = 0;
    for (let i = 0; i < arrayData.length; i++) {
      sum += arrayData[i]?.tranAmount && parseInt(bangToEng(arrayData[i]?.tranAmount));
    }
    return sum;
  };
  return (
    <Grid item md={6} xs={12}>
      <span
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'inline-block',
          padding: '5px 0',
          textAlign: 'center',
        }}
      >
        {' '}
        {accountsName}{' '}
      </span>
      <TableContainer className="table-container">
        <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table" className="table-input">
          <TableHead className="table-head">
            <TableRow>
              <TableCell align="center" className="minWidth">
                নং
              </TableCell>
              <TableCell>লেজার / হিসাবের নাম</TableCell>
              <TableCell align="right">টাকা</TableCell>
              <TableCell align="center" className="minWidth" sx={{ display: isApproval && 'none' }}>
                <Button className="table-icon success" onClick={handleAddClickIncome} size="small">
                  {' '}
                  <AddIcons sx={{ display: 'block' }} />
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listData?.map((x, i) => {
              return (
                <>
                  <TableRow>
                    <TableCell align="center">{engToBang('' + (i + 1) + '')}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        name="glacId"
                        required
                        select
                        SelectProps={{ native: true }}
                        value={x.glacId || 0}
                        onChange={(e) => handleInputChangeIncome(e, i)}
                        variant="outlined"
                        size="small"
                        error={x.glacIdError}
                        disabled={
                          isApproval ? isApproval : glacType === 2 && (x.glacId === 238 || x.glacId === 240) && true
                        }
                      >
                        <option value={0}>- নির্বাচন করুন -</option>
                        {dropDownInfo.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.glacName}
                          </option>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell align="right" className="amount-input">
                      <TextField
                        name="tranAmount"
                        required
                        type="text"
                        inputProps={{ style: { textAlign: 'right' } }}
                        value={x.tranAmount || null}
                        onChange={(e) => handleInputChangeIncome(e, i)}
                        variant="outlined"
                        size="small"
                        error={x.tranAmountError}
                        disabled={
                          isApproval ? isApproval : glacType === 2 && (x.glacId === 238 || x.glacId === 240) && true
                        }
                      ></TextField>
                    </TableCell>
                    <TableCell align="center" sx={{ display: isApproval && 'none' }}>
                      {listData.length !== 1 && (
                        <Button className="table-icon delete" onClick={() => handleRemoveClickIncome(i)}>
                          <HorizontalRuleIcon sx={{ display: 'block' }} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                </>
              );
            })}
            <TableRow>
              <TableCell
                colSpan={2}
                style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  textAlign: 'right',
                }}
              >
                মোট &nbsp;
              </TableCell>
              <TableCell
                style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  textAlign: 'right',
                }}
              >
                <TextField
                  fullWidth
                  name="income"
                  required
                  type="text"
                  inputProps={{
                    style: {
                      textAlign: 'right',
                      fontSize: '15px',
                      fontWeight: 'bold',
                    },
                    readOnly: true,
                  }}
                  value={totalAmountCalculation(listData) !== 0 ? engToBang(totalAmountCalculation(listData)) : ' '}
                  variant="outlined"
                  size="small"
                  // error={
                  //     totalAmountCalculation.pIncome <
                  //         totalAmountCalculation.pExpense
                  //         ? true
                  //         : false
                  // }
                ></TextField>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default DynamicLedger;
