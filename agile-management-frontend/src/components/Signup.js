import React, { useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f4f6;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  text-align: center;
`;

const FormTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #4a90e2;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #357abd;
  }
`;

const BackToLoginLink = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #4a90e2;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigate

  // State variables for each field
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State to handle form submission errors
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Call signup function from context
    signup(name, organization, username, password, confirmPassword).catch((err) => {
      setError(err.message); // Show error if signup fails
    });
  };

  const goToLogin = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <SignupContainer>
      <FormWrapper>
        <FormTitle>Sign Up</FormTitle>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <StyledInput type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <StyledInput type="text" placeholder="Organization" value={organization} onChange={(e) => setOrganization(e.target.value)} required />
          <StyledInput type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <StyledInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <StyledInput type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <StyledButton type="submit">Sign Up</StyledButton>
        </form>
        <BackToLoginLink onClick={goToLogin}>Already have an account? Login</BackToLoginLink> {/* Link to login */}
      </FormWrapper>
    </SignupContainer>
  );
};

export default Signup;
