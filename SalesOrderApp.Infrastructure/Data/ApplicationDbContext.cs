using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
    public DbSet<SalesOrderLine> SalesOrderLines => Set<SalesOrderLine>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Client>(entity =>
        {
            entity.ToTable("Client");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CustomerName).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Address1).HasMaxLength(200);
            entity.Property(e => e.Address2).HasMaxLength(200);
            entity.Property(e => e.Address3).HasMaxLength(200);
            entity.Property(e => e.Suburb).HasMaxLength(100);
            entity.Property(e => e.State).HasMaxLength(50);
            entity.Property(e => e.PostCode).HasMaxLength(20);
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.ToTable("Item");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ItemCode).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<SalesOrder>(entity =>
        {
            entity.ToTable("SalesOrder");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CustomerName).HasMaxLength(200);
            entity.Property(e => e.InvoiceNo).HasMaxLength(50);
            entity.Property(e => e.ReferenceNo).HasMaxLength(100);
            entity.Property(e => e.TotalExcl).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TotalTax).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TotalIncl).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Client).WithMany().HasForeignKey(e => e.ClientId);
            entity.HasMany(e => e.Lines).WithOne(l => l.SalesOrder).HasForeignKey(l => l.SalesOrderId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SalesOrderLine>(entity =>
        {
            entity.ToTable("SalesOrderLine");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ItemCode).HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(300);
            entity.Property(e => e.Quantity).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TaxRate).HasColumnType("decimal(18,2)");
            entity.Property(e => e.ExclAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TaxAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.InclAmount).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Item).WithMany().HasForeignKey(e => e.ItemId);
        });

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Client>().HasData(
            new Client { Id = 1, CustomerName = "Acme Corporation", Address1 = "123 Main St", Address2 = "Suite 100", Address3 = "", Suburb = "Sydney", State = "NSW", PostCode = "2000" },
            new Client { Id = 2, CustomerName = "Global Tech Ltd", Address1 = "456 Tech Ave", Address2 = "", Address3 = "", Suburb = "Melbourne", State = "VIC", PostCode = "3000" },
            new Client { Id = 3, CustomerName = "Sunrise Trading", Address1 = "789 Commerce Rd", Address2 = "Building B", Address3 = "Floor 3", Suburb = "Brisbane", State = "QLD", PostCode = "4000" }
        );

        modelBuilder.Entity<Item>().HasData(
            new Item { Id = 1, ItemCode = "ITM001", Description = "Laptop Computer", Price = 1200.00m },
            new Item { Id = 2, ItemCode = "ITM002", Description = "Wireless Mouse", Price = 45.00m },
            new Item { Id = 3, ItemCode = "ITM003", Description = "USB Keyboard", Price = 75.00m },
            new Item { Id = 4, ItemCode = "ITM004", Description = "Monitor 27 inch", Price = 350.00m },
            new Item { Id = 5, ItemCode = "ITM005", Description = "Office Chair", Price = 280.00m }
        );
    }
}
