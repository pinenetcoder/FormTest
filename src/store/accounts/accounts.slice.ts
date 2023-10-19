import { createSlice } from "@reduxjs/toolkit";

export interface IAccounts {
  name: string;
  initialState: Array<{iban: string; id: string; balance: number}>
}

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState: [
    {
      iban: 'LT307300010172619160',
      id: '1',
      balance: 1000.12
    },
    {
      iban: 'LT307300010172619161',
      id: '2',
      balance: 2.43
    },
    {
      iban: 'LT307300010172619162',
      id: '3',
      balance: -5.87
    }
  ],
  reducers: {
    getFromAccount: (state, {payload}) => {
      state.forEach(acc => {
        if (acc.iban === payload.account) {
          acc.balance -= payload.amount
        }
      })
    }
  }
})

export const {actions, reducer} = accountsSlice