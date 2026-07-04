using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Interfaces;

public interface IClientService
{
    Task<IEnumerable<Client>> GetAllClientsAsync();
    Task<Client?> GetClientByIdAsync(int id);
}

public interface IItemService
{
    Task<IEnumerable<Item>> GetAllItemsAsync();
}

public interface ISalesOrderService
{
    Task<IEnumerable<SalesOrder>> GetAllOrdersAsync();
    Task<SalesOrder?> GetOrderByIdAsync(int id);
    Task<SalesOrder> CreateOrderAsync(SalesOrder order);
    Task<SalesOrder?> UpdateOrderAsync(int id, SalesOrder order);
}
