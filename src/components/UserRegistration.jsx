import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerUser, checkEmailExists } from '../services/APIs';
import './task.css';

const UserRegistration = () => {
  
  const [userId, setUserId] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      
      const emailExists = await checkEmailExists(values.email);

      if (emailExists) {
        alert('The email is already registered. Please use a different email.');
        return;
      }

      
      const response = await registerUser(values.email, values.password);
      
      
      if (response && response.userId) {
        const userId = response.userId; 
        setUserId(userId); 
      }

      console.log('User registered successfully:', values);
      alert(`Registration successful! `);
      resetForm();
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Failed to register user. Please try again.');
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
            <div>
              <label>Confirm Password:</label>
              <Field type="password" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            <button type="submit">Register</button>
          </Form>
        )}
      </Formik>

     
      {userId && (
        <div className="success-message">
          Registration successful! User ID - <strong>{userId}</strong>
        </div>
      )}
    </div>
  );
};

export default UserRegistration;
