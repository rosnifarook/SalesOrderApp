import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrderById, saveOrder } from '../redux/slices/salesOrdersSlice';
import { createEmptyLine, createEmptyOrder } from '../utils/calculations';

export function useSalesOrderForm(orderId) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder, saveStatus } = useSelector((state) => state.salesOrders);

  const [order, setOrder] = useState(createEmptyOrder());
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(Number(orderId)));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (currentOrder && orderId) {
      setOrder({
        clientId: currentOrder.clientId,
        customerName: currentOrder.customerName,
        address1: currentOrder.address1,
        address2: currentOrder.address2,
        address3: currentOrder.address3,
        suburb: currentOrder.suburb,
        state: currentOrder.state,
        postCode: currentOrder.postCode,
        invoiceNo: currentOrder.invoiceNo,
        invoiceDate: currentOrder.invoiceDate.split('T')[0],
        referenceNo: currentOrder.referenceNo,
        note: currentOrder.note,
        lines: currentOrder.lines.length > 0
          ? currentOrder.lines.map((line) => ({
              itemId: line.itemId,
              itemCode: line.itemCode,
              description: line.description,
              note: line.note,
              quantity: line.quantity,
              price: line.price,
              taxRate: line.taxRate,
            }))
          : [createEmptyLine()],
      });
    }
  }, [currentOrder, orderId]);

  const handleSave = async () => {
    if (!order.clientId) {
      setMessage('Please select a customer.');
      return;
    }

    const validLines = order.lines.filter((line) => line.itemId > 0 && line.quantity > 0);
    if (validLines.length === 0) {
      setMessage('Please add at least one line item with quantity.');
      return;
    }

    try {
      await dispatch(saveOrder({
        id: orderId ? Number(orderId) : null,
        data: { ...order, lines: validLines },
      })).unwrap();
      setMessage('Order saved successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch {
      setMessage('Failed to save order. Please try again.');
    }
  };

  return {
    order,
    setOrder,
    message,
    saveStatus,
    handleSave,
  };
}
