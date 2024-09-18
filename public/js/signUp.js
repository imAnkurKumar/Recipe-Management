document.addEventListener("DOMContentLoaded", function () {
  const signupContainer = document.getElementById("signup-container");
  const loginContainer = document.getElementById("login-container");

  // Toggle from Signup to Login
  document.getElementById("to-login").addEventListener("click", function (e) {
    e.preventDefault();
    signupContainer.style.display = "none";
    loginContainer.style.display = "block";
  });

  // Toggle from Login to Signup
  document.getElementById("to-signup").addEventListener("click", function (e) {
    e.preventDefault();
    loginContainer.style.display = "none";
    signupContainer.style.display = "block";
  });

  document
    .getElementById("signup-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      try {
        const name = document.getElementById("signup-username").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

        if (name && email && password) {
          const response = await axios.post("/user/sign-up", {
            name,
            email,
            password,
          });

          if (response.status === 201) {
            alert("Sign-up successful! Redirecting to login...");
            document.getElementById("signup-username").value = "";
            document.getElementById("signup-email").value = "";
            document.getElementById("signup-password").value = "";

            loginContainer.style.display = "block";
            signupContainer.style.display = "none";
          }
        } else {
          alert("Please fill in all fields.");
        }
      } catch (error) {
        if (error.response) {
          alert("Sign-up error: " + error.response.data.message);
        } else {
          console.error("Sign-up error:", error);
          alert("Sign-up failed. Please try again.");
        }
      }
    });

  document
    .getElementById("login-form")
    .addEventListener("submit", async function (e) {
      try {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        if (email && password) {
          const response = await axios.post("/user/sign-in", {
            email,
            password,
          });

          if (response.status === 200) {
            alert("Login successful! Redirecting to homepage...");
            localStorage.setItem("token", response.data.token);
            document.getElementById("login-email").value = "";
            document.getElementById("login-password").value = "";

            window.location.href = "home.html"; // Replace with the actual homepage route
          }
        } else {
          alert("Please fill in all fields.");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404 || error.response.status === 401) {
            alert("Error: " + error.response.data.message);
          } else {
            alert("Error: " + error.response.data.message);
          }
        } else {
          console.error("Login error:", error);
          alert("Login error: Please try again.");
        }
      }
    });
});
