using AutoMapper;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Services;

public class ClientService : IClientService
{
    private readonly IClientRepository _repository;
    private readonly IMapper _mapper;

    public ClientService(IClientRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ClientDto>> GetAllClientsAsync()
    {
        var clients = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<ClientDto>>(clients);
    }

    public async Task<ClientDto?> GetClientByIdAsync(int id)
    {
        var client = await _repository.GetByIdAsync(id);
        return client == null ? null : _mapper.Map<ClientDto>(client);
    }
}

public class ItemService : IItemService
{
    private readonly IItemRepository _repository;
    private readonly IMapper _mapper;

    public ItemService(IItemRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ItemDto>> GetAllItemsAsync()
    {
        var items = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<ItemDto>>(items);
    }
}

public class SalesOrderService : ISalesOrderService
{
    private readonly ISalesOrderRepository _repository;
    private readonly IItemRepository _itemRepository;
    private readonly IMapper _mapper;

    public SalesOrderService(
        ISalesOrderRepository repository,
        IItemRepository itemRepository,
        IMapper mapper)
    {
        _repository = repository;
        _itemRepository = itemRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SalesOrderListDto>> GetAllOrdersAsync()
    {
        var orders = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<SalesOrderListDto>>(orders);
    }

    public async Task<SalesOrderDto?> GetOrderByIdAsync(int id)
    {
        var order = await _repository.GetByIdAsync(id);
        return order == null ? null : _mapper.Map<SalesOrderDto>(order);
    }

    public async Task<SalesOrderDto> CreateOrderAsync(CreateSalesOrderDto dto)
    {
        var order = BuildOrderEntity(dto);
        var created = await _repository.AddAsync(order);
        return _mapper.Map<SalesOrderDto>(created);
    }

    public async Task<SalesOrderDto?> UpdateOrderAsync(int id, CreateSalesOrderDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return null;

        var updated = BuildOrderEntity(dto);
        updated.Id = id;
        updated.CreatedAt = existing.CreatedAt;

        var result = await _repository.UpdateAsync(updated);
        return _mapper.Map<SalesOrderDto>(result);
    }

    private SalesOrder BuildOrderEntity(CreateSalesOrderDto dto)
    {
        var order = new SalesOrder
        {
            ClientId = dto.ClientId,
            CustomerName = dto.CustomerName,
            Address1 = dto.Address1,
            Address2 = dto.Address2,
            Address3 = dto.Address3,
            Suburb = dto.Suburb,
            State = dto.State,
            PostCode = dto.PostCode,
            InvoiceNo = dto.InvoiceNo,
            InvoiceDate = dto.InvoiceDate,
            ReferenceNo = dto.ReferenceNo,
            Note = dto.Note,
            Lines = new List<SalesOrderLine>()
        };

        foreach (var lineDto in dto.Lines.Where(l => l.ItemId > 0 && l.Quantity > 0))
        {
            var exclAmount = lineDto.Quantity * lineDto.Price;
            var taxAmount = exclAmount * lineDto.TaxRate / 100m;
            var inclAmount = exclAmount + taxAmount;

            order.Lines.Add(new SalesOrderLine
            {
                ItemId = lineDto.ItemId,
                ItemCode = lineDto.ItemCode,
                Description = lineDto.Description,
                Note = lineDto.Note,
                Quantity = lineDto.Quantity,
                Price = lineDto.Price,
                TaxRate = lineDto.TaxRate,
                ExclAmount = exclAmount,
                TaxAmount = taxAmount,
                InclAmount = inclAmount
            });
        }

        order.TotalExcl = order.Lines.Sum(l => l.ExclAmount);
        order.TotalTax = order.Lines.Sum(l => l.TaxAmount);
        order.TotalIncl = order.Lines.Sum(l => l.InclAmount);

        return order;
    }
}
