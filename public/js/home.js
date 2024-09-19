document.addEventListener("DOMContentLoaded", function () {
  const getStartedBtn = document.getElementById("get-started-btn");
  const profileIcon = document.getElementById("profile-icon");
  const ctaSection = document.getElementById("cta-section");

  // Check if the user is logged in by checking the token in localStorage
  const token = localStorage.getItem("token");

  if (token) {
    // User is logged in: Show profile icon, hide "Get Started" button and CTA section
    getStartedBtn.style.display = "none";
    profileIcon.style.display = "block";
    ctaSection.style.display = "none";
  } else {
    // User is not logged in: Show "Get Started" button and CTA section, hide profile icon
    getStartedBtn.style.display = "block";
    profileIcon.style.display = "none";
    ctaSection.style.display = "block";
  }
});
