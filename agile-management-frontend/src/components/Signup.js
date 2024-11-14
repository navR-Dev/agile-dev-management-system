import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7f8fa;
`;

const FormCard = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 15px;
`;

const LoginLink = styled.p`
  font-size: 14px;
  margin-top: 15px;

  a {
    color: #007bff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Signup = () => {
  const { login } = useContext(AuthContext); // Get login function from AuthContext
  const navigate = useNavigate(); // To handle navigation after signup
  const [username, setUsername] = useState(""); // Store username input
  const [password, setPassword] = useState(""); // Store password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Store confirm password input
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages

  // Handle form submit for signup
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        body: JSON.stringify({ username, password }), // Send the username and password to the backend
        headers: {
          "Content-Type": "application/json", // Send data as JSON
        },
      });

      const data = await response.json(); // Parse the JSON response from the API

      // If JWT token is returned, store it and navigate to the app
      if (data.token) {
        localStorage.setItem("token", data.token); // Store the JWT token in localStorage
        login(data.token); // Set token in the AuthContext
        navigate("/"); // Redirect to the dashboard or home page after successful signup
      } else {
        setErrorMessage(data.error || "An error occurred during registration.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage("An error occurred during signup.");
    }
  };

  return (
    <FormContainer>
      <FormCard>
        <FormTitle>Sign Up</FormTitle>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <InputField type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <InputField type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <SubmitButton type="submit">Sign Up</SubmitButton>
        </form>
        <LoginLink>
          Already have an account? <a href="/login">Back to Login</a>
        </LoginLink>
      </FormCard>
    </FormContainer>
  );
};

export default Signup;
