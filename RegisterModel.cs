using System.ComponentModel.DataAnnotations;

namespace taskfinal.Models
{
    public class Register
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = "Passwords must match")]
        public string ConfirmPassword { get; set; }
        [Required]
        public bool IsAdmin { get; set; }


    }

}
public class LoginModel
{
    [Key]
    public int Id { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
    public bool IsAdmin { get; internal set; }
}
public class UserModel
{
    [Key]
    public int Id { get; set; }
    public string Email { get; set; }

    public string FirstName { get; set; }


    public string LastName { get; set; }


    public DateTime DateOfBirth { get; set; }


    public string Pan { get; set; }


    public string Aadhar { get; set; }


    public string DrivingLicense { get; set; }


    public string Country { get; set; }


    public string PhoneNumber { get; set; }

    public bool IsDraft { get; set; }
    public string Status { get; set; }
    public string securityQuestion { get; set; }
    public string securityanswer { get; set; }

}
