import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import OrdersTable from '../components/OrdersTable';
import { useOrders } from '../hooks/useOrders';

const HomePage = () => {
  const navigate = useNavigate();
  const { orders, status } = useOrders();

  const handleAddNew = () => {
    navigate('/sales-order');
  };

  const handleRowDoubleClick = (id) => {
    navigate(`/sales-order/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-300 bg-white px-6 py-4 shadow-sm">
        <h1 className="text-center text-2xl font-semibold text-gray-800">Home</h1>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="no-print mb-4">
          <Button onClick={handleAddNew}>Add New</Button>
        </div>

        {status === 'loading' ? (
          <div className="rounded-lg border border-gray-300 bg-white p-8 text-center text-gray-500">
            Loading orders...
          </div>
        ) : (
          <OrdersTable orders={orders} onRowDoubleClick={handleRowDoubleClick} />
        )}
      </main>
    </div>
  );
};

export default HomePage;
