const recipeContainer = document.getElementById("recipesContainer");
const modal = document.getElementById("recipeModal");
const modalDetails = document.getElementById("modalDetails");
const closeButton = document.querySelector(".close-button");

let allRecipes = [];

async function getData() {
  const response = await fetch("/assets/data/recette.json");
  const { recipes } = await response.json();
  return recipes;
}

async function init() {
  try {
    allRecipes = await getData();
    render(allRecipes);
    searchBar();
    setupModalEvents();
  } catch (e) {
    console.error(e);
  }
}

function render(array) {
  recipeContainer.innerHTML = "";
  array.forEach((recipe) => {
    const article = document.createElement("article");
    article.className = "recipe-card";
    article.innerHTML = `
      <h2>${recipe.name}</h2>
      <p><strong>Nombre de personnes :</strong> ${recipe.servings}</p>
      <ul>  
      ${recipe.ingredients.map((e) => `<li>${e.ingredient}</li>`).join("")}
      </ul>
      <p class="details">Cliquez pour voir les détails</p>
    `;
    // On ajoute l'événement de clic sur chaque carte
    article.addEventListener("click", () => openModal(recipe));
    recipeContainer.appendChild(article);
  });
}

function openModal(recipe) {
  modalDetails.innerHTML = `
    <h2 class="modal-title">${recipe.name}</h2>
    <p><strong>Appareil :</strong> ${recipe.appliance}</p>
    <p><strong>Temps de préparation :</strong> ${recipe.time} min</p>
    
    <h3 class="modal-subtitle">Ingrédients :</h3>
    <ul>
      ${recipe.ingredients.map(ing => `
        <li>${ing.ingredient} ${ing.quantity ? `: ${ing.quantity}` : ''} ${ing.unit || ''}</li>
      `).join('')}
    </ul>

    <h3 class="modal-subtitle">Ustensiles :</h3>
    <ul>
      ${recipe.ustensils.map(u => `<li>${u}</li>`).join('')}
    </ul>

    <h3 class="modal-subtitle">Préparation :</h3>
    <p>${recipe.description}</p>
  `;
  modal.style.display = "block";
}

function setupModalEvents() {
  // Fermer via la croix
  closeButton.onclick = () => modal.style.display = "none";
  // Fermer en cliquant à côté de la popup
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
  }
}

function searchBar() {
  const search = document.getElementById("searchInput");
  search.addEventListener("input", () => {
    const searchValue = search.value.toLowerCase().trim();
    const filtered = allRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchValue)
    );
    render(filtered);
  });
}

init();