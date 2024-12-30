using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SportTimerAppNew.Data;

var builder = WebApplication.CreateBuilder(args);

// Dodaj usługi do kontenera DI
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddSingleton<CosmosDbService>();

var app = builder.Build();

// Skonfiguruj potok HTTP
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles(); // Umożliwia serwowanie plików statycznych (HTML, CSS, JS)

app.Run();