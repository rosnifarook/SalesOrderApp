-- Sales Order Application Database Script
-- SQL Server

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SalesOrderDb')
BEGIN
    CREATE DATABASE SalesOrderDb;
END
GO

USE SalesOrderDb;
GO

IF OBJECT_ID('dbo.SalesOrderLine', 'U') IS NOT NULL DROP TABLE dbo.SalesOrderLine;
IF OBJECT_ID('dbo.SalesOrder', 'U') IS NOT NULL DROP TABLE dbo.SalesOrder;
IF OBJECT_ID('dbo.Item', 'U') IS NOT NULL DROP TABLE dbo.Item;
IF OBJECT_ID('dbo.Client', 'U') IS NOT NULL DROP TABLE dbo.Client;
GO

CREATE TABLE dbo.Client (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CustomerName NVARCHAR(200) NOT NULL,
    Address1 NVARCHAR(200) NULL,
    Address2 NVARCHAR(200) NULL,
    Address3 NVARCHAR(200) NULL,
    Suburb NVARCHAR(100) NULL,
    State NVARCHAR(50) NULL,
    PostCode NVARCHAR(20) NULL
);

CREATE TABLE dbo.Item (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ItemCode NVARCHAR(50) NOT NULL,
    Description NVARCHAR(300) NOT NULL,
    Price DECIMAL(18,2) NOT NULL
);

CREATE TABLE dbo.SalesOrder (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL,
    CustomerName NVARCHAR(200) NULL,
    Address1 NVARCHAR(200) NULL,
    Address2 NVARCHAR(200) NULL,
    Address3 NVARCHAR(200) NULL,
    Suburb NVARCHAR(100) NULL,
    State NVARCHAR(50) NULL,
    PostCode NVARCHAR(20) NULL,
    InvoiceNo NVARCHAR(50) NULL,
    InvoiceDate DATETIME2 NOT NULL,
    ReferenceNo NVARCHAR(100) NULL,
    Note NVARCHAR(MAX) NULL,
    TotalExcl DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalTax DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalIncl DECIMAL(18,2) NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_SalesOrder_Client FOREIGN KEY (ClientId) REFERENCES dbo.Client(Id)
);

CREATE TABLE dbo.SalesOrderLine (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SalesOrderId INT NOT NULL,
    ItemId INT NOT NULL,
    ItemCode NVARCHAR(50) NULL,
    Description NVARCHAR(300) NULL,
    Note NVARCHAR(MAX) NULL,
    Quantity DECIMAL(18,2) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    TaxRate DECIMAL(18,2) NOT NULL,
    ExclAmount DECIMAL(18,2) NOT NULL,
    TaxAmount DECIMAL(18,2) NOT NULL,
    InclAmount DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_SalesOrderLine_SalesOrder FOREIGN KEY (SalesOrderId) REFERENCES dbo.SalesOrder(Id) ON DELETE CASCADE,
    CONSTRAINT FK_SalesOrderLine_Item FOREIGN KEY (ItemId) REFERENCES dbo.Item(Id)
);
GO

INSERT INTO dbo.Client (CustomerName, Address1, Address2, Address3, Suburb, State, PostCode) VALUES
('Acme Corporation', '123 Main St', 'Suite 100', '', 'Sydney', 'NSW', '2000'),
('Global Tech Ltd', '456 Tech Ave', '', '', 'Melbourne', 'VIC', '3000'),
('Sunrise Trading', '789 Commerce Rd', 'Building B', 'Floor 3', 'Brisbane', 'QLD', '4000');

INSERT INTO dbo.Item (ItemCode, Description, Price) VALUES
('ITM001', 'Laptop Computer', 1200.00),
('ITM002', 'Wireless Mouse', 45.00),
('ITM003', 'USB Keyboard', 75.00),
('ITM004', 'Monitor 27 inch', 350.00),
('ITM005', 'Office Chair', 280.00);
GO
