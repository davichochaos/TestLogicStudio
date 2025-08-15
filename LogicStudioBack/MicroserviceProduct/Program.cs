using MicroserviceProduct.Models;
using MicroserviceProduct.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IProductsService, ProductsService>();
builder.Services.AddControllers();
builder.Services.AddDbContext<logicStudioContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("SQLConnectionString"));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
});

app.MapControllers();
// Configure the HTTP request pipeline.

app.Run();