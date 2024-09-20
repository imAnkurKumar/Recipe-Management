document.addEventListener("DOMContentLoaded", async () => {
  const recipesContainer = document.getElementById("recipes-container");
  const modal = document.getElementById("recipe-modal");
  const modalContent = document.getElementById("recipe-details");
  const closeModal = document.querySelector(".close");

  const token = localStorage.getItem("token");

  // Manage profile icon visibility
  const getStartedBtn = document.getElementById("get-started-btn");
  const profileIcon = document.getElementById("profile-icon");

  if (token) {
    getStartedBtn.style.display = "none";
    profileIcon.style.display = "block";
  } else {
    getStartedBtn.style.display = "block";
    profileIcon.style.display = "none";
  }

  try {
    const response = await axios.get("/recipes/getRecipes", {
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 200) {
      const recipes = response.data.recipes;
      recipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
            <img src="${recipe.imageUrl}" alt="${recipe.title}" />
            <h2>${recipe.title}</h2>
            <p><strong>Dietary Type:</strong> ${recipe.dietaryType}</p>
            <button class="view-recipe-btn">View Recipe</button>
          `;

        // Add event listener to the "View Recipe" button
        const viewRecipeBtn = recipeCard.querySelector(".view-recipe-btn");
        viewRecipeBtn.addEventListener("click", () => {
          openModal(recipe.id);
        });

        recipesContainer.appendChild(recipeCard);
      });
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }

  // Open modal with recipe details
  async function openModal(recipeId) {
    try {
      const response = await axios.get(`/recipes/${recipeId}`, {
        headers: {
          Authorization: token,
        },
      });
      const recipe = response.data.recipe;

      modalContent.innerHTML = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.imageUrl}" alt="${recipe.title}">
        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <p><strong>Preparation Time:</strong> ${recipe.preparationTime} mins</p>
        <p><strong>Cooking Time:</strong> ${recipe.cookingTime} mins</p>
        <p><strong>Dietary Type:</strong> ${recipe.dietaryType}</p>
      `;

      modal.style.display = "block";
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  }

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});
