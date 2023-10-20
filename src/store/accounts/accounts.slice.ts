import { createSlice } from "@reduxjs/toolkit";

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState: [
    {
      iban: 'LT307300010172619160',
      id: '1',
      balance: 1000.12,
      currency: 'eur'
    },
    {
      iban: 'LT307300010172619161',
      id: '2',
      balance: 2.43,
      currency: 'usd'
    },
    {
      iban: 'LT307300010172619162',
      id: '3',
      balance: -5.87,
      currency: 'chf'
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