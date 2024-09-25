document.addEventListener("DOMContentLoaded", () => {
  const recipeForm = document.getElementById("recipe-form");
  const getStartedBtn = document.getElementById("get-started-btn");
  const profileIcon = document.getElementById("profile-icon");
  const profileDropdown = document.getElementById("profile-dropdown");
  const logoutBtn = document.getElementById("logout-btn");
  const token = localStorage.getItem("token");

  // Check if user is logged in
  if (token) {
    getStartedBtn.style.display = "none";
    profileIcon.style.display = "block";
  } else {
    getStartedBtn.style.display = "block";
    profileIcon.style.display = "none";
  }

  profileIcon.addEventListener("click", function () {
    profileDropdown.style.display =
      profileDropdown.style.display === "block" ? "none" : "block";
  });

  window.addEventListener("click", function (e) {
    if (
      !profileIcon.contains(e.target) &&
      !profileDropdown.contains(e.target)
    ) {
      profileDropdown.style.display = "none";
    }
  });

  // Get the recipeId from the URL if it exists
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("recipeId");

  // If there is a recipeId, fetch the recipe data and populate the form
  if (recipeId) {
    fetchRecipeDetails(recipeId);
  }

  // Fetch recipe details for editing
  async function fetchRecipeDetails(recipeId) {
    try {
      const response = await axios.get(`/user/${recipeId}`, {
        headers: { Authorization: token },
      });

      const recipe = response.data.recipe;

      // Populate the form with the existing recipe data
      document.getElementById("title").value = recipe.title;
      document.getElementById("ingredients").value = recipe.ingredients;
      document.getElementById("instructions").value = recipe.instructions;
      document.getElementById("preparationTime").value = recipe.preparationTime;
      document.getElementById("cookingTime").value = recipe.cookingTime;
      document.getElementById("dietaryType").value = recipe.dietaryType;
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      alert("Failed to load the recipe. Please try again.");
    }
  }

  // Handle form submission for both create and update
  recipeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!token) {
      alert("Please log in to share or update a recipe.");
      return;
    }

    const formData = new FormData(recipeForm);

    try {
      let response;

      if (recipeId) {
        // If editing, send an update request
        response = await axios.put(`/user/edit/${recipeId}`, formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Recipe updated successfully!");
      } else {
        // If creating a new recipe
        response = await axios.post("/recipes/upload-file", formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Recipe shared successfully!");
      }

      recipeForm.reset();
      window.location.href = "userRecipes.html";
    } catch (error) {
      console.error("Error sharing/updating recipe:", error);
      if (error.response) {
        alert(`Failed to submit the recipe: ${error.response.data.message}`);
      } else {
        alert("Failed to submit the recipe. Please try again later.");
      }
    }
  });

  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "signUp.html";
  });
});
