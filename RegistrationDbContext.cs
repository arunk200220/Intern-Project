using Microsoft.EntityFrameworkCore;
using taskfinal.Models;

namespace taskfinal.Data
{
    public class RegistrationDbContext : DbContext
    {
        public RegistrationDbContext(DbContextOptions<RegistrationDbContext> options)
            : base(options)
        {
        }


        public DbSet<Register> Registers { get; set; }

        public DbSet<UserModel> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Register>().ToTable("register");
        }



    }
}
