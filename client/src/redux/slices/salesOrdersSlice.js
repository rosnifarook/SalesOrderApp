import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { salesOrderApi } from '../../services/api';

export const fetchOrders = createAsyncThunk('salesOrders/fetchAll', async () => {
  const response = await salesOrderApi.getAll();
  return response.data;
});

export const fetchOrderById = createAsyncThunk('salesOrders/fetchById', async (id) => {
  const response = await salesOrderApi.getById(id);
  return response.data;
});

export const saveOrder = createAsyncThunk('salesOrders/save', async ({ id, data }) => {
  if (id) {
    const response = await salesOrderApi.update(id, data);
    return response.data;
  }
  const response = await salesOrderApi.create(data);
  return response.data;
});

const salesOrdersSlice = createSlice({
  name: 'salesOrders',
  orders: [],
  currentOrder: null,
  status: 'idle',
  saveStatus: 'idle',
  error: null,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(saveOrder.pending, (state) => {
        state.saveStatus = 'loading';
      })
      .addCase(saveOrder.fulfilled, (state) => {
        state.saveStatus = 'succeeded';
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentOrder } = salesOrdersSlice.actions;
export default salesOrdersSlice.reducer;
