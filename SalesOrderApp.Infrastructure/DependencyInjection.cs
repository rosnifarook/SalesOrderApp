using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Application.Mapping;
using SalesOrderApp.Application.Services;
using SalesOrderApp.Infrastructure.Data;
using SalesOrderApp.Infrastructure.Repositories;

namespace SalesOrderApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IClientRepository, ClientRepository>();
        services.AddScoped<IItemRepository, ItemRepository>();
        services.AddScoped<ISalesOrderRepository, SalesOrderRepository>();

        services.AddScoped<IClientService, ClientService>();
        services.AddScoped<IItemService, ItemService>();
        services.AddScoped<ISalesOrderService, SalesOrderService>();

        services.AddAutoMapper(typeof(MappingProfile));

        return services;
    }
}
