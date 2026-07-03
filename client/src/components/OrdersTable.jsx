import { formatCurrency, formatDate } from '../utils/calculations';

const OrdersTable = ({ orders, onRowDoubleClick }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="border-b border-gray-300 px-4 py-3 font-semibold">Order ID</th>
          <th className="border-b border-gray-300 px-4 py-3 font-semibold">Invoice No.</th>
          <th className="border-b border-gray-300 px-4 py-3 font-semibold">Invoice Date</th>
          <th className="border-b border-gray-300 px-4 py-3 font-semibold">Customer Name</th>
          <th className="border-b border-gray-300 px-4 py-3 font-semibold">Reference No.</th>
          <th className="border-b border-gray-300 px-4 py-3 font-semibold text-right">Total Excl</th>
          <th className="border-b border-gray-300 px-4 py-3 font-semibold text-right">Total Incl</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
              No sales orders found. Click &quot;Add New&quot; to create one.
            </td>
          </tr>
        ) : (
          orders.map((order, index) => (
            <tr
              key={order.id}
              onDoubleClick={() => onRowDoubleClick(order.id)}
              className={`cursor-pointer transition-colors hover:bg-primary-50 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="border-b border-gray-200 px-4 py-3">{order.id}</td>
              <td className="border-b border-gray-200 px-4 py-3">{order.invoiceNo}</td>
              <td className="border-b border-gray-200 px-4 py-3">{formatDate(order.invoiceDate)}</td>
              <td className="border-b border-gray-200 px-4 py-3">{order.customerName}</td>
              <td className="border-b border-gray-200 px-4 py-3">{order.referenceNo}</td>
              <td className="border-b border-gray-200 px-4 py-3 text-right">{formatCurrency(order.totalExcl)}</td>
              <td className="border-b border-gray-200 px-4 py-3 text-right">{formatCurrency(order.totalIncl)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default OrdersTable;
