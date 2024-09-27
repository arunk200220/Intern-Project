using Microsoft.AspNetCore.Mvc;
using taskfinal.Models;
using taskfinal.Services;

namespace taskfinal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRegistrationController : ControllerBase
    {
        private readonly IUserService _userService;


        public UserRegistrationController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;


        }

        [HttpGet("checkEmail")]
        public async Task<IActionResult> CheckEmailExists(string email)
        {
            try
            {
                bool emailExists = await _userService.CheckEmailExists(email);
                return Ok(new { exists = emailExists });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while checking email existence." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var user = await _userService.RegisterUser(model);
                return Ok(new { message = "User registered successfully", userId = user.Id });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while registering the user." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
                return BadRequest("Email and password are required.");

            try
            {
                var user = await _userService.Login(model);
                if (user == null)
                    return Unauthorized(new { message = "Invalid email or password." });

                bool isAdmin = user.IsAdmin;

                return Ok(new { message = "Login successful.", IsAdmin = isAdmin });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred during login." });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserModel userModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var registeredUser = await _userService.RegisterUserAsync(userModel);
                return Ok(new { message = "submitted successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        [HttpPost("draft")]
        public async Task<IActionResult> SaveAsDraft([FromBody] UserModel draftUser)
        {
            try
            {
                var draft = await _userService.SaveDraft(draftUser);
                return Ok(new { message = "Draft saved successfully" });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while saving the draft." });
            }
        }

        [HttpGet("allUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while fetching users." });
            }
        }

        [HttpPatch("updateStatus")]
        public async Task<IActionResult> UpdateStatus([FromBody] UserModel user)
        {
            if (user == null || user.Id <= 0 || string.IsNullOrWhiteSpace(user.Status))
                return BadRequest("User ID and status are required.");

            try
            {
                var success = await _userService.UpdateUserStatus(user);
                if (!success) return NotFound("User not found.");

                return Ok(new { message = "User status updated successfully." });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while updating user status." });
            }
        }
        [HttpGet("checkEmailusers")]
        public async Task<IActionResult> CheckEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            try
            {
                var (emailExists, securityQuestion) = await _userService.CheckEmailAsync(email);

                if (emailExists)
                {
                    return Ok(new
                    {
                        EmailExists = true,
                        SecurityQuestion = securityQuestion
                    });
                }

                return Ok(new { EmailExists = false });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpGet("verifySecurityAnswer")]
        public async Task<IActionResult> VerifySecurityAnswer([FromQuery] string email, [FromQuery] string securityAnswer)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(securityAnswer))
                return BadRequest("Email and security answer are required.");

            try
            {
                var correct = await _userService.VerifySecurityAnswer(email, securityAnswer);
                return Ok(new { correct });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while verifying security answer." });
            }
        }

        [HttpPatch("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] Register request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var success = await _userService.ResetPassword(request);
                if (!success) return NotFound("User not found.");

                return Ok(new { Success = true, message = "Password updated successfully" });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while resetting the password." });
            }
        }

        [HttpGet("GetDraftData/email")]
        public async Task<IActionResult> GetDraftData(string email)
        {
            try
            {
                var draft = await _userService.GetDraftDataByEmail(email);
                if (draft == null)
                    return NotFound(new { message = "No draft found for the given email." });

                return Ok(draft);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while fetching draft data." });
            }
        }

        [HttpPut("updateuser")]
        public async Task<IActionResult> UpdateUser([FromBody] UserModel usermodel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var updatedUser = await _userService.UpdateUser(usermodel);
                if (updatedUser == null) return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while updating the user." });
            }
        }
    }
}
