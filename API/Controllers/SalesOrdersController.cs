using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.API.Models;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly ISalesOrderService _salesOrderService;
    private readonly IMapper _mapper;

    public SalesOrdersController(ISalesOrderService salesOrderService, IMapper mapper)
    {
        _salesOrderService = salesOrderService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SalesOrderListDto>>> GetAll()
    {
        var orders = await _salesOrderService.GetAllOrdersAsync();
        return Ok(_mapper.Map<IEnumerable<SalesOrderListDto>>(orders));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SalesOrderDto>> GetById(int id)
    {
        var order = await _salesOrderService.GetOrderByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(_mapper.Map<SalesOrderDto>(order));
    }

    [HttpPost]
    public async Task<ActionResult<SalesOrderDto>> Create([FromBody] CreateSalesOrderDto dto)
    {
        var order = _mapper.Map<SalesOrder>(dto);
        var created = await _salesOrderService.CreateOrderAsync(order);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, _mapper.Map<SalesOrderDto>(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SalesOrderDto>> Update(int id, [FromBody] CreateSalesOrderDto dto)
    {
        var order = _mapper.Map<SalesOrder>(dto);
        var updated = await _salesOrderService.UpdateOrderAsync(id, order);
        if (updated == null) return NotFound();
        return Ok(_mapper.Map<SalesOrderDto>(updated));
    }
}
