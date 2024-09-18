document.addEventListener("DOMContentLoaded", async () => {
  const recipesContainer = document.getElementById("recipes-container");

  const token = localStorage.getItem("token");
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
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Preparation Time:</strong> ${recipe.preparationTime} mins</p>
            <p><strong>Cooking Time:</strong> ${recipe.cookingTime} mins</p>
          `;

        recipesContainer.appendChild(recipeCard);
      });
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
});
