document.addEventListener("DOMContentLoaded", function () {
  const userRecipesContainer = document.getElementById(
    "user-recipes-container"
  );
  const getStartedBtn = document.getElementById("get-started-btn");
  const profileIcon = document.getElementById("profile-icon");
  const profileDropdown = document.getElementById("profile-dropdown");
  const logoutBtn = document.getElementById("logout-btn");
  const modal = document.getElementById("recipe-modal");
  const modalContent = document.getElementById("recipe-details");
  const closeModal = document.querySelector(".close");
  const token = localStorage.getItem("token");

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

  function renderRecipes(recipes) {
    userRecipesContainer.innerHTML = "";

    if (recipes.length === 0) {
      userRecipesContainer.innerHTML =
        "<p>You haven't shared any recipes yet.</p>";
      return;
    }

    recipes.forEach((recipe) => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");

      recipeCard.innerHTML = `
        <div class="recipe-image">
          <img src="${recipe.imageUrl}" alt="${recipe.title}" />
        </div>
        <div class="recipe-info">
          <h3>${recipe.title}</h3>
          <p><strong>Dietary Type:</strong> ${recipe.dietaryType}</p>
          <button class="btn view-recipe-btn" data-id="${recipe.id}">View Recipe</button>
          <button class="btn edit-recipe-btn" data-id="${recipe.id}">Edit Recipe</button>
          <button class="btn delete-recipe-btn" data-id="${recipe.id}">Delete Recipe</button>
        </div>
      `;

      // Add event listener to the "Edit Recipe" button
      recipeCard
        .querySelector(".edit-recipe-btn")
        .addEventListener("click", () => {
          window.location.href = `recipe.html?recipeId=${recipe.id}`; // Redirect to the recipe page with the recipeId
        });

      // Add event listeners to the "View Recipe" and "Delete Recipe" buttons
      recipeCard
        .querySelector(".view-recipe-btn")
        .addEventListener("click", () => {
          openModal(recipe.id);
        });

      recipeCard
        .querySelector(".delete-recipe-btn")
        .addEventListener("click", () => {
          deleteRecipe(recipe.id);
        });

      userRecipesContainer.appendChild(recipeCard);
    });
  }

  // Function to fetch and display recipe details in the modal
  async function openModal(recipeId) {
    try {
      const response = await axios.get(`/user/${recipeId}`, {
        headers: { Authorization: token },
      });

      const recipe = response.data.recipe;

      modalContent.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.imageUrl}" alt="${recipe.title}" />
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <p><strong>Preparation Time:</strong> ${recipe.preparationTime} mins</p>
            <p><strong>Cooking Time:</strong> ${recipe.cookingTime} mins</p>
            <p><strong>Dietary Type:</strong> ${recipe.dietaryType}</p>
          `;

      modal.style.display = "block";
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      modalContent.innerHTML =
        "<p>Failed to load recipe details. Please try again later.</p>";
      modal.style.display = "block";
    }
  }

  // Function to delete a recipe
  async function deleteRecipe(recipeId) {
    const confirmation = confirm(
      "Are you sure you want to delete this recipe? This action cannot be undone."
    );

    if (!confirmation) return;

    try {
      await axios.delete(`/user/${recipeId}`, {
        headers: { Authorization: token },
      });

      // Remove the recipe from the UI after successful deletion
      const recipeCard = document.querySelector(
        `.delete-recipe-btn[data-id="${recipeId}"]`
      ).parentElement.parentElement;
      userRecipesContainer.removeChild(recipeCard);

      alert("Recipe deleted successfully.");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete the recipe. Please try again later.");
    }
  }

  // Function to fetch user's recipes
  async function fetchUserRecipes() {
    try {
      if (!token) {
        userRecipesContainer.innerHTML =
          "<p>You need to be logged in to view your recipes.</p>";
        return;
      }

      const response = await axios.get("/user/recipes", {
        headers: { Authorization: token },
      });

      const { recipes } = response.data;
      renderRecipes(recipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      userRecipesContainer.innerHTML =
        "<p>Failed to load your recipes. Please try again later.</p>";
    }
  }

  // Close modal when the close button or outside modal is clicked
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "signUp.html";
  });

  fetchUserRecipes();
});
