document.addEventListener("DOMContentLoaded", () => {
  const recipeForm = document.getElementById("recipe-form");
  const getStartedBtn = document.getElementById("get-started-btn");
  const profileIcon = document.getElementById("profile-icon");

  const token = localStorage.getItem("token");

  // Check if user is logged in
  if (token) {
    getStartedBtn.style.display = "none";
    profileIcon.style.display = "block";
  } else {
    getStartedBtn.style.display = "block";
    profileIcon.style.display = "none";
  }

  recipeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!token) {
      alert("Please log in to share a recipe.");
      return;
    }

    const formData = new FormData(recipeForm);

    try {
      const response = await axios.post("/recipes/upload-file", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Recipe shared successfully!");
        recipeForm.reset();
      }
    } catch (error) {
      console.error("Error sharing recipe:", error);
      if (error.response) {
        alert(`Failed to share the recipe: ${error.response.data.message}`);
      } else {
        alert("Failed to share the recipe. Please try again later.");
      }
    }
  });
});
