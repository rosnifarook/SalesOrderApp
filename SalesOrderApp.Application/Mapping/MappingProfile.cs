using AutoMapper;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Client, ClientDto>();
        CreateMap<Item, ItemDto>();
        CreateMap<SalesOrderLine, SalesOrderLineDto>();
        CreateMap<SalesOrder, SalesOrderDto>();
        CreateMap<SalesOrder, SalesOrderListDto>();
    }
}
