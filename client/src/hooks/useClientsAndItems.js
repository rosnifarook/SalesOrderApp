import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients } from '../redux/slices/clientsSlice';
import { fetchItems } from '../redux/slices/itemsSlice';

export function useClientsAndItems() {
  const dispatch = useDispatch();
  const { items: clients } = useSelector((state) => state.clients);
  const { items: productItems } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchItems());
  }, [dispatch]);

  return { clients, productItems };
}
