document.addEventListener("DOMContentLoaded", function () {
  const getStartedBtn = document.getElementById("get-started-btn");
  const profileIcon = document.getElementById("profile-icon");
  const ctaSection = document.getElementById("cta-section");
  const profileDropdown = document.getElementById("profile-dropdown");

  // Check if the user is logged in by checking the token in localStorage
  const token = localStorage.getItem("token");

  if (token) {
    getStartedBtn.style.display = "none";
    profileIcon.style.display = "block";
    ctaSection.style.display = "none";
  } else {
    getStartedBtn.style.display = "block";
    profileIcon.style.display = "none";
    ctaSection.style.display = "block";
  }

  profileIcon.addEventListener("click", function () {
    if (profileDropdown.style.display === "block") {
      profileDropdown.style.display = "none";
    } else {
      profileDropdown.style.display = "block";
    }
  });

  window.addEventListener("click", function (e) {
    if (
      !profileIcon.contains(e.target) &&
      !profileDropdown.contains(e.target)
    ) {
      profileDropdown.style.display = "none";
    }
  });
});
