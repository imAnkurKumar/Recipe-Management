document.addEventListener("DOMContentLoaded", async () => {
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

  // Render favorite recipes
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
            <button class="btn remove-recipe-btn" data-id="${recipe.id}">Remove from Favorites</button>
          </div>
        `;

      recipeCard
        .querySelector(".view-recipe-btn")
        .addEventListener("click", () => {
          openModal(recipe.id);
        });

      // Add event listener for removing from favorites
      recipeCard
        .querySelector(".remove-recipe-btn")
        .addEventListener("click", () => {
          removeFromFavorite(recipe.id);
        });

      userRecipesContainer.appendChild(recipeCard);
    });
  }

  // Open modal with detailed recipe information
  async function openModal(recipeId) {
    try {
      const response = await axios.get(`/recipes/${recipeId}`, {
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

  // Fetch favorite recipes and handle response
  async function fetchFavoriteRecipe() {
    try {
      if (!token) {
        userRecipesContainer.innerHTML =
          "<p>You need to be logged in to view your recipes.</p>";
        return;
      }

      const response = await axios.get("/favorite/getRecipe", {
        headers: {
          Authorization: token,
        },
      });
      const favRecipe = response.data.favoriteRecipes;

      renderRecipes(favRecipe);
    } catch (err) {
      console.log("Error fetching favorite recipes:", err);
      userRecipesContainer.innerHTML =
        "<p>Error loading your favorite recipes. Please try again later.</p>";
    }
  }

  // Remove recipe from favorite list
  async function removeFromFavorite(recipeId) {
    try {
      const response = await axios.post(
        "/favorite/remove",
        { recipeId },
        {
          headers: { Authorization: token },
        }
      );

      alert(response.data.message);

      // Fetch updated list of favorite recipes
      fetchFavoriteRecipe();
    } catch (err) {
      console.error("Error removing recipe from favorites:", err);
    }
  }

  // Modal close behavior
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
  fetchFavoriteRecipe();
});
