using AutoMapper;
using SalesOrderApp.API.Models;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.API.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Client, ClientDto>();
        CreateMap<Item, ItemDto>();
        CreateMap<SalesOrderLine, SalesOrderLineDto>();
        CreateMap<SalesOrder, SalesOrderDto>();
        CreateMap<SalesOrder, SalesOrderListDto>();
        CreateMap<CreateSalesOrderLineDto, SalesOrderLine>();
        CreateMap<CreateSalesOrderDto, SalesOrder>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.TotalExcl, opt => opt.Ignore())
            .ForMember(dest => dest.TotalTax, opt => opt.Ignore())
            .ForMember(dest => dest.TotalIncl, opt => opt.Ignore())
            .ForMember(dest => dest.Lines, opt => opt.MapFrom(src =>
                src.Lines.Where(l => l.ItemId > 0 && l.Quantity > 0)));
    }
}
