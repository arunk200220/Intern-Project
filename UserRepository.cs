using Microsoft.EntityFrameworkCore;
using taskfinal.Data;
using taskfinal.Models;

namespace taskfinal.Repositories
{

    public class UserRepository : IUserRepository
    {
        private readonly RegistrationDbContext _context;
        private readonly IConfiguration _configuration;
        public UserRepository(RegistrationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        //Read
        public async Task<bool> CheckEmailExists(string email)
        {
            return await _context.Registers.AnyAsync(u => u.Email == email);
        }
        //Create
        public async Task<Register> RegisterUser(Register model)
        {
            await _context.Registers.AddAsync(model);
            await _context.SaveChangesAsync();
            return model;
        }
        //Read
        public async Task<LoginModel> Login(LoginModel model)
        {
            var user = await _context.Registers.SingleOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);
            if (user == null)
                return null;


            return new LoginModel { IsAdmin = user.IsAdmin, Id = user.Id };

        }
        //Create
        public async Task<UserModel> RegisterUserAsync(UserModel userModel)
        {

            await _context.Users.AddAsync(userModel);


            await _context.SaveChangesAsync();


            return userModel;
        }
        //Read
        public async Task<List<UserModel>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }
        //Update
        public async Task<bool> UpdateUserStatus(UserModel user)
        {
            var existingUser = await _context.Users.FindAsync(user.Id);
            if (existingUser == null) return false;

            existingUser.Status = user.Status;
            await _context.SaveChangesAsync();
            return true;
        }
        //Read
        public async Task<(bool emailExists, string securityQuestion)> CheckEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            return (user != null, user?.securityQuestion);
        }
        //Read
        public async Task<bool> VerifySecurityAnswer(string email, string securityAnswer)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.securityanswer == securityAnswer);
            return user != null;
        }
        //Update
        public async Task<bool> ResetPassword(Register request)
        {
            var user = await _context.Registers.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) return false;

            user.Password = request.Password;
            user.ConfirmPassword = request.ConfirmPassword;
            await _context.SaveChangesAsync();
            return true;
        }
        //Read
        public async Task<UserModel> GetDraftDataByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsDraft);
        }
        //Create
        public async Task<UserModel> SaveDraft(UserModel draftUser)
        {

            await _context.Users.AddAsync(draftUser);
            await _context.SaveChangesAsync();
            return draftUser;
        }
        //Update
        public async Task<UserModel> UpdateUser(UserModel userModel)
        {
            var existingUser = await _context.Users.FindAsync(userModel.Id);
            if (existingUser == null) return null;


            existingUser.FirstName = userModel.FirstName;
            existingUser.LastName = userModel.LastName;
            existingUser.Email = userModel.Email;
            existingUser.DateOfBirth = userModel.DateOfBirth;
            existingUser.Pan = userModel.Pan;
            existingUser.Aadhar = userModel.Aadhar;
            existingUser.DrivingLicense = userModel.DrivingLicense;
            existingUser.Country = userModel.Country;
            existingUser.securityQuestion = userModel.securityQuestion;
            existingUser.securityanswer = userModel.securityanswer;

            await _context.SaveChangesAsync();
            return existingUser;
        }
    }

}
