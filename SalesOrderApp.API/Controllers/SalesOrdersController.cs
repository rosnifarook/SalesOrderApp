using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;

namespace SalesOrderApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly ISalesOrderService _salesOrderService;

    public SalesOrdersController(ISalesOrderService salesOrderService)
    {
        _salesOrderService = salesOrderService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SalesOrderListDto>>> GetAll()
    {
        var orders = await _salesOrderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SalesOrderDto>> GetById(int id)
    {
        var order = await _salesOrderService.GetOrderByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<SalesOrderDto>> Create([FromBody] CreateSalesOrderDto dto)
    {
        var order = await _salesOrderService.CreateOrderAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SalesOrderDto>> Update(int id, [FromBody] CreateSalesOrderDto dto)
    {
        var order = await _salesOrderService.UpdateOrderAsync(id, dto);
        if (order == null) return NotFound();
        return Ok(order);
    }
}
