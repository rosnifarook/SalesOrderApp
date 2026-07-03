using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Data;

namespace SalesOrderApp.Infrastructure.Repositories;

public class ClientRepository : IClientRepository
{
    private readonly ApplicationDbContext _context;

    public ClientRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Client>> GetAllAsync()
    {
        return await _context.Clients.OrderBy(c => c.CustomerName).ToListAsync();
    }

    public async Task<Client?> GetByIdAsync(int id)
    {
        return await _context.Clients.FindAsync(id);
    }
}

public class ItemRepository : IItemRepository
{
    private readonly ApplicationDbContext _context;

    public ItemRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Item>> GetAllAsync()
    {
        return await _context.Items.OrderBy(i => i.ItemCode).ToListAsync();
    }

    public async Task<Item?> GetByIdAsync(int id)
    {
        return await _context.Items.FindAsync(id);
    }
}

public class SalesOrderRepository : ISalesOrderRepository
{
    private readonly ApplicationDbContext _context;

    public SalesOrderRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SalesOrder>> GetAllAsync()
    {
        return await _context.SalesOrders
            .OrderByDescending(o => o.InvoiceDate)
            .ThenByDescending(o => o.Id)
            .ToListAsync();
    }

    public async Task<SalesOrder?> GetByIdAsync(int id)
    {
        return await _context.SalesOrders
            .Include(o => o.Lines)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<SalesOrder> AddAsync(SalesOrder order)
    {
        _context.SalesOrders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task<SalesOrder> UpdateAsync(SalesOrder order)
    {
        var existing = await _context.SalesOrders
            .Include(o => o.Lines)
            .FirstOrDefaultAsync(o => o.Id == order.Id);

        if (existing == null)
            throw new InvalidOperationException("Order not found");

        _context.SalesOrderLines.RemoveRange(existing.Lines);

        existing.ClientId = order.ClientId;
        existing.CustomerName = order.CustomerName;
        existing.Address1 = order.Address1;
        existing.Address2 = order.Address2;
        existing.Address3 = order.Address3;
        existing.Suburb = order.Suburb;
        existing.State = order.State;
        existing.PostCode = order.PostCode;
        existing.InvoiceNo = order.InvoiceNo;
        existing.InvoiceDate = order.InvoiceDate;
        existing.ReferenceNo = order.ReferenceNo;
        existing.Note = order.Note;
        existing.TotalExcl = order.TotalExcl;
        existing.TotalTax = order.TotalTax;
        existing.TotalIncl = order.TotalIncl;
        existing.Lines = order.Lines;

        await _context.SaveChangesAsync();
        return existing;
    }
}
