import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './slices/clientsSlice';
import itemsReducer from './slices/itemsSlice';
import salesOrdersReducer from './slices/salesOrdersSlice';

const store = configureStore({
  reducer: {
    clients: clientsReducer,
    items: itemsReducer,
    salesOrders: salesOrdersReducer,
  },
});

export default store;
