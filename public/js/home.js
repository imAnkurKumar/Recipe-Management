document.addEventListener("DOMContentLoaded", function () {
  const getStartedBtn = document.getElementById("get-started-btn");
  const profileIcon = document.getElementById("profile-icon");

  // Check if the user is logged in by checking the token in localStorage
  const token = localStorage.getItem("token");

  if (token) {
    // User is logged in: Show profile icon, hide "Get Started" buttons
    getStartedBtn.style.display = "none";
    profileIcon.style.display = "block";
  } else {
    // User is not logged in: Show "Get Started" buttons, hide profile icon
    getStartedBtn.style.display = "block";
    profileIcon.style.display = "none";
  }
});
