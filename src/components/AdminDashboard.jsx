import React, { useState, useEffect } from "react";
import { getUserDetails, updateUserStatus } from "../services/APIs"; // Import the API functions
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(""); 
  
  const handleGetUserDetails = async () => {
    setLoading(true);
    setError(null); 

    try {
      const data = await getUserDetails(); 
      setUsers(data); 
      setFilteredUsers(data); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    let filtered = users;

    
    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase()) ||
          user.pan.toLowerCase().includes(search.toLowerCase()) ||
          user.aadhar.toLowerCase().includes(search.toLowerCase()) ||
          user.country.toLowerCase().includes(search.toLowerCase())
      );
    }

    
    if (filter) {
      filtered = filtered.filter((user) => user.status === filter);
    }

    setFilteredUsers(filtered);
  }, [search, filter, users]);

  
  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus({
        Id: userId,
        Status: newStatus,
        Pan: "", 
        Aadhar: "", 
        Country: "", 
        LastName: "", 
        FirstName: "", 
        PhoneNumber: "", 
        DrivingLicense: "", 
        SecurityAnswer: "", 
        SecurityQuestion: "",
        Email:"",
      });

      setFilteredUsers(
        filteredUsers.map((u) =>
          u.id === userId ? { ...u, status: newStatus } : u
        )
      );
    } catch (err) {
      setError(err.message); 
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome! Admin Dashboard</h2>
      <button
        onClick={handleGetUserDetails}
        style={{ padding: "10px 20px", fontSize: "16px", marginBottom: "20px" }}
      >
        Get User Details
      </button>
      
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", fontSize: "16px", marginRight: "10px" }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "8px", fontSize: "16px" }}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Submitted">Submitted</option>
          <option value="Verified">Verified</option>
        </select>
      </div>
      {loading && <p>Loading...</p>} 
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      
      {filteredUsers.length > 0 && (
        <table
          style={{
            marginTop: "20px",
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd", 
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f4f4f4",
                borderBottom: "2px solid #ddd",
              }}
            >
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                User ID
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Firstname
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Lastname
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Date of Birth
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>PAN</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Aadhar
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Driving License
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Country
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Phone Number
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.firstName}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.lastName}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.dateOfBirth}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.pan}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.aadhar}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.drivingLicense}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.country}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.phoneNumber}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <select
                    value={user.status || "Select"} 
                    onChange={(e) =>
                      handleStatusChange(user.id, e.target.value.toString())
                    }
                    style={{ width: "100%", padding: "5px" }}
                  >
                    <option value="">Select</option>
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Verified">Verified</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
