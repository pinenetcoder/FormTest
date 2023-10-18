import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { reducer as accountsReducer } from './accounts/accounts.slice'

const reducers = combineReducers({
  accounts: accountsReducer,
})

export const store = configureStore({
  reducer: reducers,
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>