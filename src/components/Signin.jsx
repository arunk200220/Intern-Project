import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom"; 
import { loginUser } from "../services/APIs";
import "./task.css";

const SignIn = () => {
  const navigate = useNavigate(); 
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
  });

  const handleSignIn = async (values, { resetForm }) => {
    console.log("User logged in successfully:", values);
    try {
    
      const loginResponse = await loginUser(values.email, values.password);
      const data = await loginResponse.json(); 

      if (loginResponse.status === 401) {
        
        alert(
          "Invalid email or password. Please check your credentials and try again."
        );
      } else if (loginResponse.ok) {
        
        alert("Login successful!");

        if (data.isAdmin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
        resetForm();
      } else {
        
        alert("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
     
      console.error("Error during sign-in:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSignIn}
      >
        {() => (
          <Form>
            <div>
              <label>Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div>
              <label>Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <button type="submit">Sign In</button>
          </Form>
        )}
      </Formik>
      <div>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default SignIn;
