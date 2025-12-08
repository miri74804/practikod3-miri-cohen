using TodoApi;
using Microsoft.EntityFrameworkCore; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings:ToDoDB") 
                       ?? builder.Configuration.GetConnectionString("ToDoDB");

builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

var app = builder.Build();

// if (app.Environment.IsDevelopment())
// {
    app.UseSwagger();
    app.UseSwaggerUI();
// }

app.UseCors("AllowAll");

app.MapGet("/",()=>{});

// שליפת כל המשימות
app.MapGet("/items", async (ToDoDbContext db) =>
{
    return await db.Items.ToListAsync();
});

// הוספת משימה חדשה
app.MapPost("/items", async (ToDoDbContext db, Item item) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{item.Id}", item);
});

// עדכון משימה
app.MapPut("/items/{id}", async (ToDoDbContext db, int id, Item updatedItem) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null) return Results.NotFound();

    item.IsComplete = updatedItem.IsComplete;
    await db.SaveChangesAsync();

    return Results.NoContent();
});

// מחיקת משימה
app.MapDelete("/items/{id}", async (ToDoDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null) return Results.NotFound();

    db.Items.Remove(item);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();