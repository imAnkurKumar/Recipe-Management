document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const authorsGrid = document.getElementById("authors-grid");
  const getStartedBtn = document.getElementById("get-started-btn");
  const profileIcon = document.getElementById("profile-icon");
  const profileDropdown = document.getElementById("profile-dropdown");
  const logoutBtn = document.getElementById("logout-btn");
  const modal = document.getElementById("recipe-modal");
  const modalContent = document.getElementById("recipe-details");
  const closeModal = document.querySelector(".close");

  // Toggle authentication elements
  const toggleAuthElements = (isLoggedIn) => {
    getStartedBtn.style.display = isLoggedIn ? "none" : "block";
    profileIcon.style.display = isLoggedIn ? "block" : "none";
  };
  toggleAuthElements(!!token);

  // Profile dropdown toggle
  profileIcon.addEventListener("click", () => {
    profileDropdown.style.display =
      profileDropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  window.addEventListener("click", (e) => {
    if (
      !profileIcon.contains(e.target) &&
      !profileDropdown.contains(e.target)
    ) {
      profileDropdown.style.display = "none";
    }
  });

  // Fetch and display authors
  const fetchAuthors = async () => {
    try {
      const { data: authors } = await axios.get("/user/authors", {
        headers: { Authorization: token },
      });
      const authorsWithFollowStatus = await Promise.all(
        authors.map(async (author) => {
          const response = await axios.get(`/follow/status/${author.id}`, {
            headers: { Authorization: token },
          });
          return { ...author, isFollowing: response.data.isFollowing };
        })
      );
      displayAuthors(authorsWithFollowStatus);
    } catch (error) {
      handleError(error, "Error loading authors");
    }
  };

  // Display author cards
  const displayAuthors = (authors) => {
    authorsGrid.innerHTML = "";
    authors.forEach((author) => {
      const authorCard = document.createElement("div");
      authorCard.classList.add("author-card");

      authorCard.innerHTML = `
        <img src="/images/user.png" alt="${
          author.name
        }'s Profile Picture" class="author-avatar">
        <h3 class="author-name">${author.name}</h3>
        <button class="view-recipes-btn" data-author-id="${
          author.id
        }">View Recipes</button>
        <button class="follow-btn" data-author-id="${author.id}">${
        author.isFollowing ? "Unfollow" : "Follow"
      }</button>
      `;

      // Add event listeners for view recipes and follow buttons
      authorCard
        .querySelector(".view-recipes-btn")
        .addEventListener("click", () => fetchAuthorRecipes(author.id));
      authorCard
        .querySelector(".follow-btn")
        .addEventListener("click", (e) => toggleFollow(author.id, e.target));

      authorsGrid.appendChild(authorCard);
    });
  };

  const toggleFollow = async (authorId, button) => {
    try {
      const isFollowing = button.textContent === "Unfollow";
      const endpoint = isFollowing ? "/follow/unfollow/" : "/follow/follow/";
      await axios.post(
        `${endpoint}${authorId}`,
        {},
        { headers: { Authorization: token } }
      );
      button.textContent = isFollowing ? "Follow" : "Unfollow";
    } catch (error) {
      handleError(error, `Error ${button.textContent.toLowerCase()}ing author`);
    }
  };

  // Fetch and display author's recipes
  const fetchAuthorRecipes = async (authorId) => {
    try {
      const { data: recipes } = await axios.get(`/user/recipes/${authorId}`, {
        headers: { Authorization: token },
      });
      displayRecipes(recipes);
    } catch (error) {
      handleError(error, "Error fetching recipes for the author");
    }
  };

  // Display recipes in a modal
  const displayRecipes = (recipes) => {
    authorsGrid.innerHTML = "";
    const recipeSection = document.createElement("section");
    recipeSection.classList.add("recipe-section");

    const recipeGrid = document.createElement("div");
    recipeGrid.classList.add("recipe-grid");

    recipes.forEach((recipe) => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");

      recipeCard.innerHTML = `
        <img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-image">
        <div class="recipe-content">
          <h3>${recipe.title}</h3>
          <p>Dietary Type: ${recipe.dietaryType}</p>
          <button class="view-recipe-btn">View Recipe</button>
        </div>
      `;

      recipeCard
        .querySelector(".view-recipe-btn")
        .addEventListener("click", () => openModal(recipe.id));
      recipeGrid.appendChild(recipeCard);
    });

    recipeSection.appendChild(recipeGrid);
    authorsGrid.appendChild(recipeSection);
  };

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
  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Handle logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "signUp.html";
  });

  // Handle errors
  const handleError = (error, message) => {
    console.error(`${message}:`, error);
    if (error.response && error.response.status === 404) {
      console.error("Endpoint not found.");
    } else if (error.response) {
      console.error(`Server responded with status: ${error.response.status}`);
    } else {
      console.error("No response received from the server.");
    }
  };

  // Initialize fetching of authors
  await fetchAuthors();
});
