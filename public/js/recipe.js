document.addEventListener("DOMContentLoaded", () => {
  const recipeForm = document.getElementById("recipe-form");

  const token = localStorage.getItem("token");
  recipeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(recipeForm);
    const title = formData.get("title");
    const ingredients = formData.get("ingredients");
    const instructions = formData.get("instructions");
    const preparationTime = formData.get("preparationTime");
    const cookingTime = formData.get("cookingTime");
    const imageFile = formData.get("image");

    try {
      const recipeData = new FormData();
      recipeData.append("title", title);
      recipeData.append("ingredients", ingredients);
      recipeData.append("instructions", instructions);
      recipeData.append("preparationTime", preparationTime);
      recipeData.append("cookingTime", cookingTime);
      recipeData.append("image", imageFile);

      const response = await axios.post("/recipes/upload-file", recipeData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Recipe shared successfully!");
        // Optionally, reset the form or redirect
        recipeForm.reset();
      }
    } catch (error) {
      console.error("Error sharing recipe:", error);
      alert("Failed to share the recipe. Please try again later.");
    }
  });
});
