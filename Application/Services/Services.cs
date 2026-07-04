using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Services;

public class ClientService : IClientService
{
    private readonly IClientRepository _repository;

    public ClientService(IClientRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Client>> GetAllClientsAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Client?> GetClientByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }
}

public class ItemService : IItemService
{
    private readonly IItemRepository _repository;

    public ItemService(IItemRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Item>> GetAllItemsAsync()
    {
        return await _repository.GetAllAsync();
    }
}

public class SalesOrderService : ISalesOrderService
{
    private readonly ISalesOrderRepository _repository;

    public SalesOrderService(ISalesOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<SalesOrder>> GetAllOrdersAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<SalesOrder?> GetOrderByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<SalesOrder> CreateOrderAsync(SalesOrder order)
    {
        PrepareOrder(order);
        return await _repository.AddAsync(order);
    }

    public async Task<SalesOrder?> UpdateOrderAsync(int id, SalesOrder order)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return null;

        order.Id = id;
        order.CreatedAt = existing.CreatedAt;
        PrepareOrder(order);

        return await _repository.UpdateAsync(order);
    }

    private static void PrepareOrder(SalesOrder order)
    {
        foreach (var line in order.Lines)
        {
            line.ExclAmount = line.Quantity * line.Price;
            line.TaxAmount = line.ExclAmount * line.TaxRate / 100m;
            line.InclAmount = line.ExclAmount + line.TaxAmount;
        }

        order.TotalExcl = order.Lines.Sum(l => l.ExclAmount);
        order.TotalTax = order.Lines.Sum(l => l.TaxAmount);
        order.TotalIncl = order.Lines.Sum(l => l.InclAmount);
    }
}
