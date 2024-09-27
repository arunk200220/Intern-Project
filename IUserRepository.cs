using taskfinal.Models;

namespace taskfinal.Repositories
{
    public interface IUserRepository
    {
        Task<bool> CheckEmailExists(string email);
        Task<Register> RegisterUser(Register user);
        Task<LoginModel> Login(LoginModel model);
        Task<UserModel> RegisterUserAsync(UserModel userModel);
        Task<List<UserModel>> GetAllUsers();
        Task<bool> UpdateUserStatus(UserModel user);
        Task<(bool emailExists, string securityQuestion)> CheckEmailAsync(string email);
        Task<bool> VerifySecurityAnswer(string email, string securityAnswer);
        Task<bool> ResetPassword(Register request);
        Task<UserModel> GetDraftDataByEmail(string email);
        Task<UserModel> UpdateUser(UserModel userModel);
        Task<UserModel> SaveDraft(UserModel draftUser);
    }
}
