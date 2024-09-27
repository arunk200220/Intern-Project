import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  postUserDetails,
  saveUserAsDraft,
  fetchDraftDetails,
  updateUserDetails
} from "../services/APIs";
import "./dashboard.css";

const formatDateForInput = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


const validationSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string(),
  dateOfBirth: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future")
    .test("DOB", "You must be at least 18 years old", function (value) {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= 18;
    }),
  pan: Yup.string()
    .required("PAN is required")
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]$/,
      "Invalid PAN format. Format should be ABCDE0000F"
    ),
  aadhar: Yup.string()
    .required("Aadhar is required")
    .matches(/^[0-9]{12}$/, "Aadhar must be exactly 12 digits"),
  drivingLicense: Yup.string(),
  country: Yup.string(),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be digits only")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot be more than 15 digits"),
  securityQuestion: Yup.string(),
  securityAnswer: Yup.string(),
});

const UserDashboard = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false); 

  
  const formik = useFormik({
    initialValues: {
      
      email: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      pan: "",
      aadhar: "",
      drivingLicense: "",
      country: "",
      phoneNumber: "",
      securityQuestion: "",
      securityAnswer: "",
      Status:"",
     
      
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form values before submission:", values);
      try {
        if (isEditMode) {
          
          const response = await updateUserDetails({
            ...values,
            dateOfBirth: formatDateForInput(values.dateOfBirth),
          });
          console.log("Updated data response:", response);
          setSuccessMessage("Submitted Successfully!");
        } else {
          
          const response = await postUserDetails({
            ...values,
            dateOfBirth: formatDateForInput(values.dateOfBirth),
          });
          console.log("Submitted data response:", response);
          setSuccessMessage("Registration successful!");
        }
        setErrorMessage(""); 
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrorMessage("Error submitting form. Please try again.");
        setSuccessMessage(""); 
      }
    },
  });

 
  const handleSaveAsDraft = async () => {
    try {
      const response = await saveUserAsDraft({
        ...formik.values,
        dateOfBirth: formatDateForInput(formik.values.dateOfBirth),
      });
      console.log("Saved as draft response:", response);
      setSuccessMessage("Draft saved successfully!");
      setErrorMessage(""); 
    } catch (error) {
      console.error("Error saving as draft:", error);
      setErrorMessage("Error saving draft. Please try again.");
      setSuccessMessage(""); 
    }
  };

  
  const handleEmailBlur = async () => {
    if (formik.values.email) {
      try {
        const response = await fetchDraftDetails(formik.values.email);
        console.log("Fetch draft response:", response);
        if ( response.data) {
          const formattedDate = formatDateForInput(response.data.dateOfBirth);
          formik.setValues({
            ...response.data,
            dateOfBirth: formattedDate,
          });
          setIsEditMode(true); 
          setSuccessMessage("Draft data fetched successfully!");
          setErrorMessage(""); 
        } else {
          setIsEditMode(false); 
          setErrorMessage("No draft found for the provided email.");
          setSuccessMessage(""); 
        }
      } catch (error) {
        console.error("Error fetching draft data:", error);
        setErrorMessage("No draft found for the provided email.");
        setSuccessMessage(""); 
      }
    }
  };
  

 
  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h2>{isEditMode ? "Update User Details" : "Register"}</h2>

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            onChange={formik.handleChange}
            onBlur={handleEmailBlur} 
            value={formik.values.email || ""}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-message">{formik.errors.email}</div>
          )}
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName || ""}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="error-message">{formik.errors.firstName}</div>
          )}
        </div>

        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName || ""}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="error-message">{formik.errors.lastName}</div>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dateOfBirth || ""}
            max={today}
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <div className="error-message">{formik.errors.dateOfBirth}</div>
          )}
        </div>

        <div>
          <label>PAN:</label>
          <input
            type="text"
            name="pan"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pan || ""}
          />
          {formik.touched.pan && formik.errors.pan && (
            <div className="error-message">{formik.errors.pan}</div>
          )}
        </div>

        <div>
          <label>Aadhar:</label>
          <input
            type="text"
            name="aadhar"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.aadhar || ""}
          />
          {formik.touched.aadhar && formik.errors.aadhar && (
            <div className="error-message">{formik.errors.aadhar}</div>
          )}
        </div>

        <div>
          <label>Driving License:</label>
          <input
            type="text"
            name="drivingLicense"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.drivingLicense || ""}
          />
        </div>

        <div>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.country || ""}
          />
        </div>

        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber || ""}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="error-message">{formik.errors.phoneNumber}</div>
          )}
        </div>

        <div>
          <label>Security Question:</label>
          <select
            name="securityQuestion"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.securityQuestion|| ""}
          >
            <option value="">Select a security question</option>
            <option value="What is your pet's name?">
              What is your pet's name?
            </option>
            <option value="What is your mother's maiden name?">
              What is your mother's maiden name?
            </option>
            <option value="What was your first car?">
              What was your first car?
            </option>
            <option value="What is your favorite food?">
              What is your favorite food?
            </option>
            <option value="Where were you born?">Where were you born?</option>
          </select>
          {formik.touched.securityQuestion &&
            formik.errors.securityQuestion && (
              <div className="error-message">
                {formik.errors.securityQuestion}
              </div>
            )}
        </div>

        <div>
          <label>Security Answer:</label>
          <input
            type="text"
            name="securityAnswer"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.securityAnswer || ""}
          />
          {formik.touched.securityAnswer && formik.errors.securityAnswer && (
            <div className="error-message">{formik.errors.securityAnswer}</div>
          )}
        </div>

        <div>
          {isEditMode ? (
            <button type="submit">Update</button>
          ) : (
            <button type="submit">Submit</button>
          )}
          <button type="button" onClick={handleSaveAsDraft}>
            Save as Draft
          </button>
        </div>
      </form>

      <button onClick={handleLogout}>Logout</button>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default UserDashboard;
