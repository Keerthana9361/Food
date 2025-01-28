let recipes = [];
let currentFilter = 'all';
let currentDifficulty = 'all';
let searchTerm = '';

// Recipe categories
const recipeCategories = {
    vegetarian: ['Palak Paneer', 'Dal Makhani', 'Malai Kofta', 'Aloo Gobi', 'Baingan Bharta', 'Matar Paneer', 'Mushroom Masala', 'Mixed Vegetable Curry', 'Dal Tadka', 'Lauki Kofta', 'Chana Masala', 'Vegetable Sambar', 'Jeera Rice', 'Chole Bhature', 'Kadhi Pakora', 'Shahi Paneer', 'Bhindi Masala', 'Rajma Chawal', 'Vegetable Pulao' ],
    'Nonvegetarian': ['Butter Chicken', 'Biryani', 'Tandoori Chicken', 'Rogan Josh', 'Chicken 65', 'Chicken Saagwala', 'Kadai Chicken', 'Chicken Korma', 'Malai Chicken', 'Egg Curry'],
    snacks: ['Samosa', 'Onion Bhaji', 'Aloo Tikki', 'Kathi Roll', 'Pani Puri', 'Vada Pav', 'Dhokla', 'Pav Bhaji', 'Samosas'],
    sweets: ['Rasmalai', 'Gulab Jamun', 'Kaju Katli', 'Mysore Pak', 'Coconut Ladoo', 'Kalakand', 'Carrot Halwa', 'Shahi Tukda', 'Moong Dal Halwa', 'Rice Kheer'],
    breakfast: ['Masala Dosa', 'Poha', 'Rava Idli', 'Aloo Paratha', 'Vada Pav', 'Dhokla', 'Methi Paratha', 'Masala Chai']
};

async function loadRecipes() {
    try {
        const response = await fetch('recipes.json');
        const data = await response.json();
        recipes = data.recipes;
        displayRecipes();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}

function setupEventListeners() {
    // Category filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.category;
            displayRecipes();
        });
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        displayRecipes();
    });

    // Difficulty filter
    document.getElementById('difficultyFilter').addEventListener('change', (e) => {
        currentDifficulty = e.target.value;
        displayRecipes();
    });
}

function getRecipeCategory(recipeName) {
    for (const [category, recipes] of Object.entries(recipeCategories)) {
        if (recipes.includes(recipeName)) return category;
    }
    return 'other';
}

function displayRecipes() {
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = '';

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) ||
                            recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm));
        const matchesDifficulty = currentDifficulty === 'all' || recipe.difficulty === currentDifficulty;
        const category = getRecipeCategory(recipe.name);
        const matchesCategory = currentFilter === 'all' || category === currentFilter;

        return matchesSearch && matchesDifficulty && matchesCategory;
    });

    filteredRecipes.forEach(recipe => {
        const category = getRecipeCategory(recipe.name);
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.onclick = () => showRecipeDetails(recipe);

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <div class="recipe-content">
                <div class="recipe-category">${category}</div>
                <h2 class="recipe-name">${recipe.name}</h2>
                <div class="recipe-info">
                    <span>🕒 ${recipe.prepTime}</span>
                    <span>👨‍🍳 ${recipe.difficulty}</span>
                    <span>👥 ${recipe.servings} servings</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function showRecipeDetails(recipe) {
    const modal = document.getElementById('recipeModal');
    const content = document.getElementById('modalContent');

    content.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="modal-image">
        <h2 class="recipe-name">${recipe.name}</h2>
        <div class="recipe-info">
            <span>⏰ Preparation Time: ${recipe.prepTime}</span>
            <span>🍳 Cooking Time: ${recipe.cookTime}</span>
            <span>👨‍🍳 Difficulty: ${recipe.difficulty}</span>
            <span>👥 Servings: ${recipe.servings}</span>
        </div>

        <h3 class="section-title">🥘 Ingredients</h3>
        <ul class="ingredients-list">
            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>

        <h3 class="section-title">📝 Instructions</h3>
        <ol class="instructions-list">
            ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
        </ol>
    `;

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('recipeModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('recipeModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Load recipes when the page loads
document.addEventListener('DOMContentLoaded', loadRecipes);