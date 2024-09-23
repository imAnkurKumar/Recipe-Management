document.addEventListener("DOMContentLoaded", function () {
  const getStartedBtn = document.getElementById("get-started-btn");
  const profileIcon = document.getElementById("profile-icon");
  const ctaSection = document.getElementById("cta-section");
  const profileDropdown = document.getElementById("profile-dropdown");
  const searchForm = document.getElementById("search-form");

  const modal = document.getElementById("recipe-modal");
  const modalContent = document.getElementById("recipe-details");
  const closeModal = document.querySelector(".close");
  const heroSection = document.getElementById("hero-section");

  const token = localStorage.getItem("token");

  let query;
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

  searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    query = document.getElementById("search-input").value;

    try {
      const response = await axios.get(`/home/search?query=${query}`);

      if (response.status === 200) {
        const recipes = response.data;
        displaySearchResults(recipes);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      alert("No recipes found. Please try again.");
    }
  });

  function displaySearchResults(recipes) {
    heroSection.innerHTML = "";

    // Add a heading for the search results
    const resultsHeading = document.createElement("h2");
    resultsHeading.classList.add("results-heading");
    resultsHeading.textContent = "Discover Delicious Recipes";
    heroSection.appendChild(resultsHeading);

    // Create a container for the search result cards
    const searchResultsDiv = document.createElement("div");
    searchResultsDiv.classList.add("search-results-container");

    // Check if no recipes are found
    if (recipes.length === 0) {
      const noResults = document.createElement("p");
      noResults.classList.add("no-results");
      noResults.textContent =
        "No recipes found. Please try a different search term.";
      heroSection.appendChild(noResults);
    } else {
      // Loop through each recipe and create a card for it
      recipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
          <img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-image">
          <div class="recipe-details">
            <h3 class="recipe-title">${recipe.title}</h3>
            <p class="recipe-dietary-type">Dietary Type: ${recipe.dietaryType}</p>
            <button class="view-recipe-btn" data-id="${recipe.id}">View Recipe</button>
          </div>
        `;

        searchResultsDiv.appendChild(recipeCard);
      });

      // Append the result cards container to the hero section
      heroSection.appendChild(searchResultsDiv);
    }
  }

  heroSection.addEventListener("click", async function (e) {
    if (e.target.classList.contains("view-recipe-btn")) {
      const recipeId = e.target.getAttribute("data-id");
      console.log(recipeId); // Check if recipeId is being retrieved correctly

      if (recipeId) {
        try {
          const response = await axios.get(`/recipes/${recipeId}`, {
            headers: {
              Authorization: token,
            },
          });

          const recipe = response.data.recipe;
          console.log("recipe >>: ", recipe);
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
          alert("Failed to load recipe details.");
        }
      } else {
        console.error("Recipe ID is undefined.");
      }
    }
  });

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});
