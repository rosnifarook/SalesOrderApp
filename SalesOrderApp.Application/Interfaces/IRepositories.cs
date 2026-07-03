using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Interfaces;

public interface IClientRepository
{
    Task<IEnumerable<Client>> GetAllAsync();
    Task<Client?> GetByIdAsync(int id);
}

public interface IItemRepository
{
    Task<IEnumerable<Item>> GetAllAsync();
    Task<Item?> GetByIdAsync(int id);
}

public interface ISalesOrderRepository
{
    Task<IEnumerable<SalesOrder>> GetAllAsync();
    Task<SalesOrder?> GetByIdAsync(int id);
    Task<SalesOrder> AddAsync(SalesOrder order);
    Task<SalesOrder> UpdateAsync(SalesOrder order);
}

public interface IClientService
{
    Task<IEnumerable<ClientDto>> GetAllClientsAsync();
    Task<ClientDto?> GetClientByIdAsync(int id);
}

public interface IItemService
{
    Task<IEnumerable<ItemDto>> GetAllItemsAsync();
}

public interface ISalesOrderService
{
    Task<IEnumerable<SalesOrderListDto>> GetAllOrdersAsync();
    Task<SalesOrderDto?> GetOrderByIdAsync(int id);
    Task<SalesOrderDto> CreateOrderAsync(CreateSalesOrderDto dto);
    Task<SalesOrderDto?> UpdateOrderAsync(int id, CreateSalesOrderDto dto);
}
