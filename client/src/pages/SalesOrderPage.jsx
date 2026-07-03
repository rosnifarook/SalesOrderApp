import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import TextArea from '../components/TextArea';
import { fetchClients } from '../redux/slices/clientsSlice';
import { fetchItems } from '../redux/slices/itemsSlice';
import { fetchOrderById, saveOrder } from '../redux/slices/salesOrdersSlice';
import {
  calculateLineAmounts,
  calculateTotals,
  createEmptyLine,
  createEmptyOrder,
  formatCurrency,
} from '../utils/calculations';

const SalesOrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: clients } = useSelector((state) => state.clients);
  const { items: productItems } = useSelector((state) => state.items);
  const { currentOrder, saveStatus } = useSelector((state) => state.salesOrders);

  const [order, setOrder] = useState(createEmptyOrder());
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchItems());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentOrder && id) {
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
  }, [currentOrder, id]);

  const totals = calculateTotals(order.lines);

  const handleCustomerChange = (e) => {
    const clientId = Number(e.target.value);
    const client = clients.find((c) => c.id === clientId);

    if (client) {
      setOrder((prev) => ({
        ...prev,
        clientId,
        customerName: client.customerName,
        address1: client.address1,
        address2: client.address2,
        address3: client.address3,
        suburb: client.suburb,
        state: client.state,
        postCode: client.postCode,
      }));
    } else {
      setOrder((prev) => ({ ...prev, clientId: 0, customerName: '' }));
    }
  };

  const handleFieldChange = (field, value) => {
    setOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineChange = (index, field, value) => {
    setOrder((prev) => {
      const lines = [...prev.lines];
      lines[index] = { ...lines[index], [field]: value };
      return { ...prev, lines };
    });
  };

  const handleItemCodeChange = (index, itemCode) => {
    const item = productItems.find((i) => i.itemCode === itemCode);
    if (item) {
      setOrder((prev) => {
        const lines = [...prev.lines];
        lines[index] = {
          ...lines[index],
          itemId: item.id,
          itemCode: item.itemCode,
          description: item.description,
          price: item.price,
        };
        return { ...prev, lines };
      });
    }
  };

  const handleDescriptionChange = (index, description) => {
    const item = productItems.find((i) => i.description === description);
    if (item) {
      setOrder((prev) => {
        const lines = [...prev.lines];
        lines[index] = {
          ...lines[index],
          itemId: item.id,
          itemCode: item.itemCode,
          description: item.description,
          price: item.price,
        };
        return { ...prev, lines };
      });
    }
  };

  const addLine = () => {
    setOrder((prev) => ({
      ...prev,
      lines: [...prev.lines, createEmptyLine()],
    }));
  };

  const removeLine = (index) => {
    if (order.lines.length <= 1) return;
    setOrder((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  };

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
        id: id ? Number(id) : null,
        data: { ...order, lines: validLines },
      })).unwrap();
      setMessage('Order saved successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch {
      setMessage('Failed to save order. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: c.customerName,
  }));

  const itemCodeOptions = productItems.map((i) => ({
    value: i.itemCode,
    label: i.itemCode,
  }));

  const descriptionOptions = productItems.map((i) => ({
    value: i.description,
    label: i.description,
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="no-print border-b border-gray-300 bg-white px-6 py-4 shadow-sm">
        <h1 className="text-center text-2xl font-semibold text-gray-800">Sales Order</h1>
      </header>

      <main className="print-area mx-auto max-w-7xl p-4 md:p-6">
        <div className="no-print mb-4 flex flex-wrap gap-3">
          <Button variant="success" onClick={handleSave} disabled={saveStatus === 'loading'}>
            ✓ Save Order
          </Button>
          {id && (
            <Button variant="secondary" onClick={handlePrint}>
              Print Order
            </Button>
          )}
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>

        {message && (
          <div className={`no-print mb-4 rounded-md border px-4 py-3 text-sm ${
            message.includes('success') ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mb-6 rounded-lg border border-gray-300 bg-white p-4 shadow-sm md:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <Select
                label="Customer Name"
                id="customerName"
                value={order.clientId || ''}
                onChange={handleCustomerChange}
                options={clientOptions}
                placeholder="Select customer..."
              />
              <Input label="Address 1" id="address1" value={order.address1} onChange={(e) => handleFieldChange('address1', e.target.value)} />
              <Input label="Address 2" id="address2" value={order.address2} onChange={(e) => handleFieldChange('address2', e.target.value)} />
              <Input label="Address 3" id="address3" value={order.address3} onChange={(e) => handleFieldChange('address3', e.target.value)} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input label="Suburb" id="suburb" value={order.suburb} onChange={(e) => handleFieldChange('suburb', e.target.value)} />
                <Input label="State" id="state" value={order.state} onChange={(e) => handleFieldChange('state', e.target.value)} />
                <Input label="Post Code" id="postCode" value={order.postCode} onChange={(e) => handleFieldChange('postCode', e.target.value)} />
              </div>
            </div>

            <div className="space-y-3">
              <Input label="Invoice No." id="invoiceNo" value={order.invoiceNo} onChange={(e) => handleFieldChange('invoiceNo', e.target.value)} />
              <Input label="Invoice Date" id="invoiceDate" type="date" value={order.invoiceDate} onChange={(e) => handleFieldChange('invoiceDate', e.target.value)} />
              <Input label="Reference no" id="referenceNo" value={order.referenceNo} onChange={(e) => handleFieldChange('referenceNo', e.target.value)} />
              <TextArea label="Note" id="note" value={order.note} onChange={(e) => handleFieldChange('note', e.target.value)} rows={5} />
            </div>
          </div>
        </div>

        <div className="mb-6 overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border-b border-gray-300 px-2 py-3 font-semibold">Item Code</th>
                <th className="border-b border-gray-300 px-2 py-3 font-semibold">Description</th>
                <th className="border-b border-gray-300 px-2 py-3 font-semibold">Note</th>
                <th className="border-b border-gray-300 px-2 py-3 font-semibold">Quantity</th>
                <th className="border-b border-gray-300 px-2 py-3 font-semibold">Price</th>
                <th className="border-b border-gray-300 px-2 py-3 font-semibold">Tax %</th>
                <th className="border-b border-gray-300 px-2 py-3 font-semibold text-right">Excl Amount</th>
                <th className="border-b border-gray-300 px-2 py-3 font-semibold text-right">Tax Amount</th>
                <th className="border-b border-gray-300 px-2 py-3 font-semibold text-right">Incl Amount</th>
                <th className="no-print border-b border-gray-300 px-2 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line, index) => {
                const amounts = calculateLineAmounts(line.quantity, line.price, line.taxRate);
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border-b border-gray-200 px-2 py-2">
                      <select
                        value={line.itemCode}
                        onChange={(e) => handleItemCodeChange(index, e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      >
                        <option value="">Select...</option>
                        {itemCodeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border-b border-gray-200 px-2 py-2">
                      <select
                        value={line.description}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      >
                        <option value="">Select...</option>
                        {descriptionOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border-b border-gray-200 px-2 py-2">
                      <input
                        type="text"
                        value={line.note}
                        onChange={(e) => handleLineChange(index, 'note', e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="border-b border-gray-200 px-2 py-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={line.quantity}
                        onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="border-b border-gray-200 px-2 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.price}
                        onChange={(e) => handleLineChange(index, 'price', e.target.value)}
                        className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="border-b border-gray-200 px-2 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.taxRate}
                        onChange={(e) => handleLineChange(index, 'taxRate', e.target.value)}
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="border-b border-gray-200 px-2 py-2 text-right">{formatCurrency(amounts.exclAmount)}</td>
                    <td className="border-b border-gray-200 px-2 py-2 text-right">{formatCurrency(amounts.taxAmount)}</td>
                    <td className="border-b border-gray-200 px-2 py-2 text-right">{formatCurrency(amounts.inclAmount)}</td>
                    <td className="no-print border-b border-gray-200 px-2 py-2">
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove line"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="no-print mb-6">
          <Button variant="secondary" onClick={addLine}>+ Add Line Item</Button>
        </div>

        <div className="flex justify-end">
          <div className="w-full max-w-sm space-y-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Total Excl:</span>
              <span>{formatCurrency(totals.totalExcl)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Total Tax:</span>
              <span>{formatCurrency(totals.totalTax)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold">
              <span>Total Incl:</span>
              <span>{formatCurrency(totals.totalIncl)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesOrderPage;
