--create database logicStudio
use logicStudio
-- creacion esquema
--CREATE SCHEMA lgs
--producto
create table [lgs].[Producto]
(Producto_Id INT PRIMARY KEY IDENTITY,
Producto_Nombre varchar(50) not null,
Producto_Descripcion varchar(50) not null,
Producto_Categoria varchar(50) not null,
Producto_Imagen varchar(max) not null,
Producto_Precio decimal(10,2) not null,
Producto_Stock int not null
)

--transaccion
create table [lgs].[Transaccion]
(
Transaccion_Id int primary key identity,
Transaccion_Fecha datetime not null,
Transaccion_Tipo varchar(10) not null,
Producto_Id int not null,
Cantidad int not null,
Precio_Unitario decimal(10,2) not null,
Precio_Total decimal(10,2) not null,
Transaccion_Detalle varchar(max) not null,
foreign key(Producto_Id) references [lgs].[Producto](Producto_Id),
)