import React, { useState } from "react";
import {
  
  verifySecurityAnswer,
  resetPassword,
  UserscheckEmailExists,
} from "../services/APIs";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const handleEmailSearch = async () => {
    try {
      const response = await UserscheckEmailExists(email);
      console.log("API Response:", response);

      if (
        response &&
        typeof response === "object" &&
        response.emailExists !== undefined
      ) {
        if (response.emailExists) {
          setIsEmailValid(true);
          setEmailMessage("Email verified. Please answer the security question.");
          setSecurityQuestion(response.securityQuestion || "");
        } else {
          setIsEmailValid(false);
          setEmailMessage("Email not found.");
        }
      } else {
        setEmailMessage("Unexpected response structure.");
      }
    } catch (error) {
      setEmailMessage("An error occurred while searching for the email.");
    }
  };

  const handleSecurityAnswer = async () => {
    if (!email || !securityAnswer) {
      alert("Both email and security answer are required");
      return;
    }

    try {
      const response = await verifySecurityAnswer(email, securityAnswer);
      if (response.data && response.data.correct) {
        setIsAnswerCorrect(true);
        alert("Correct security answer");
      } else {
        setIsAnswerCorrect(false);
        alert("Incorrect security answer");
      }
    } catch (error) {
      console.error("Error verifying security answer", error);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Both password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await resetPassword(email, newPassword, confirmPassword);
      if (response.data && response.data.success) {
        alert("Password reset successfully!");        
      } else {
        alert("Error resetting password");
      }
    } catch (error) {
      console.error("Error resetting password", error);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isEmailValid}  
        />
        <button onClick={handleEmailSearch} disabled={isEmailValid}>
          Search
        </button>
      </div>

      {emailMessage && <p>{emailMessage}</p>}

      {isEmailValid && (
        <div>
          <label>Security Question:</label>
          <p>{securityQuestion}</p>
          <input
            type="text"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
          <button onClick={handleSecurityAnswer}>Submit Answer</button>
        </div>
      )}

      {isAnswerCorrect && (
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
