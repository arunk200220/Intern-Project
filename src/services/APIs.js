import axios from "axios";

const API_BASE_URL = "https://localhost:7032/api/UserRegistration";

export const checkEmailExists = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/checkEmail`, {
      params: { email },
    });

    return response.data.exists;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
};

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(
      "https://localhost:7032/api/UserRegistration",
      {
        email,
        password,
        confirmPassword: password,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  const response = await fetch(
    "https://localhost:7032/api/UserRegistration/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );
  return response;
};

export const postUserDetails = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting user details:", error);
    throw error;
  }
};

export const saveUserAsDraft = async (values) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/draft`, values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving user as draft:", error);
    throw error;
  }
};

export const getUserDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/allUsers`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user details");
  }
};

export const updateUserStatus = async (payload) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/updateStatus`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const resetPassword = async (email, password, confirmPassword) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/reset-password`, {
      email,
      Password: password,
      ConfirmPassword: confirmPassword,
    });
    if (response.data.success) {
      console.log("Password reset successful:", response.data.message);
      return response;
    } else {
      console.error("Password reset failed:", response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error resetting password", error);
    throw error;
  }
};

export const verifySecurityAnswer = async (email, securityAnswer) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/verifySecurityAnswer`, {
      params: {
        email,
        securityanswer: securityAnswer,
      },
    });
    return response;
  } catch (error) {
    console.error("Error verifying security answer", error);
    throw error;
  }
};

export const fetchDraftDetails = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetDraftData/email`, {
      params: { email },
    });
    return response;
  } catch (error) {
    console.error("Error fetching draft details:", error);
    throw error;
  }
};

export const UserscheckEmailExists = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/checkEmailusers`, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
};

export const updateUserDetails = async (user) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateuser`, user);
    return response.data;
  } catch (error) {
    throw new Error("Error updating user details: " + error.message);
  }
};
