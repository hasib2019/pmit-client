/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 15:46:51
 * @modify date 2022-11-03 15:46:51
 * @desc [description]
 */

import { Grid } from '@mui/material';
import { styled } from '@mui/system';
import { max } from 'lodash';
import PropTypes from 'prop-types';
import { Component } from 'react';

class BalanceTable extends Component {
  state = {
    formatData: {
      incomeAndAsset: [],
      liabilityAndExpense: [],
      assetTotal: {
        debitBalance: 0,
        creditBalance: 0,
      },
      liabilityTotal: {
        debitBalance: 0,
        creditBalance: 0,
      },
      incomeTotal: {
        debitBalance: 0,
        creditBalance: 0,
      },
      expenseTotal: {
        debitBalance: 0,
        creditBalance: 0,
      },
    },
  };

  formatData = () => {
    const asset = [],
      liability = [],
      income = [],
      expense = [];

    let assetTotal = {
        debitBalance: 0,
        creditBalance: 0,
      },
      liabilityTotal = {
        debitBalance: 0,
        creditBalance: 0,
      },
      incomeTotal = {
        debitBalance: 0,
        creditBalance: 0,
      },
      expenseTotal = {
        debitBalance: 0,
        creditBalance: 0,
      };

    this.props.data.map((d) => {
      const type = d.glCode.toString()[0];

      if (type == 1) {
        assetTotal.debitBalance += d.debitBalance || 0;
        assetTotal.creditBalance += d.creditBalance || 0;
        asset.push(d);
      }
      if (type == 2) {
        liabilityTotal.debitBalance += d.debitBalance || 0;
        liabilityTotal.creditBalance += d.creditBalance || 0;
        liability.push(d);
      }
      if (type == 3) {
        incomeTotal.debitBalance += d.debitBalance || 0;
        incomeTotal.creditBalance += d.creditBalance || 0;
        income.push(d);
      }

      if (type == 4) {
        expenseTotal.debitBalance += d.debitBalance || 0;
        expenseTotal.creditBalance += d.creditBalance || 0;
        expense.push(d);
      }
    });

    const incomeAndAsset = [],
      liabilityAndExpense = [];

    const incomeAndAssetMaxLength = max([income.length, asset.length]);
    const liabilityAndExpenseMaxLength = max([liability.length, expense.length]);

    for (let i = 0; i < incomeAndAssetMaxLength; i++) {
      incomeAndAsset.push({
        incomeName: income[i]?.glName,
        incomeDebitBalance: income[i]?.debitBalance,
        incomeCreditBalance: income[i]?.creditBalance,
        assetName: asset[i]?.glName,
        assetDebitBalance: asset[i]?.debitBalance,
        assetCreditBalance: asset[i]?.creditBalance,
      });
    }

    for (let i = 0; i < liabilityAndExpenseMaxLength; i++) {
      liabilityAndExpense.push({
        liabilityName: liability[i]?.glName,
        liabilityDebitBalance: liability[i]?.debitBalance,
        liabilityCreditBalance: liability[i]?.creditBalance,
        expenseName: expense[i]?.glName,
        expenseDebitBalance: expense[i]?.debitBalance,
        expenseCreditBalance: expense[i]?.creditBalance,
      });
    }

    this.setState({
      formatData: {
        incomeAndAsset,
        liabilityAndExpense,
        assetTotal,
        liabilityTotal,
        incomeTotal,
        expenseTotal,
      },
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.data?.length !== this.props.data?.length) {
      this.formatData();
    }
  }

  render() {
    const Root = styled('div')`
      table {
        border-collapse: collapse;
        width: 100%;
      }

      td,
      th {
        border: 1px solid #ddd;
        text-align: left;
        padding: 8px;
      }

      th {
        background-color: #ddd;
      }
    `;

    const { incomeAndAsset, liabilityAndExpense, incomeTotal, assetTotal, liabilityTotal, expenseTotal } =
      this.state.formatData;

    return (
      <Grid sx={{ width: '100%' }}>
        <Root>
          <table aria-label="custom pagination table">
            <thead>
              <tr>
                <th colSpan={3}>Income</th>
                <th colSpan={3}>Asset</th>
              </tr>
            </thead>
            <tbody>
              <tr key="1">
                <td style={{ fontWeight: 'bold' }}>GL List (Child with parent)</td>
                <td
                  style={{
                    fontWeight: 'bold',
                    width: 160,
                    textAlign: 'right',
                  }}
                >
                  Debit Balance
                </td>
                <td
                  style={{
                    fontWeight: 'bold',
                    width: 160,
                    textAlign: 'right',
                  }}
                >
                  Credit Balance
                </td>
                <td style={{ fontWeight: 'bold' }}>GL List (Child with parent)</td>
                <td
                  style={{
                    fontWeight: 'bold',
                    width: 160,
                    textAlign: 'right',
                  }}
                >
                  Debit Balance
                </td>
                <td
                  style={{
                    fontWeight: 'bold',
                    width: 160,
                    textAlign: 'right',
                  }}
                >
                  Credit Balance
                </td>
              </tr>
              {incomeAndAsset.map((d) => {
                return (
                  <tr key={d.incomeName}>
                    <td>{d.incomeName}</td>
                    <td style={{ width: 160, textAlign: 'right' }}>{d.incomeDebitBalance}</td>
                    <td style={{ width: 160, textAlign: 'right' }}>{d.incomeCreditBalance}</td>
                    <td>{d.assetName}</td>
                    <td style={{ width: 160, textAlign: 'right' }}>{d.assetDebitBalance}</td>
                    <td style={{ width: 160, textAlign: 'right' }}>{d.assetCreditBalance}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={2} style={{ width: 160, textAlign: 'right' }}>
                  {incomeTotal.debitBalance}
                </td>
                <td style={{ width: 160, textAlign: 'right' }}>{incomeTotal.creditBalance}</td>
                <td colSpan={2} style={{ width: 160, textAlign: 'right' }}>
                  {assetTotal.debitBalance}
                </td>
                <td style={{ width: 160, textAlign: 'right' }}>{assetTotal.creditBalance}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th colSpan="3">Liability</th>
                <th colSpan="3">Expense</th>
              </tr>
            </thead>
            <tbody>
              <tr key="1">
                <td style={{ fontWeight: 'bold' }}>GL List (Child with parent)</td>
                <td
                  style={{
                    fontWeight: 'bold',
                    width: 160,
                    textAlign: 'right',
                  }}
                >
                  Debit Balance
                </td>
                <td
                  style={{
                    fontWeight: 'bold',
                    width: 160,
                    textAlign: 'right',
                  }}
                >
                  Credit Balance
                </td>
                <td style={{ fontWeight: 'bold' }}>GL List (Child with parent)</td>
                <td
                  style={{
                    fontWeight: 'bold',
                    width: 160,
                    textAlign: 'right',
                  }}
                >
                  Debit Balance
                </td>
                <td
                  style={{
                    fontWeight: 'bold',
                    width: 160,
                    textAlign: 'right',
                  }}
                >
                  Credit Balance
                </td>
              </tr>
              {liabilityAndExpense.map((d) => {
                return (
                  <tr key={d.liabilityName}>
                    <td>{d.liabilityName}</td>
                    <td style={{ width: 160, textAlign: 'right' }}>{d.liabilityDebitBalance}</td>
                    <td style={{ width: 160, textAlign: 'right' }}>{d.liabilityCreditBalance}</td>
                    <td>{d.expenseName}</td>
                    <td style={{ width: 160, textAlign: 'right' }}>{d.expenseDebitBalance}</td>
                    <td style={{ width: 160, textAlign: 'right' }}>{d.expenseCreditBalance}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={2} style={{ width: 160, textAlign: 'right' }}>
                  {liabilityTotal.debitBalance}
                </td>
                <td style={{ width: 160, textAlign: 'right' }}>{liabilityTotal.creditBalance}</td>

                <td colSpan={2} style={{ width: 160, textAlign: 'right' }}>
                  {expenseTotal.debitBalance}
                </td>
                <td style={{ width: 160, textAlign: 'right' }}>{expenseTotal.creditBalance}</td>
              </tr>
              <tr>
                <td>Grand Total</td>
                <td style={{ width: 160, textAlign: 'right' }}>
                  {incomeTotal.debitBalance + liabilityTotal.debitBalance}
                </td>
                <td style={{ width: 160, textAlign: 'right' }}>
                  {incomeTotal.creditBalance + liabilityTotal.creditBalance}
                </td>
                <td>Grand Total</td>
                <td style={{ width: 160, textAlign: 'right' }}>
                  {assetTotal.debitBalance + expenseTotal.debitBalance}
                </td>
                <td style={{ width: 160, textAlign: 'right' }}>
                  {assetTotal.creditBalance + expenseTotal.creditBalance}
                </td>
              </tr>
            </tbody>
          </table>
        </Root>
      </Grid>
    );
  }
}

BalanceTable.propTypes = {
  data: PropTypes.array,
};

export default BalanceTable;
