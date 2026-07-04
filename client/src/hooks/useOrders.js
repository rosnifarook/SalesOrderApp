import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/slices/salesOrdersSlice';

export function useOrders() {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.salesOrders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return { orders, status };
}
