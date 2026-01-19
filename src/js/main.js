/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

// toggole sidebar

document.addEventListener("DOMContentLoaded", () => {
  let menuBtn = document.getElementById("header-menu-btn");
  let closeBtn = document.getElementById("sidebar-close-btn");
  let sidebar = document.getElementById("sidebar");
  let sidebarOverlay = document.getElementById("sidebar-overlay");

  let openSidebar = () => {
    sidebar.classList.remove("-translate-x-full");
    if (sidebarOverlay) sidebarOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  let closeSidebar = () => {
    sidebar.classList.add("-translate-x-full");
    if (sidebarOverlay) sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  let checkInitialState = () => {
    if (window.innerWidth < 1024) {
      sidebar.classList.add("-translate-x-full");
      if (sidebarOverlay) sidebarOverlay.classList.remove("active");
      document.body.style.overflow = "";
    } else {
      sidebar.classList.remove("-translate-x-full");
    }
  };

  checkInitialState();

  window.addEventListener("resize", checkInitialState);

  if (menuBtn) menuBtn.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);
});

// toggole sections

let navMeals = document.getElementById("nav-meals");
let navScanner = document.getElementById("nav-scanner");
let navFoodLog = document.getElementById("nav-foodlog");

let mealDetails = document.getElementById("meal-details");
let productsSection = document.getElementById("products-section");
let foodLogSection = document.getElementById("foodlog-section");

let mainMealSections = [
  document.getElementById("search-filters-section"),
  document.getElementById("meal-categories-section"),
  document.getElementById("all-recipes-section"),
];

function showSection(target) {
  var allSections = [
    mealDetails,
    productsSection,
    foodLogSection,
    mainMealSections[0],
    mainMealSections[1],
    mainMealSections[2],
  ];

  for (var i = 0; i < allSections.length; i++) {
    var currentSection = allSections[i];
    if (currentSection) {
      currentSection.classList.add("hidden");
    }
  }

  if (target === "meals") {
    for (var j = 0; j < mainMealSections.length; j++) {
      if (mainMealSections[j]) {
        mainMealSections[j].classList.remove("hidden");
      }
    }
  } else if (target === "scanner") {
    if (productsSection) {
      productsSection.classList.remove("hidden");
    }
  } else if (target === "foodlog") {
    if (foodLogSection) {
      foodLogSection.classList.remove("hidden");
    }
  }
}

navMeals.addEventListener("click", function () {
  showSection("meals");
  updateActiveLink(this);
});

navScanner.addEventListener("click", function () {
  showSection("scanner");
  updateActiveLink(this);
});

navFoodLog.addEventListener("click", function () {
  showSection("foodlog");
  updateActiveLink(this);
});

function updateActiveLink(activeBtn) {
  var navBtns = [navMeals, navScanner, navFoodLog];
  for (var i = 0; i < navBtns.length; i++) {
    var btn = navBtns[i];
    btn.classList.remove("bg-emerald-50", "text-emerald-700");
    btn.classList.add("text-gray-600");
    btn.querySelector("span").classList.replace("font-semibold", "font-medium");
  }

  activeBtn.classList.add("bg-emerald-50", "text-emerald-700");
  activeBtn.classList.remove("text-gray-600");
  activeBtn
    .querySelector("span")
    .classList.replace("font-medium", "font-semibold");
}

showSection("meals");
updateActiveLink(navMeals);

// toggel menu
let recipesSection = document.getElementById("all-recipes-section");
let categoriesSection = document.getElementById("meal-categories-section");
let searchSection = document.getElementById("search-filters-section");
let mealDetailsSection = document.getElementById("meal-details");
let backBtn = document.getElementById("back-to-meals-btn");

mealDetailsSection.classList.add("hidden");

function showMealDetails() {
  recipesSection.classList.add("hidden");
  categoriesSection.classList.add("hidden");
  searchSection.classList.add("hidden");
  mealDetailsSection.classList.remove("hidden");
}

function hideMealDetails() {
  mealDetailsSection.classList.add("hidden");
  recipesSection.classList.remove("hidden");
  searchSection.classList.remove("hidden");
  categoriesSection.classList.remove("hidden");
}

function getMealFullDetails(index) {
  // let meal = mealsLies[index];

  let Cartona = "";
  let ingredientsCartona = "";
  for (let i = 0; i < mealsLies[index].ingredients.length; i++) {
    ingredientsCartona += `
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
      <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
      <span class="text-gray-700">
        <span class="font-medium text-gray-900">${mealsLies[index].ingredients[i].measure}</span> ${mealsLies[index].ingredients[i].ingredient}
      </span>
    </div>`;
  }

  let instructionsCartona = mealsLies[index].instructions
    .map(
      (step) => `<p class="mb-4 text-gray-700 leading-relaxed">• ${step}</p>`,
    )
    .join("");

  let mainCartona = `
    <div class="max-w-7xl mx-auto">
      <!-- Back Button -->
      <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
        <i class="fa-solid fa-arrow-left"></i>
        <span>Back to Recipes</span>
      </button>

      <!-- Hero Section -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div class="relative h-80 md:h-96">
          <img src="${mealsLies[index].thumbnail}" alt="${
            mealsLies[index].name
          }" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-8">
            <div class="flex items-center gap-3 mb-3">
              <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${
                mealsLies[index].category
              }</span>
              <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${
                mealsLies[index].area
              }</span>
              ${
                mealsLies[index].tags.length > 0
                  ? `<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"></span>`
                  : ""
              }
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${
              mealsLies[index].name
            }</h1>
            <div class="flex items-center gap-6 text-white/90">
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-video"></i>
                <a href="${
                  mealsLies[index].youtube
                }" target="_blank" class="hover:underline">Watch Video</a>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 mb-8">
        <button id="log-meal-btn" class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all" data-meal-id="${
          mealsLies[index].id
        }">
          <i class="fa-solid fa-clipboard-list"></i>
          <span>Log This Meal</span>
        </button>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <!-- Ingredients Section -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-list-check text-emerald-600"></i>
              Ingredients
              <span class="text-sm font-normal text-gray-500 ml-auto">${
                mealsLies[index].ingredients.length
              } items</span>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${Cartona}
            </div>
          </div>

          <!-- Instructions Section -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-book-open text-emerald-600"></i>
              Instructions
            </h2>
            <div class="text-gray-700">
              ${instructionsCartona}
            </div>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById("meal-details").innerHTML = mainCartona;

  document.getElementById("back-to-meals-btn").onclick = hideMealDetails;
}

backBtn.addEventListener("click", hideMealDetails);

document.addEventListener("click", function (e) {
  var card = e.target.closest(".recipe-card");

  if (card) {
    var index = card.getAttribute("data-index");

    getMealFullDetails(index);
    showMealDetails();
  }
});
// ###########################

//recipes-grid section 1

let mealsLies = [];

let mealData = [];

async function allMeal(searchTerm, searchType = "category") {
  try {
    document.getElementById("recipes-grid").innerHTML = `
      <div class="col-span-full text-center py-10">
        <i class="fas fa-circle-notch fa-spin text-indigo-500 text-3xl"></i>
      </div>`;
    let res = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/filter?${searchType}=${searchTerm}&page=1&limit=25`,
    );
    let data = await res.json();

    if (data.results && data.results.length > 0) {
      mealsLies = data.results;
      mealData = data.results;
      displayData();
    }
  } catch (error) {
    document.getElementById("recipes-grid").innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-center col-span-full">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
          </div>
          <p class="text-gray-500 text-lg">No recipes found for ${searchTerm} </p>
          <p class="text-gray-400 text-sm mt-2">Try searching by category (e.g. Seafood) or area (e.g. Italian)</p>
      </div>
    `;
  }
}

allMeal("Seafood", "category");

function displayData() {
  let countElement = document.getElementById("recipes-count");
  if (countElement) {
    countElement.innerText = `Showing ${mealsLies.length} recipes`;
  }

  var cartona = ``;
  for (var i = 0; i < mealsLies.length; i++) {
    cartona += `
               <div  data-meal-id="${mealsLies[i].id}" data-index="${i}" onclick="getMealDetails('${mealsLies[i].id}')" class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">
    <div class="relative h-48 overflow-hidden">
      <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        src="${mealsLies[i].thumbnail}" 
        alt="${mealsLies[i].name}"
      />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                    <i class="fa-solid fa-tag text-green-600"></i>${mealsLies[i].category}
                  </span>
                  <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
                    <i class="fa-solid fa-globe mr-1 text-blue-600"></i>${mealsLies[i].area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  ${mealsLies[i].name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  ${mealsLies[i].instructions}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${mealsLies[i].category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${mealsLies[i].area}
                  </span>
                </div>
              </div>
            </div>
        
        `;
  }
  document.getElementById("recipes-grid").innerHTML = cartona;
}

//Meal Type

let MealTypeList = [];
async function categories() {
  var res = await fetch(
    `https://nutriplan-api.vercel.app/api/meals/categories`,
  );
  var data = await res.json();

  MealTypeList = data.results;
  displaycategories();
  //   console.log(MealTypeList);
}
categories();

function displaycategories() {
  var cartona = ``;
  for (var i = 0; i < 12; i++) {
    cartona += `
          <div
              class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
              data-category=${MealTypeList[i].name}
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                >
                  <i class="fa-solid fa-drumstick-bite"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${MealTypeList[i].name}</h3>
                </div>
              </div>
            </div>

        `;
  }
  document.getElementById("categories-grid").innerHTML = cartona;
}

document.addEventListener("click", function (e) {
  var categoryCard = e.target.closest(".category-card");
  if (categoryCard) {
    var categoryName = categoryCard.getAttribute("data-category");
    allMeal(categoryName, "category");
    if (typeof hideMealDetails === "function") hideMealDetails();
    return;
  }

  var areaBtn = e.target.closest("#areas-name button");
  if (areaBtn) {
    var areaName = areaBtn.innerText.trim();
    allMeal(areaName, "area");
    if (typeof hideMealDetails === "function") hideMealDetails();
  }
});

// search inputt

let SearchInputShow = document.getElementById("search-input");
let typingTimer;

SearchInputShow.addEventListener("input", function () {
  clearTimeout(typingTimer);

  let searchValue = SearchInputShow.value.trim();

  if (searchValue !== "") {
    SearchInputShow.value =
      searchValue.charAt(0).toUpperCase() + searchValue.slice(1);

    typingTimer = setTimeout(function () {
      allMeal(SearchInputShow.value.trim());
    }, 500);
  }
});

SearchInputShow.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    clearTimeout(typingTimer);
    let searchValue = SearchInputShow.value.trim();

    if (searchValue !== "") {
      allMeal(searchValue);
      SearchInputShow.value = "";
    }
  }
});

// toggle theame Meals & Recipes

let gridBtn = document.getElementById("grid-view-btn");
let listBtn = document.getElementById("list-view-btn");
let recipesGrid = document.getElementById("recipes-grid");

gridBtn.addEventListener("click", function () {
  gridBtn.classList.add("bg-white", "shadow-sm");
  gridBtn
    .querySelector("i")
    .classList.replace("text-gray-500", "text-gray-700");

  listBtn.classList.remove("bg-white", "shadow-sm");
  listBtn
    .querySelector("i")
    .classList.replace("text-gray-700", "text-gray-500");

  recipesGrid.classList.remove("grid-cols-1");
  recipesGrid.classList.add("grid-cols-4");

  localStorage.setItem("viewMode", "grid");
  displayData();
});

listBtn.addEventListener("click", function () {
  listBtn.classList.add("bg-white", "shadow-sm");
  listBtn
    .querySelector("i")
    .classList.replace("text-gray-500", "text-gray-700");

  gridBtn.classList.remove("bg-white", "shadow-sm");
  gridBtn
    .querySelector("i")
    .classList.replace("text-gray-700", "text-gray-500");

  recipesGrid.classList.remove("grid-cols-4");
  recipesGrid.classList.add("grid-cols-1");

  localStorage.setItem("viewMode", "list");
  displayData();
});

//Meal Type

let areasList = [];

async function allArea() {
  var res = await fetch(`https://nutriplan-api.vercel.app/api/meals/areas`);
  var data = await res.json();

  areasList = data.results;

  displayAreaName();
}

function displayAreaName() {
  var cartona = `
    <button
      onclick="handleButtonClick(this, 'Seafood', 'category')" 
      class="active-area px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all"
    >
      All Recipes
    </button>`;

  for (var i = 0; i < areasList.length; i++) {
    cartona += `
      <button
        onclick="handleButtonClick(this, '${areasList[i].name}', 'area')"
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all "
      >
        ${areasList[i].name}
      </button>`;
  }
  document.getElementById("areas-name").innerHTML = cartona;
}

// ##################

function handleButtonClick(clickedBtn, searchTerm, searchType) {
  let allButtons = document.querySelectorAll("#areas-name button");

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.remove("active-area");
  }

  clickedBtn.classList.add("active-area");

  allMeal(searchTerm, searchType);

  if (typeof hideMealDetails === "function") {
    hideMealDetails();
  }
}
// ##################

let areasContainer = document.getElementById("areas-name");

if (areasContainer) {
  areasContainer.addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
      let areaName = event.target.innerText.trim();

      allMeal(areaName);

      Array.from(this.children).forEach((btn) =>
        btn.classList.remove("active-style"),
      );
      event.target.classList.add("active-style");
    }
  });
}

// select img to show in details

let recipesImage = document.getElementById("recipes-grid");
if (recipesImage) {
  recipesImage.addEventListener("click", function (e) {
    if (e.target.tagName === "IMG") {
      let imageUrl = e.target.src;
      let heroImage = document.getElementById("detail-meal-img");
      if (heroImage) {
        heroImage.src = imageUrl;
      }
      console.log(imageUrl);
    }
  });
}
allArea();

// Product Scanner section

let productList = [];
async function allProduct(query = "Nutella") {
  let res = await fetch(
    `https://nutriplan-api.vercel.app/api/products/search?q=${query}&page=1&limit=24`,
  );

  let data = await res.json();
  productList = data.results;
  displayProduct();
  console.log(productList);
}

allProduct();

function displayProduct() {
  var cartona = ``;
  for (var i = 0; i < productList.length; i++) {
    cartona += `
      <div  onclick="updateNutritionFacts(${i})" class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" 
           data-barcode="${productList[i].barcode}">
        
        <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden" >

        <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
               src="${productList[i].image}" 
               alt="${productList[i].name}" 
                />

          <div  class="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded uppercase shadow-sm">
            Score ${productList[i].nutritionGrade}
          </div>


          <div class="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
            ${productList[i].novaGroup}
          </div>
        </div>

        <div class="p-4">

        <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${productList[i].brand}</p>
          <h3 class="font-bold text-gray-900 mb-2 h-10 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            ${productList[i].name}
          </h3>


          <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
             <span><i class="fa-solid fa-fire mr-1"></i>${productList[i].nutrients.calories} kcal/100g</span>
          </div>


          <div class="grid grid-cols-4 gap-1 text-center">
            <div class="bg-emerald-50 rounded p-1.5">
              <p class="text-[11px] font-bold text-emerald-700">${productList[i].nutrients.protein}g</p>
              <p class="text-[9px] text-gray-500">Protein</p>
            </div>
            <div class="bg-blue-50 rounded p-1.5">
              <p class="text-[11px] font-bold text-blue-700">${productList[i].nutrients.carbs}g</p>
              <p class="text-[9px] text-gray-500">Carbs</p>
            </div>
            <div class="bg-purple-50 rounded p-1.5">
              <p class="text-[11px] font-bold text-purple-700">${productList[i].nutrients.fat}g</p>
              <p class="text-[9px] text-gray-500">Fat</p>
            </div>
            <div class="bg-orange-50 rounded p-1.5">
              <p class="text-[11px] font-bold text-orange-700">${productList[i].nutrients.sugar}g</p>
              <p class="text-[9px] text-gray-500">Sugar</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("products-grid").innerHTML = cartona;
}
// ##################################

// #################
document
  .getElementById("product-categories")
  .addEventListener("click", function (e) {
    let btn = e.target.closest(".product-category-btn");

    if (btn) {
      let searchQuery = btn.getAttribute("data-query") || btn.innerText.trim();

      allProduct(searchQuery);
    }
  });

// search input

let productSearchInput = document.getElementById("product-search-input");
let debounceTimer;

productSearchInput.addEventListener("input", function () {
  let searchValue = productSearchInput.value;

  clearTimeout(debounceTimer);

  if (searchValue === "") return;

  debounceTimer = setTimeout(function () {
    allProduct(searchValue);
  }, 500);
});

productSearchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    clearTimeout(debounceTimer);
    let searchValue = productSearchInput.value;

    if (searchValue !== "") {
      allProduct(searchValue);

      productSearchInput.value = "";
    }
  }
});

// barcode

let barcodeInput = document.getElementById("barcode-input");

barcodeInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    let barcodeValue = barcodeInput.value.trim();

    if (barcodeValue !== "") {
      searchByBarcode(barcodeValue);

      barcodeInput.value = "";
    }
  }
});

// #####################################

// food log section three

let options = { weekday: "long", month: "short", day: "numeric" };
let today = new Date().toLocaleDateString("en-US", options);
document.getElementById("foodlog-date").textContent = today;

//  Browse Recipes with Meals & Recipes

var browseRecipesBtn = document.getElementById("browse-recipes-btn");
var scanProductBtn = document.getElementById("scan-product-btn");

if (browseRecipesBtn) {
  browseRecipesBtn.addEventListener("click", function () {
    showSection("meals");
    updateActiveLink(navMeals);
  });
}

if (scanProductBtn) {
  scanProductBtn.addEventListener("click", function () {
    showSection("scanner");
    updateActiveLink(navScanner);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Scan Product with Product Scanner

var scanProductBtn = document.getElementById("scan-product-btn");

if (scanProductBtn) {
  scanProductBtn.addEventListener("click", function () {
    showSection("scanner");

    updateActiveLink(navScanner);

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

//  Today's Nutrition

var TodayNutrition = [];

async function analyzeNutrition() {
  const url = "https://nutriplan-api.vercel.app/api/nutrition/analyze";
  const recipeData = {
    recipeName: "Baked salmon with fennel & tomatoes",
    ingredients: [
      "2 medium Fennel",
      "2 tbs chopped Parsley",
      "Juice of 1 Lemon",
      "175g Cherry Tomatoes",
      "1 tbs Olive Oil",
      "350g Salmon",
      "to serve Black Olives",
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "vJPCxsQScz84b09LWgZxOeTkhQ0Olp0RMMoSoouy",
      },
      body: JSON.stringify(recipeData),
    });

    const result = await response.json();

    TodayNutrition = result.data.ingredients;

    console.log(TodayNutrition);

    // 1. تحديث الواجهة
    displayIntoFoodLog();
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayIntoFoodLog() {
  var totals = { cal: 0, pro: 0, carb: 0, fat: 0 };
  var itemsListHtml = "";

  for (let i = 0; i < TodayNutrition.length; i++) {
    let item = TodayNutrition[i];
    let nut = item.nutrition || {};

    console.log(item.original);

    totals.cal += nut.calories;
    totals.pro += nut.protein;
    totals.carb += nut.carbs;
    totals.fat += nut.fat;

    itemsListHtml += `
      <div class="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
        <span class="text-sm font-bold text-gray-700">${item.original}</span>
        <span class="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
          ${nut.calories} kcal
        </span>
      </div>`;
  }

  const goals = { cal: 2000, pro: 150, carb: 250, fat: 70 };

  const getPerc = (current, goal) =>
    Math.round(Math.min((current / goal) * 100, 100));

  var cartona = `
    <h3 class="text-lg font-bold text-gray-900 mb-4">
      <i class="fa-solid fa-fire text-orange-500 mr-2"></i> Today's Nutrition (2026)
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      ${createProgressCard("Calories", totals.cal.toFixed(0), goals.cal, "emerald", getPerc(totals.cal, goals.cal), "kcal")}
      ${createProgressCard("Protein", totals.pro.toFixed(1), goals.pro, "blue", getPerc(totals.pro, goals.pro), "g")}
      ${createProgressCard("Carbs", totals.carb.toFixed(1), goals.carb, "amber", getPerc(totals.carb, goals.carb), "g")}
      ${createProgressCard("Fat", totals.fat.toFixed(1), goals.fat, "purple", getPerc(totals.fat, goals.fat), "g")}
    </div>

    <div class="border-t border-gray-200 pt-4">
      <div class="flex justify-between items-center mb-3">
         <h4 class="text-sm font-semibold text-gray-700">Logged Items (${TodayNutrition.length})</h4>
         <button id="log-meal-btn" class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
            Confirm Log
         </button>
      </div>
      <div id="logged-items-list" class="space-y-2 max-h-60 overflow-y-auto">
        ${TodayNutrition.length > 0 ? itemsListHtml : '<p class="text-gray-400 text-center py-4">No items logged yet</p>'}
      </div>
    </div>
  `;

  document.getElementById("foodlog-today-section").innerHTML = cartona;

  const logBtn = document.getElementById("log-meal-btn");
  if (logBtn) {
    logBtn.onclick = function () {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Meal logged successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    };
  }
}

function createProgressCard(label, current, goal, colorClass, perc, unit) {
  const colors = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      bar: "bg-emerald-500 text-emerald-500",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      bar: "bg-blue-500 text-blue-500",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      bar: "bg-amber-500 text-amber-500",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      bar: "bg-purple-500 text-purple-500",
    },
  };

  const selected = colors[colorClass] || colors.emerald;

  console.log(selected);

  return `
    <div class="${selected.bg} rounded-xl p-4 border ${selected.border}">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold text-gray-700">${label}</span>
        <span class="text-xs font-medium text-gray-500">${current}/${goal} ${unit}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <!-- هنا الـ style="width: ${perc}%" هو الذي يجعل الشريط ديناميكي -->
        <div class="${selected.bar} h-2 rounded-full transition-all duration-1000" style="width: ${perc}%"></div>
      </div>
    </div>`;
}

analyzeNutrition();

///...  Weekly Overview
