using taskfinal.Models;
using taskfinal.Repositories;

namespace taskfinal.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }



        public async Task<bool> CheckEmailExists(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty.");



            return await _userRepository.CheckEmailExists(email);
        }


        public async Task<Register> RegisterUser(Register user)
        {
            if (string.IsNullOrWhiteSpace(user.Email))
                throw new ArgumentException("Email is required.");


            if (await _userRepository.CheckEmailExists(user.Email))
                throw new InvalidOperationException("Email already exists.");


            if (user.Password != user.ConfirmPassword)
                throw new ArgumentException("Password and Confirm Password do not match.");

            return await _userRepository.RegisterUser(user);
        }


        public async Task<LoginModel> Login(LoginModel model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
                throw new ArgumentException("Email and password are required.");



            var user = await _userRepository.Login(model);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");

            return user;
        }


        public async Task<UserModel> RegisterUserAsync(UserModel userModel)
        {
            if (string.IsNullOrWhiteSpace(userModel.Email))
                throw new ArgumentException("Email is required.");

           
            return await _userRepository.RegisterUserAsync(userModel);
        }



        public Task<List<UserModel>> GetAllUsers()
        {
            return _userRepository.GetAllUsers();
        }


        public async Task<bool> UpdateUserStatus(UserModel user)
        {
            if (user == null || string.IsNullOrWhiteSpace(user.Status))
                throw new ArgumentException("User ID and Status are required.");

            return await _userRepository.UpdateUserStatus(user);
        }


        public Task<(bool emailExists, string securityQuestion)> CheckEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty.");


            return _userRepository.CheckEmailAsync(email);
        }


        public async Task<bool> VerifySecurityAnswer(string email, string securityAnswer)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(securityAnswer))
                throw new ArgumentException("Email and security answer are required.");

            return await _userRepository.VerifySecurityAnswer(email, securityAnswer);
        }


        public async Task<bool> ResetPassword(Register request)
        {
            if (string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.ConfirmPassword))
                throw new ArgumentException("Password and Confirm Password are required.");

            if (request.Password != request.ConfirmPassword)
                throw new ArgumentException("Password and Confirm Password do not match.");



            return await _userRepository.ResetPassword(request);
        }


        public async Task<UserModel> GetDraftDataByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty.");

            return await _userRepository.GetDraftDataByEmail(email);
        }


        public Task<UserModel> SaveDraft(UserModel draftUser)
        {
            draftUser.IsDraft = true;
            return _userRepository.SaveDraft(draftUser);
        }


        public async Task<UserModel> UpdateUser(UserModel userModel)
        {
            if (string.IsNullOrWhiteSpace(userModel.Email))
                throw new ArgumentException("Email is required.");


            return await _userRepository.UpdateUser(userModel);
        }




    }
}


