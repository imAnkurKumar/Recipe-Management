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
      console.log("recipes >>> :", recipes);
      recipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
          <img src="${recipe.imageUrl}" alt="${recipe.title}" />
          <button class="favorite-btn" data-recipe-id="${recipe.id}">
          &#9734;</button>
          <h2>${recipe.title}</h2>
          <p><strong>Dietary Type:</strong> ${recipe.dietaryType}</p>
          <p class="recipe-rating">
            <strong>Rating:</strong> <span class="average-rating">${recipe.averageRating}</span> / 5
          </p>
          <button class="view-recipe-btn">View Recipe</button>
        `;

        const viewRecipeBtn = recipeCard.querySelector(".view-recipe-btn");
        viewRecipeBtn.addEventListener("click", () => {
          openModal(recipe.id);
        });

        const favoriteBtn = recipeCard.querySelector(".favorite-btn");
        favoriteBtn.addEventListener("click", () => {
          toggleFavorite(recipe.id, favoriteBtn);
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
        <div class="rating-section">
          <h3>Rate this recipe:</h3>
          <div class="rating-input">
            <input type="radio" name="rating" value="1" id="rate-1"><label for="rate-1">1</label>
            <input type="radio" name="rating" value="2" id="rate-2"><label for="rate-2">2</label>
            <input type="radio" name="rating" value="3" id="rate-3"><label for="rate-3">3</label>
            <input type="radio" name="rating" value="4" id="rate-4"><label for="rate-4">4</label>
            <input type="radio" name="rating" value="5" id="rate-5"><label for="rate-5">5</label>
          </div>
          <button class="submit-rating-btn">Submit Rating</button>
        </div>
      `;

      modal.style.display = "block";
      const ratingButtons = modalContent.querySelectorAll(
        'input[name="rating"]'
      );
      const submitRatingBtn = modalContent.querySelector(".submit-rating-btn");

      submitRatingBtn.addEventListener("click", async () => {
        const selectedRating = Array.from(ratingButtons).find(
          (btn) => btn.checked
        )?.value;
        if (selectedRating) {
          try {
            const response = await axios.post(
              `/rating/${recipeId}/rate`,
              { ratingValue: selectedRating },
              { headers: { Authorization: token } }
            );
            alert(
              "Rating submitted! Average rating: " + response.data.averageRating
            );
            modal.style.display = "none";
            location.reload(); // Refresh to show updated rating
          } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Failed to submit rating.");
          }
        } else {
          alert("Please select a rating.");
        }
      });
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

  // Toggle favorite status of the recipe
  async function toggleFavorite(recipeId, button) {
    try {
      const response = await axios.post(
        "/favorite/add",
        { recipeId },
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        button.classList.toggle("active");
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  }
});
