/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */
"use strict";
//^ global variables
let mealsList;
let productsList;
let isGrid = true;
let loggedItemsList = [];
let analyzeResult;
let mealToLog;
let productsListSearchName = [];
let totalCountSearchName = 0;
let dateNow = new Date();
let nearestTuesday = new Date(
  dateNow.setDate(dateNow.getDate() - ((dateNow.getDay() + 5) % 7)),
)
  .toISOString()
  .split("T")[0];

let navbarText = {
  meals: {
    header: "Meals & Recipes",
    paragraph: "Discover delicious and nutritious recipes tailored for you",
  },
  productScanner: {
    header: "Product Scanner",
    paragraph: "Search packaged foods by name or barcode",
  },
  foodLog: {
    header: "Food Log",
    paragraph: "Track your daily nutrition and food intake",
  },
  mealDetails: {
    header: "Recipe Details",
    paragraph: "View full recipe information and nutrition facts",
  },
};

let nutritionGradeRating = {
  a: "Excellent",
  b: "Good",
  c: "Average",
  d: "Poor",
  e: "Bad",
  nknown: "Unknown",
};
let novaGroupState = {
  1: "Unprocessed",
  2: "Processed Ingredients",
  3: "Processed",
  4: "Ultra-processed",
};
let itemType = { recipe: "Recipe", product: "Product" };
let nutritionGradeBgColors = {
  a: "bg-green-500",
  b: "bg-lime-500",
  c: "bg-yellow-500",
  d: "bg-orange-500",
  e: "bg-red-500",
  unknown: "bg-gray-400",
};
let novaGroupBgColors = {
  1: "bg-green-500",
  2: "bg-lime-500",
  3: "bg-orange-500",
  4: "bg-red-500",
  noColor: "",
};
let searchTypes = { byName: 1, byBarcode: 2, byCategory: 3, noResults: 4 };
let weekData = {
  TuesdayDate: nearestTuesday,
  today: "0",
  Tue: { kcal: 0, itemsCount: 0 },
  Wed: { kcal: 0, itemsCount: 0 },
  Thu: { kcal: 0, itemsCount: 0 },
  Fri: { kcal: 0, itemsCount: 0 },
  Sat: { kcal: 0, itemsCount: 0 },
  Sun: { kcal: 0, itemsCount: 0 },
  Mon: { kcal: 0, itemsCount: 0 },
};

//^ selectors
const recipesGrid = document.querySelector("#recipes-grid");
const recipesCount = document.querySelector("#recipes-count");
const areaBtns = document.querySelectorAll(
  "#search-filters-section > div > div > button",
);
const categoriesGridDivs = document.querySelectorAll("#categories-grid > div");
const gridViewBtn = document.querySelector("#grid-view-btn");
const listViewBtn = document.querySelector("#list-view-btn");
const mainContentSections = document.querySelectorAll(
  "#main-content > section",
);
const sidebartabs = document.querySelectorAll("#sidebar ul a");
const searchInput = document.querySelector("#search-input");
const navbarHeader = document.querySelector("header h1");
const navbarparagraph = document.querySelector("header p");
const mealDetailHero = document.querySelector("#mealDetailHero");
const backToMealsBtn = document.querySelector("#back-to-meals-btn");
const IngredientsMealDetails = document.querySelector(
  "#Ingredients-meal-details",
);
const IngredientsCount = document.querySelector("#Ingredients-count");
const InstructionsMealDetails = document.querySelector(
  "#Instructions-meal-details",
);
const nutritionFactsMealDetails = document.querySelector(
  "#nutrition-facts-container",
);
const videoMealDetails = document.querySelector("iframe");
const searchProductBtn = document.querySelector("#search-product-btn");
const lookupBarcodeBtn = document.querySelector("#lookup-barcode-btn");
const productSearchInput = document.querySelector("#product-search-input");
const barcodeInput = document.querySelector("#barcode-input");
const productsGrid = document.querySelector("#products-grid");
const productsEmpty = document.querySelector("#products-empty");
const productsLoading = document.querySelector("#products-loading");
const nutriScoreBtns = document.querySelectorAll("[data-grade]");
const productDetailModal = document.querySelector("#product-detail-modal");
const productCategoryBtns = document.querySelectorAll(".product-category-btn");
const loggedItems = document.querySelector("#logged-items-list");
const addMealFromRecipesBtn = document.querySelector("#log-meal-from-recipes");
const ScanProduct = document.querySelector("#Scan-product");
const totalProtein = document.querySelector("#total-protein");
const totalCarbs = document.querySelector("#total-carbs");
const totalFat = document.querySelector("#total-fat");
const totalCalories = document.querySelector("#total-calories");
const totalProteinPercent = document.querySelector("#total-protein-percent");
const totalCarbsPercent = document.querySelector("#total-carbs-percent");
const totalFatPercent = document.querySelector("#total-fat-percent");
const totalCaloriesPercent = document.querySelector("#total-calories-percent");
const clearFoodlogBtn = document.querySelector("#clear-foodlog");
const totalLoggedItems = document.querySelector("#total-logged-items");
const foodlogDate = document.querySelector("#foodlog-date");
const logMealBtn = document.querySelector("#log-meal-btn");
const nutritionFactsContainerMealDettails = document.querySelector(
  "#nutrition-facts-container",
);
const logMealModal = document.querySelector("#log-meal-modal");
const appLoadingOverlay = document.querySelector("#app-loading-overlay");
const productsCount = document.querySelector("#products-count");
const weeklyChart = document.querySelector("#weekly-chart");
const headerMenuBtn = document.querySelector("#header-menu-btn");
const sidebarOverlay = document.querySelector("#sidebar-overlay");
const sidebar = document.querySelector("#sidebar");
const sidebarCloseBtn = document.querySelector("#sidebar-close-btn");

//^ events

headerMenuBtn.addEventListener("click", function () {
  sidebarOverlay.classList.add("active");
  sidebar.classList.add("open");
});
//* sidebarCloseBtn
sidebarCloseBtn.addEventListener("click", function () {
  sidebarOverlay.classList.remove("active");
  sidebar.classList.remove("open");
});

//* areaBtns event
for (const btn of areaBtns) {
  btn.addEventListener("click", function () {
    for (const element of areaBtns) {
      if (element.classList.contains("text-white")) {
        element.classList.remove("bg-emerald-600", "text-white");
        element.classList.add("bg-gray-100", "text-gray-700");
      }
    }
    btn.classList.remove("bg-gray-100", "text-gray-700");
    btn.classList.add("bg-emerald-600", "text-white");

    areaFilter(btn.getAttribute("data-area"));
  });
}

//* categoriesGridDivs
for (const element of categoriesGridDivs) {
  element.addEventListener("click", function () {
    categoryFilter(element.getAttribute("data-category"));
  });
}

//* gridViewBtn
gridViewBtn.addEventListener("click", function () {
  // clicked btn bg
  gridViewBtn.classList.add("bg-white", "shadow-sm");
  listViewBtn.classList.remove("bg-white", "shadow-sm");

  recipesGrid.classList.remove("grid-cols-2", "gap-4");
  recipesGrid.classList.add("grid-cols-4", "gap-5");
  isGrid = true;
  displayMeals(mealsList);
});

//* listViewBtn
listViewBtn.addEventListener("click", function () {
  listViewBtn.classList.add("bg-white", "shadow-sm");
  gridViewBtn.classList.remove("bg-white", "shadow-sm");

  recipesGrid.classList.remove("grid-cols-4", "gap-5");
  recipesGrid.classList.add("grid-cols-2", "gap-4");
  isGrid = false;
  displayMealsList(mealsList);
});

//* Meals & Recipes
sidebartabs[0].addEventListener("click", function () {
  updateActiveTabStyle(sidebartabs[0]);
  showMealspage();
});

//* Product Scanner
sidebartabs[1].addEventListener("click", function () {
  updateActiveTabStyle(this);
  showProductspage();
});

//* Food Log
sidebartabs[2].addEventListener("click", function () {
  updateActiveTabStyle(this);
  showFoodLogpage();
});

//* searchInput
searchInput.addEventListener("input", function () {
  if (searchInput.value == "") {
    //All Cuisines
    areaFilter();
  } else {
    GetMealsbySearch(searchInput.value);
  }
});

//* backToMealsBtn
backToMealsBtn.addEventListener("click", function () {
  showMealspage();
});
//* searchProductBtn
searchProductBtn.addEventListener("click", function () {
  if (productSearchInput.value != "") {
    getProductsByName(productSearchInput.value);
  }
});
//* lookupBarcodeBtn
lookupBarcodeBtn.addEventListener("click", function () {
  if (barcodeInput.value != "") {
    getProductByBarcode(barcodeInput.value);
  }
});

//* nutriScoreBtns
for (const btn of nutriScoreBtns) {
  btn.addEventListener("click", function () {
    for (const element of nutriScoreBtns) {
      element.classList.remove("ring-2", "ring-gray-900");
    }
    btn.classList.add("ring-2", "ring-gray-900");

    filterProductsbyNutriScore(btn.getAttribute("data-grade"));
  });
}

//* productCategoryBtns
for (const btn of productCategoryBtns) {
  btn.addEventListener("click", function () {
    getProductByCategory(btn.getAttribute("data-category"));
  });
}

//* addMealFromRecipesBtn
addMealFromRecipesBtn.addEventListener("click", function () {
  updateActiveTabStyle(sidebartabs[0]);
  showMealspage();
});

//* ScanProduct
ScanProduct.addEventListener("click", function () {
  updateActiveTabStyle(sidebartabs[1]);
  showProductspage();
});
//* clearFoodlogBtn
clearFoodlogBtn.addEventListener("click", function () {
  Swal.fire({
    title: "Clear Today's Log?",
    text: "This will remove all logged food items for today.",
    icon: "warning",
    showConfirmButton: false,
    showDenyButton: true,
    showCancelButton: true,
    denyButtonText: `Yes, clear it!`,
  }).then((result) => {
    if (result.isDenied) {
      Swal.fire({
        title: "Cleared!",
        text: "Your food log has been cleared.",
        icon: "success",
        timer: 1000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
      loggedItemsList = [];
      saveInLocalStorage();
      displayLoggedItems();
    }
  });
});
//* logMealBtn
logMealBtn.addEventListener("click", function () {
  displayLogMealModal();
});

window.addEventListener("load", function () {
  appLoadingOverlay.classList.add("loading");
});

if (localStorage.getItem("loggedItemsList")) {
  loggedItemsList = JSON.parse(localStorage.getItem("loggedItemsList"));
  weekData = JSON.parse(localStorage.getItem("weekData"));
  displayLoggedItems();
}

areaFilter();
foodlogDate.innerHTML = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
});
updateFoodlogDatePeriodically();

//^ functions
async function areaFilter(area) {
  MealsLoadingState();

  let res;
  let finalResult;
  try {
    if (area) {
      res = await fetch(
        `https://nutriplan-api.vercel.app/api/meals/filter?area=${area}&limit=20`,
      );
    } else {
      res = await fetch(
        `https://nutriplan-api.vercel.app/api/meals/search?q=chicken&page=1&limit=25`,
      );
    }

    if (res.ok) {
      finalResult = await res.json();
      mealsList = finalResult.results;
      updateRecipesCount(finalResult, area);
      displayMeals(mealsList);
    } else {
      updateRecipesCount(false, area);
      displayMeals([]);
      mealsList = [];
    }
  } catch (error) {
    console.log(error);
  }
}

async function categoryFilter(category) {
  MealsLoadingState();
  try {
    let res = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/filter?category=${category}&limit=20`,
    );
    if (res.ok) {
      let finalResult = await res.json();
      mealsList = finalResult.results;
      updateRecipesCount(finalResult, category);
      displayMeals(mealsList);
    } else {
      updateRecipesCount(false, category);
      displayMeals([]);
      mealsList = [];
    }
  } catch (error) {
    console.log(error);
  }
}

async function GetMealsbySearch(term) {
  MealsLoadingState();
  try {
    if (term) {
      let res = await fetch(
        `https://nutriplan-api.vercel.app/api/meals/search?q=${term}&page=1&limit=25`,
      );
      if (res.ok) {
        let finalResult = await res.json();
        mealsList = finalResult.results;
        updateRecipesCount(finalResult, term, true);
        displayMeals(mealsList);
      } else {
        updateRecipesCount(false, term, true);
        displayMeals([]);
        mealsList = [];
      }
    } else {
      areaFilter();
    }
  } catch (error) {
    console.log(error);
  }
}
async function getProductsByName(term) {
  productsEmpty.classList.add("hidden");
  productsGrid.innerHTML = "";
  productsLoading.classList.remove("hidden");
  try {
    let res = await fetch(
      `https://nutriplan-api.vercel.app/api/products/search?q=${term}&page=1&limit=100`,
    );

    if (res.ok) {
      let finalResult = await res.json();
      productsList = finalResult.results;
      productsListSearchName = finalResult.results;
      totalCountSearchName = finalResult.pagination.total;
      productsLoading.classList.add("hidden");
      displayProducts(productsList);
      updateProductsCount(
        finalResult.pagination.total,
        term,
        searchTypes.byName,
      );
    } else {
      productsList = [];
      productsListSearchName = [];
      totalCountSearchName = 0;
      productsLoading.classList.add("hidden");
      displayProducts([]);
      updateProductsCount(0, term, searchTypes.byName);
    }
  } catch (error) {
    console.log(error);
  }
}
async function getProductByBarcode(term) {
  productsEmpty.classList.add("hidden");
  productsGrid.innerHTML = "";
  productsLoading.classList.remove("hidden");
  try {
    let res = await fetch(
      `https://nutriplan-api.vercel.app/api/products/barcode/${term}`,
    );

    if (res.ok) {
      let finalResult = await res.json();
      productsList = finalResult.result;
      productsLoading.classList.add("hidden");
      displayProducts(productsList);
      displayClickedProduct(productsList.barcode);
      updateProductsCount(1, productsList.name, searchTypes.byBarcode);
    } else {
      productsList = [];
      productsLoading.classList.add("hidden");
      displayProducts([]);
      updateProductsCount(0, barcodeInput.value, searchTypes.byBarcode);
    }
  } catch (error) {
    console.log(error);
  }
}
async function getProductByCategory(term) {
  productsEmpty.classList.add("hidden");
  productsGrid.innerHTML = "";
  productsLoading.classList.remove("hidden");

  try {
    let res = await fetch(
      `https://nutriplan-api.vercel.app/api/products/category/${term}`,
    );
    if (res.ok) {
      let finalResult = await res.json();
      productsList = finalResult.results;
      productsLoading.classList.add("hidden");
      displayProducts(productsList);
      updateProductsCount(
        finalResult.pagination.total,
        term,
        searchTypes.byCategory,
      );
    } else {
      productsList = [];
      productsLoading.classList.add("hidden");
      displayProducts([]);
      updateProductsCount(0, term, searchTypes.noResults);
    }
  } catch (error) {}
}

async function getCaloriesMealDetails(meal) {
  let bodyOfAPI = PrepareAPIBody(meal);

  try {
    const res = await fetch(
      "https://nutriplan-api.vercel.app/api/nutrition/analyze",
      {
        method: "POST",
        headers: {
          "x-api-key": "HCZbNTI2sBCJzAz0fTNBIg0JrVCWTCf92LXSP9Tq",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyOfAPI),
      },
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function updateRecipesCount(finalResult, term, isSearch) {
  let total;
  let limit;
  if (finalResult) {
    total = finalResult.pagination.total;
    limit = finalResult.pagination.limit;
  } else {
    total = 0;
    limit = 0;
  }

  if (isSearch) {
    recipesCount.innerHTML = `Showing ${total < limit ? total : limit} recipes for "${term}"`;
  }
  // categoryFilter & areaFilter
  else {
    recipesCount.innerHTML = `Showing ${total < limit ? total : limit} ${term ? term + " " : ""}recipes`;
  }
}

function displayMeals(list) {
  if (list.length === 0) {
    displayNoMeals();
    return;
  }
  if (isGrid) {
    displayMealsGrid(list);
  } else {
    displayMealsList(list);
  }
}

function displayMealsGrid(list) {
  let outputMeals = "";

  for (const meal of list) {
    outputMeals += `<div onclick='displayClickedMealDetails(${meal.id})' class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="52772">
              <div class="relative h-48 overflow-hidden">
                <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.thumbnail}" alt="${meal.name}" loading="lazy">
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
                    <i class="mr-1 text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-tag" data-prefix="fas" data-icon="tag" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M32.5 96l0 149.5c0 17 6.7 33.3 18.7 45.3l192 192c25 25 65.5 25 90.5 0L483.2 333.3c25-25 25-65.5 0-90.5l-192-192C279.2 38.7 263 32 246 32L96.5 32c-35.3 0-64 28.7-64 64zm112 16a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>
                            ${meal.category}
                  </span>
                  <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
                  <i class="mr-1 text-blue-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" data-prefix="fas" data-icon="globe" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z"></path></svg></i>
                  ${meal.area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  ${meal.name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  ${meal.instructions}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="mr-1 text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-utensils" data-prefix="fas" data-icon="utensils" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"></path></svg></i>
                    ${meal.category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="mr-1 text-blue-500" data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" data-prefix="fas" data-icon="globe" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z"></path></svg></i>
                    ${meal.area}
                  </span>
                </div>
              </div>
            </div>`;
  }
  recipesGrid.innerHTML = outputMeals;
}

function displayMealsList(list) {
  let outputMeals = "";
  for (const meal of list) {
    outputMeals += `<div onlick='displayClickedMealDetails(${meal.id})' class=" recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-row h-40" data-meal-id="52795">
            <div class="relative overflow-hidden w-48 h-full">
                <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.thumbnail}" alt="${meal.name}" loading="lazy">
            </div>
            <div class="p-4">
                <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    ${meal.name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                    Take a large pot or wok, big enough to cook all the chicken, and heat the oil in it. Once the oil is...
                </p>
                <div class="flex items-center justify-between text-xs">
                    <span class="font-semibold text-gray-900">
                        <i class="mr-1 text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-utensils" data-prefix="fas" data-icon="utensils" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"></path></svg></i>
                        ${meal.category}
                    </span>
                    <span class="font-semibold text-gray-500">
                        <i class="mr-1 text-blue-500" data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" data-prefix="fas" data-icon="globe" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z"></path></svg></i>
                      ${meal.area}
                    </span>
                </div>
            </div>
        </div>`;
  }
  recipesGrid.innerHTML = outputMeals;
}
function updateActiveTabStyle(tab) {
  for (const element of sidebartabs) {
    if (element.classList.contains("text-emerald-700")) {
      element.classList.remove("bg-emerald-50", "text-emerald-700");
      element.classList.add("text-gray-600", "hover:bg-gray-50");
      element.children[1].classList.remove("font-semibold");
      element.children[1].classList.add("font-medium");
    }
  }
  tab.classList.add("bg-emerald-50", "text-emerald-700");
  tab.classList.remove("text-gray-600", "hover:bg-gray-50");
  tab.children[1].classList.add("font-semibold");
  tab.children[1].classList.remove("font-medium");
}
function updateNavbarText(header, paragraph) {
  navbarHeader.innerHTML = header;
  navbarparagraph.innerHTML = paragraph;
}

function displayNoMeals() {
  recipesGrid.innerHTML = `<div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="text-2xl text-gray-400" data-fa-i2svg=""><svg class="svg-inline--fa fa-magnifying-glass" data-prefix="fas" data-icon="magnifying-glass" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg></i>
            </div>
            <p class="text-gray-500 text-lg">No recipes found. Try a different search term.</p>
        </div>`;
}

window.displayClickedMealDetails = async function (id) {
  for (const section of mainContentSections) {
    section.classList.add("hidden");
  }
  // meal-details-section
  mainContentSections[3].classList.remove("hidden");
  updateNavbarText(
    navbarText.mealDetails.header,
    navbarText.mealDetails.paragraph,
  );
  window.scrollTo(0, 0);
  let meal = mealsList[getMealById(id)];
  mealToLog = meal;
  displaynutritionFactsMealDetails();
  displayHeroSectionMealDetails(meal);
  displayIngredientsMealDetails(meal.ingredients);
  displayInstructionsMealDetails(meal.instructions);
  changeVideoMealDetails(meal.youtube);
  analyzeResult = await getCaloriesMealDetails(meal);

  displayHeroSectionMealDetails(meal, analyzeResult);
  displaynutritionFactsMealDetails(analyzeResult);
};

function getMealById(id) {
  for (let i = 0; i < mealsList.length; i++) {
    if (mealsList[i].id == id) {
      return i;
    }
  }
}

function displayHeroSectionMealDetails(meal, analyzeResult = 0) {
  let kcal;
  let servings;
  if (analyzeResult == 0) {
    disableLogMealBtn();
    kcal = "Calculating...";
    servings = "Calculating...";
  } else if (analyzeResult.success) {
    enableLogMealBtn();
    kcal = `${analyzeResult.data.perServing.calories} cal/serving`;
    servings = `${analyzeResult.data.servings} servings`;
  } else {
    enableLogMealBtn();
    kcal = "600 cal/serving";
    servings = "2 servings";
  }

  let tags = "";
  if (meal.tags != undefined) {
    for (const element of meal.tags) {
      tags += `<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${element}</span>`;
    }
  }
  mealDetailHero.innerHTML = `<div class="relative h-80 md:h-96">
              <img
                src="${meal.thumbnail}"
                alt="${meal.name}"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                    > ${meal.category}</span
                  >
                  <span
                    class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                    > ${meal.area}</span
                  >
                  ${tags}
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${meal.name}
                </h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>${Math.ceil(meal.ingredients.length / 5) * 15} min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">${servings}</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">${kcal} </span>
                  </span>
                </div>
              </div>
            </div>`;
}

function displayIngredientsMealDetails(ingredientsList) {
  let ingredients = "";
  IngredientsCount.innerHTML = `${ingredientsList.length} items`;
  for (const element of ingredientsList) {
    ingredients += `<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                    <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300">
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">${element.measure}</span> ${element.ingredient}
                    </span>
                  </div>`;
  }

  IngredientsMealDetails.innerHTML = ingredients;
}

function displayInstructionsMealDetails(instructionsList) {
  let instructions = "";
  for (let i = 0; i < instructionsList.length; i++) {
    instructions += `                  <div
                    class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                    >
                      ${i + 1}
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                      ${instructionsList[i]}
                    </p>
                  </div>`;
  }
  InstructionsMealDetails.innerHTML = instructions;
}
function changeVideoMealDetails(src) {
  let source = src.replace("watch?v=", "embed/");
  videoMealDetails.src = source;
}

function displaynutritionFactsMealDetails(analyzeResult = 0) {
  let calPerServing;
  let totalCalories;
  let protein;
  let fat;
  let carbs;
  let fiber;
  let sugar;
  let saturatedFat;
  let cholesterol;
  let sodium;
  if (analyzeResult == 0) {
    nutritionFactsContainerMealDettails.innerHTML = `
            <div class="text-center py-8">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                    <i class="animate-pulse text-emerald-600 text-xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-calculator" data-prefix="fas" data-icon="calculator" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm16 168a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zm80 24a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm128-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zM88 352a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm128-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zm80 24a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM64 424c0-13.3 10.7-24 24-24l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L88 448c-13.3 0-24-10.7-24-24zm232-24c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24z"></path></svg></i>
                </div>
                <p class="text-gray-700 font-medium mb-1">Calculating Nutrition</p>
                <p class="text-sm text-gray-500">Analyzing ingredients...</p>
                <div class="mt-4 flex justify-center">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                </div>
            </div>
`;
    return;
  } else if (analyzeResult.success) {
    let dataPerServings = analyzeResult.data.perServing;

    calPerServing = dataPerServings.calories;
    totalCalories = analyzeResult.data.totals.calories;
    protein = dataPerServings.protein;
    fat = dataPerServings.fat;
    carbs = dataPerServings.carbs;
    fiber = dataPerServings.fiber;
    sugar = dataPerServings.sugar;
    saturatedFat = dataPerServings.saturatedFat;
    cholesterol = dataPerServings.cholesterol;
    sodium = dataPerServings.sodium;
  } else {
    calPerServing = 600;
    totalCalories = 1200;
    protein = 38;
    fat = 16;
    carbs = 3;
    fiber = 2;
    sugar = 3;
    saturatedFat = 1;
    cholesterol = 189;
    sodium = 643;
  }
  nutritionFactsContainerMealDettails.innerHTML = `
            <p class="text-sm text-gray-500 mb-4">Per serving</p>
            
            <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
                <p class="text-sm text-gray-600">Calories per serving</p>
                <p class="text-4xl font-bold text-emerald-600">${calPerServing}</p>
                <p class="text-xs text-gray-500 mt-1">Total: ${totalCalories} cal</p>
            </div>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                    </div>
                    <span class="font-bold text-gray-900">${protein}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width: ${(Math.floor(protein) * 100) / 50 < 100 ? (Math.floor(protein) * 100) / 50 : 100}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                    </div>
                    <span class="font-bold text-gray-900">${carbs}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width:${(Math.floor(carbs) * 100) / 250 < 100 ? (Math.floor(carbs) * 100) / 250 : 100}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${fat}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width:${(Math.floor(fat) * 100) / 65 < 100 ? (Math.floor(fat) * 100) / 65 : 100}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                    </div>
                    <span class="font-bold text-gray-900">${fiber}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width:${(Math.floor(fiber) * 100) / 25 < 100 ? (Math.floor(fiber) * 100) / 25 : 100}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                    </div>
                    <span class="font-bold text-gray-900">${sugar}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width:${(Math.floor(sugar) * 100) / 50 < 100 ? (Math.floor(sugar) * 100) / 50 : 100}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span class="text-gray-700">Saturated Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${saturatedFat}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" style="width:${(Math.floor(saturatedFat) * 100) / 20 < 100 ? (Math.floor(saturatedFat) * 100) / 20 : 100}%"></div>
                </div>
            </div>
            <div class="mt-6 pt-6 border-t border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Other</h3>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${cholesterol}mg</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${sodium}mg</span>
                    </div>
                </div>
            </div>
              `;
}

function PrepareAPIBody(meal) {
  return {
    recipeName: meal.name,
    ingredients: meal.ingredients.map((i) => `${i.measure} ${i.ingredient}`),
  };
}
function displayProducts(list) {
  let products = "";
  let index = 0;
  if (list.length == 0) {
    productsEmpty.classList.remove("hidden");
    productsGrid.innerHTML = "";
    return;
  }
  if (list.length == undefined) {
    list = [list];
  }

  for (const element of list) {
    if (index++ >= 24) break;

    products += ` <div onclick="displayClickedProduct(${element.barcode})"
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${element.barcode}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${element.image}"
                    alt="${element.name}"
                    loading="lazy"
                  />
                  
                  <!-- Nutri-Score Badge -->
                  <div
                    class="absolute top-2 left-2 ${nutritionGradeBgColors[element.nutritionGrade]} text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                    Nutri-Score ${element.nutritionGrade}
                  </div>

                  <!-- NOVA Badge -->
                  <div
                    class="absolute ${element.novaGroup ? "" : "hidden"} ${novaGroupBgColors[element.novaGroup ? element.novaGroup : "noColor"]} top-2 right-2  text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA ${element.novaGroup ? element.novaGroup : ""}"
                  >
                    ${element.novaGroup ? element.novaGroup : ""}
                  </div>
                </div>

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                    ${element.brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                    ${element.name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>${Math.ceil(element.nutrients.calories)} kcal/100g</span
                    >
                  </div>

                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${element.nutrients.protein.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${element.nutrients.carbs.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${element.nutrients.fat.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${element.nutrients.sugar.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>`;
  }
  productsEmpty.classList.add("hidden");
  productsGrid.innerHTML = products;
}

function filterProductsbyNutriScore(grade) {
  if (grade == "all") {
    displayProducts(productsListSearchName);
    updateProductsCount(
      totalCountSearchName,
      productSearchInput.value,
      searchTypes.byName,
    );
  } else {
    let filteredList = productsListSearchName?.filter(
      (product) => product?.nutritionGrade == grade,
    );
    displayProducts(filteredList);
    updateProductsCount(
      filteredList.length,
      productSearchInput.value,
      searchTypes.byName,
    );
  }
}

window.displayProducts = function (barcode) {
  let clickedProduct;
  if (productsList.length == undefined) {
    clickedProduct = productsList;
  } else {
    clickedProduct = productsList.find((product) => product.barcode == barcode);
  }

  productDetailModal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-start gap-6 mb-6">
                <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src="${clickedProduct.image}" alt="${clickedProduct.name}" class="w-full h-full object-contain">
                </div>
                <div class="flex-1">
                    <p class="text-sm text-emerald-600 font-semibold mb-1">${clickedProduct.brand}</p>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${clickedProduct.name}</h2>
                    <p class="text-sm text-gray-500 mb-3">${clickedProduct.barcode}</p>
                    
                    <div class="flex items-center gap-3">
                        
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #03814120">
                                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: #038141">
                                    ${clickedProduct.nutritionGrade}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: #038141">Nutri-Score</p>
                                    <p class="text-[10px] text-gray-600">${nutritionGradeRating[clickedProduct.nutritionGrade]}</p>
                                </div>
                            </div>
                        
                            <div class="${clickedProduct.novaGroup ? "" : "hidden"} flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #ee810020">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: #ee8100">
                                    ${clickedProduct.novaGroup}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: #ee8100">NOVA</p>
                                    <p class="text-[10px] text-gray-600"> ${novaGroupState[clickedProduct.novaGroup]}</p>
                                </div>
                            </div>
                        
                    </div>
                </div>
                <button onclick='closeProductModal()' class="close-product-modal text-gray-400 hover:text-gray-600">
                    <i class="text-2xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-xmark" data-prefix="fas" data-icon="xmark" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"></path></svg></i>
                </button>
            </div>
            
            <!-- Nutrition Facts -->
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-chart-pie" data-prefix="fas" data-icon="chart-pie" role="img" viewBox="0 0 576 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M512.4 240l-176 0c-17.7 0-32-14.3-32-32l0-176c0-17.7 14.4-32.2 31.9-29.9 107 14.2 191.8 99 206 206 2.3 17.5-12.2 31.9-29.9 31.9zM222.6 37.2c18.1-3.8 33.8 11 33.8 29.5l0 197.3c0 5.6 2 11 5.5 15.3L394 438.7c11.7 14.1 9.2 35.4-6.9 44.1-34.1 18.6-73.2 29.2-114.7 29.2-132.5 0-240-107.5-240-240 0-115.5 81.5-211.9 190.2-234.8zM477.8 288l64 0c18.5 0 33.3 15.7 29.5 33.8-10.2 48.4-35 91.4-69.6 124.2-12.3 11.7-31.6 9.2-42.4-3.9L374.9 340.4c-17.3-20.9-2.4-52.4 24.6-52.4l78.2 0z"></path></svg></i>
                    Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                </h3>
                
                <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                    <p class="text-4xl font-bold text-gray-900"> ${Math.ceil(clickedProduct.nutrients.calories)}</p>
                    <p class="text-sm text-gray-500">Calories</p>
                </div>
                
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-emerald-500 h-2 rounded-full" style="width: 2.48%"></div>
                        </div>
                        <p class="text-lg font-bold text-emerald-600">${clickedProduct.nutrients.protein.toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: 6.41%"></div>
                        </div>
                        <p class="text-lg font-bold text-blue-600">${clickedProduct.nutrients.carbs.toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-purple-500 h-2 rounded-full" style="width: 0.16615384615384615%"></div>
                        </div>
                        <p class="text-lg font-bold text-purple-600">${clickedProduct.nutrients.fat.toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-orange-500 h-2 rounded-full" style="width: 4.86%"></div>
                        </div>
                        <p class="text-lg font-bold text-orange-600">${clickedProduct.nutrients.sugar.toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Sugar</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${(clickedProduct.nutrients.fat * 0.4).toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Saturated Fat</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${clickedProduct.nutrients.fiber.toFixed(1)}</p>
                        <p class="text-xs text-gray-500">Fiber</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${(clickedProduct.nutrients.sodium * 2.5).toFixed(2)}g</p>
                        <p class="text-xs text-gray-500">Salt</p>
                    </div>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-3">
                <button onclick='addProductToLog(${barcode})' class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="6111021090049">
                    <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>Log This Food
                </button>
                <button onclick='closeProductModal()' class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Close
                </button>
            </div>
        </div>
      </div>
        `;

  productDetailModal.classList.remove("hidden");
};

window.closeProductModal = function () {
  productDetailModal.classList.add("hidden");
};
function showMealspage() {
  for (const section of mainContentSections) {
    section.classList.add("hidden");
  }
  // search-filters-section
  mainContentSections[0].classList.remove("hidden");
  // meal-categories-section
  mainContentSections[1].classList.remove("hidden");
  // all-recipes-section
  mainContentSections[2].classList.remove("hidden");
  updateNavbarText(navbarText.meals.header, navbarText.meals.paragraph);
}
function showProductspage() {
  for (const section of mainContentSections) {
    section.classList.add("hidden");
  }
  // products-section
  mainContentSections[4].classList.remove("hidden");
  updateNavbarText(
    navbarText.productScanner.header,
    navbarText.productScanner.paragraph,
  );
}

function showFoodLogpage() {
  for (const section of mainContentSections) {
    section.classList.add("hidden");
  }
  // foodlog-section
  mainContentSections[5].classList.remove("hidden");
  updateNavbarText(navbarText.foodLog.header, navbarText.foodLog.paragraph);
}

function displayLoggedItems() {
  let items = "";
  totalLoggedItems.innerHTML = `Logged Items (${loggedItemsList.length})`;
  if (loggedItemsList.length === 0) {
    loggedItems.innerHTML = `<!-- Empty State -->
                <div class="text-center py-8 text-gray-500">
                  <i
                    class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"
                  ></i>
                  <p class="font-medium">No meals logged today</p>
                  <p class="text-sm">
                    Add meals from the Meals page or scan products
                  </p>
                </div>`;
    clearFoodlogBtn.classList.add("hidden");
    updateTotalNutrition();
    updateWeeklyOverview();

    return;
  }
  for (const element of loggedItemsList) {
    items += `<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div class="flex items-center gap-4">
                            ${
                              element.itemType == itemType.recipe
                                ? `<img src="${element.src}" alt="${element.name}" class="w-14 h-14 rounded-xl object-cover">`
                                : `<div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <i class="text-blue-600 text-xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-box" data-prefix="fas" data-icon="box" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"></path></svg></i>
                                </div>`
                            }
                            <div>
                                <p class="font-semibold text-gray-900">${element.name}</p>
                                <p class="text-sm text-gray-500">
                                  ${element.brandOrservings}
                                    <span class="mx-1">•</span>
                                    <span class="${element.itemType == itemType.product ? "text-blue-600" : "text-emerald-600"}">${element.itemType}</span>
                                </p>
                                <p class="text-xs text-gray-400 mt-1">${element.time}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-emerald-600">${element.calories}</p>
                                <p class="text-xs text-gray-500">kcal</p>
                            </div>
                            <div class="hidden md:flex gap-2 text-xs text-gray-500">
                                <span class="px-2 py-1 bg-blue-50 rounded">${element.protein}g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${element.carbs}g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${element.fat}g F</span>
                            </div>
                            <button onclick="deleteItem(${element.id})" class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="0">
                                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash-can" data-prefix="fas" data-icon="trash-can" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"></path></svg></i>
                            </button>
                        </div>
                    </div>`;
  }
  clearFoodlogBtn.classList.remove("hidden");
  updateTotalNutrition();
  updateWeeklyOverview();
  loggedItems.innerHTML = items;
}

window.addProductToLog = function (barcode) {
  let clickedProduct;
  if (productsList.length == undefined) {
    clickedProduct = productsList;
  } else {
    clickedProduct = productsList.find((product) => product.barcode == barcode);
  }

  closeProductModal();
  Swal.fire({
    icon: "success",
    title: "Added!",
    text: `${clickedProduct.name} added to your daily intake!`,
    showConfirmButton: false,
    timer: 1000,
  });
  createItem(clickedProduct);
};

class LoggedItemsClass {
  constructor(
    name,
    brandOrservings,
    itemType,
    calories,
    protein,
    carbs,
    fat,
    src,
  ) {
    this.id = loggedItemsList.length == 0 ? 0 : loggedItemsList.at(-1).id + 1;
    this.name = name;
    this.brandOrservings = brandOrservings;
    this.itemType = itemType;
    this.time = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    this.calories = calories;
    this.protein = protein;
    this.carbs = carbs;
    this.fat = fat;
    this.src = src;
  }
}

function saveInLocalStorage() {
  localStorage.setItem("loggedItemsList", JSON.stringify(loggedItemsList));
}

function createItem(clickedProduct = 0) {
  let item;
  if (clickedProduct) {
    item = new LoggedItemsClass(
      clickedProduct.name,
      clickedProduct.brand,
      itemType.product,
      Math.ceil(clickedProduct.nutrients.calories),
      +clickedProduct.nutrients.protein.toFixed(1),
      +clickedProduct.nutrients.carbs.toFixed(1),
      +(clickedProduct.nutrients.fat * 0.4).toFixed(1),
      null,
    );
  } else {
    let calPerServing;
    let protein;
    let fat;
    let carbs;
    if (analyzeResult.success) {
      let dataPerServings = analyzeResult.data.perServing;
      calPerServing = dataPerServings.calories;
      protein = dataPerServings.protein;
      fat = dataPerServings.fat;
      carbs = dataPerServings.carbs;
    } else {
      calPerServing = 600;
      protein = 38;
      fat = 16;
      carbs = 3;
    }
    let mealServingsMealModal = document.querySelector("#meal-servings");
    let servingsMeal = mealServingsMealModal.value;
    item = new LoggedItemsClass(
      mealToLog.name,
      servingsMeal,
      itemType.recipe,
      calPerServing * servingsMeal,
      protein * servingsMeal,
      carbs * servingsMeal,
      fat * servingsMeal,
      mealToLog.thumbnail,
    );
  }
  loggedItemsList.push(item);
  saveInLocalStorage();
  displayLoggedItems();
}
window.deleteItem = function (id) {
  let index = getItemIndex(id);
  let itemName = loggedItemsList[index].name;

  loggedItemsList.splice(index, 1);
  saveInLocalStorage();
  displayLoggedItems();

  Swal.fire({
    icon: "success",
    title: "Removed!",
    text: `${itemName} removed from log!`,
    showConfirmButton: false,
    timer: 1000,
  });
};
function updateTotalNutrition() {
  let calories = 0;
  let carbs = 0;
  let fat = 0;
  let protein = 0;
  for (const item of loggedItemsList) {
    calories += item.calories;
    carbs += item.carbs;
    fat += item.fat;
    protein += item.protein;
  }

  totalCalories.innerHTML = `${Math.floor(calories)} / 2000 kcal`;
  totalCaloriesPercent.style.cssText = `width: ${(Math.floor(calories) * 100) / 2000 < 100 ? (Math.floor(calories) * 100) / 2000 : 100}%`;
  totalCarbs.innerHTML = `${Math.floor(carbs)} / 250 g`;
  totalCarbsPercent.style.cssText = `width: ${(Math.floor(carbs) * 100) / 250 < 100 ? (Math.floor(carbs) * 100) / 250 : 100}%`;
  totalFat.innerHTML = `${Math.floor(fat)} / 65 g`;
  totalFatPercent.style.cssText = `width: ${(Math.floor(fat) * 100) / 65 < 100 ? (Math.floor(fat) * 100) / 65 : 100}%`;
  totalProtein.innerHTML = `${Math.floor(protein)} / 50 g`;
  totalProteinPercent.style.cssText = `width: ${(Math.floor(protein) * 100) / 50 < 100 ? (Math.floor(protein) * 100) / 50 : 100}%`;
}

function getItemIndex(id) {
  for (let i = 0; i < loggedItemsList.length; i++) {
    if (loggedItemsList[i].id == id) return i;
  }
}
function updateFoodlogDatePeriodically() {
  const dateToday = new Date().toISOString().split("T")[0];

  if (weekData.today != dateToday) {
    weekData.today = dateToday;
    localStorage.setItem("weekData", JSON.stringify(weekData));

    loggedItemsList = [];

    saveInLocalStorage();
    foodlogDate.innerHTML = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    let nearestTuesday = new Date(
      dateNow.setDate(dateNow.getDate() - ((dateNow.getDay() + 5) % 7)),
    )
      .toISOString()
      .split("T")[0];
    if (weekData.TuesdayDate != nearestTuesday) {
      weekData = {
        TuesdayDate: nearestTuesday,
        today: dateToday,
        Tue: { kcal: 0, itemsCount: 0 },
        Wed: { kcal: 0, itemsCount: 0 },
        Thu: { kcal: 0, itemsCount: 0 },
        Fri: { kcal: 0, itemsCount: 0 },
        Sat: { kcal: 0, itemsCount: 0 },
        Sun: { kcal: 0, itemsCount: 0 },
        Mon: { kcal: 0, itemsCount: 0 },
      };
      localStorage.setItem("weekData", JSON.stringify(weekData));
    }
    displayLoggedItems();
  }
  setTimeout(updateFoodlogDatePeriodically, 60000);
}

function disableLogMealBtn() {
  logMealBtn.innerHTML = `<i data-fa-i2svg=""><svg class="svg-inline--fa fa-spinner fa-spin" data-prefix="fas" data-icon="spinner" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M208 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm0 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM48 208a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm368 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM75 369.1A48 48 0 1 1 142.9 437 48 48 0 1 1 75 369.1zM75 75A48 48 0 1 1 142.9 142.9 48 48 0 1 1 75 75zM437 369.1A48 48 0 1 1 369.1 437 48 48 0 1 1 437 369.1z"></path></svg></i>
                          <span>Calculating...</span>`;
  logMealBtn.classList.remove("bg-blue-600", "text-white", "hover:bg-blue-700");
  logMealBtn.classList.add(
    "bg-gray-300",
    "text-gray-500",
    "cursor-not-allowed",
  );
  logMealBtn.disabled = true;
}
function enableLogMealBtn() {
  logMealBtn.innerHTML = ` <i class="fa-solid fa-clipboard-list"></i>
              <span>Log This Meal</span>`;
  logMealBtn.classList.add("bg-blue-600", "text-white", "hover:bg-blue-700");
  logMealBtn.classList.remove(
    "bg-gray-300",
    "text-gray-500",
    "cursor-not-allowed",
  );
  logMealBtn.disabled = false;
}

function displayLogMealModal() {
  let calPerServing;
  let protein;
  let fat;
  let carbs;
  if (analyzeResult.success) {
    let dataPerServings = analyzeResult.data.perServing;
    calPerServing = dataPerServings.calories;
    protein = dataPerServings.protein;
    fat = dataPerServings.fat;
    carbs = dataPerServings.carbs;
  } else {
    calPerServing = 600;
    protein = 38;
    fat = 16;
    carbs = 3;
  }
  logMealModal.innerHTML = `<div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div class="flex items-center gap-4 mb-6">
                    <img src="${mealToLog.thumbnail}" alt="${mealToLog.name}" class="w-16 h-16 rounded-xl object-cover">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
                        <p class="text-gray-500 text-sm">${mealToLog.name}</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
                    <div class="flex items-center gap-3">
                        <button onclick="decreaseServings()" id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-minus" data-prefix="fas" data-icon="minus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"></path></svg></i>
                        </button>
                        <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5" class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2">
                        <button onclick="increaseServing()" id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>
                        </button>
                    </div>
                </div>
                
                
                <div class="bg-emerald-50 rounded-xl p-4 mb-6">
                    <p class="text-sm text-gray-600 mb-2">Estimated nutrition per serving:</p>
                    <div class="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <p class="text-lg font-bold text-emerald-600" id="modal-calories">${calPerServing}</p>
                            <p class="text-xs text-gray-500">Calories</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-blue-600" id="modal-protein">${protein}g</p>
                            <p class="text-xs text-gray-500">Protein</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-amber-600" id="modal-carbs">${carbs}g</p>
                            <p class="text-xs text-gray-500">Carbs</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-purple-600" id="modal-fat">${fat}g</p>
                            <p class="text-xs text-gray-500">Fat</p>
                        </div>
                    </div>
                </div>
                
                
                <div class="flex gap-3">
                    <button onclick="closeLogMealModal()" id="cancel-log-meal" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                        Cancel
                    </button>
                    <button onclick="addMealToLoggedItems()" id="confirm-log-meal" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                        <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-clipboard-list" data-prefix="fas" data-icon="clipboard-list" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M311.4 32l8.6 0c35.3 0 64 28.7 64 64l0 352c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l8.6 0C83.6 12.9 104.3 0 128 0L256 0c23.7 0 44.4 12.9 55.4 32zM248 112c13.3 0 24-10.7 24-24s-10.7-24-24-24L136 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32 0c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zm0 128c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zM96 416a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg></i>
                        Log Meal
                    </button>
                </div>
            </div>`;

  logMealModal.classList.remove("hidden");
}

window.closeLogMealModal = function () {
  logMealModal.classList.add("hidden");
};

window.addMealToLoggedItems = function () {
  closeLogMealModal();
  let mealServingsMealModal = document.querySelector("#meal-servings");
  Swal.fire({
    icon: "success",
    title: "Meal Logged!",
    html: `
    <p>${mealToLog.name} (${mealServingsMealModal.value} servings) has been added to your daily log!</p>
      <p style="color:#2eaf7d;">+1076 calories</p>
    `,
    showConfirmButton: false,
    timer: 1000,
  });
  createItem();
};
function MealsLoadingState() {
  recipesGrid.innerHTML = `<div class="flex items-center justify-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"
            ></div>
          </div>`;
}

window.increaseServing = function () {
  let mealServingsMealModal = document.querySelector("#meal-servings");
  if (mealServingsMealModal.value < 10) {
    mealServingsMealModal.value = +mealServingsMealModal.value + 0.5;
  }
};

window.decreaseServings = function () {
  let mealServingsMealModal = document.querySelector("#meal-servings");
  if (mealServingsMealModal.value > 0.5) {
    mealServingsMealModal.value = +mealServingsMealModal.value - 0.5;
  }
};
function updateProductsCount(total = 0, term, searchType) {
  //Found 86 products for "aicha"
  //Found product: Weetabix
  //Found 24654 products in breakfast cereals

  switch (searchType) {
    case searchTypes.byName:
      if (total == 0) {
        productsCount.innerHTML = `No products found for "${term}"`;
      } else {
        productsCount.innerHTML = `Found ${total} products for "${term}"`;
      }

      break;
    case searchTypes.byBarcode:
      if (total == 0) {
        productsCount.innerHTML = `No product found with barcode: ${term}`;
      } else {
        productsCount.innerHTML = `Found product: ${term}`;
      }
      break;
    case searchTypes.byCategory:
      productsCount.innerHTML = `Found ${total} products in ${term}`;
      break;
    case searchTypes.noResults:
      productsCount.innerHTML = `Search for products to see results`;
      break;
  }
}

function updateWeeklyOverview() {
  let calories = loggedItemsList.reduce(
    (sum, item) => (sum += item.calories),
    0,
  );
  let today = new Date().toLocaleDateString("en-Us", { weekday: "short" });
  weekData[today].kcal = Math.floor(calories);
  weekData[today].itemsCount = loggedItemsList.length;
  localStorage.setItem("weekData", JSON.stringify(weekData));

  const startDate = new Date(weekData.TuesdayDate);

  const Days = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + offset);
    return d.getDate();
  });

  weeklyChart.innerHTML = `
<div class="grid grid-cols-7 gap-2">
                        
                            <div class="text-center ${today === "Tue" ? "bg-indigo-100 rounded-xl" : ""} ">
                                <p class="text-xs text-gray-500 mb-1">Tue</p>
                                <p class="text-sm font-medium text-gray-900">${Days[0]}</p>
                                <div class="mt-2 ${weekData.Tue.kcal > 0 ? "text-emerald-600" : "text-gray-300"} ">
                                    <p class="text-lg font-bold">${weekData.Tue.kcal}</p>
                                    <p class="text-xs">kcal</p>
                                </div>
                                <p class="${weekData.Tue.itemsCount == 0 ? "hidden" : ""} text-xs text-gray-400 mt-1">${weekData.Tue.itemsCount} items</p>
                            </div>
                        
                            <div class="text-center ${today === "Wed" ? "bg-indigo-100 rounded-xl" : ""}">
                                <p class="text-xs text-gray-500 mb-1">Wed</p>
                                <p class="text-sm font-medium text-gray-900">${Days[1]}</p>
                                <div class="mt-2 ${weekData.Wed.kcal > 0 ? "text-emerald-600" : "text-gray-300"}">
                                    <p class="text-lg font-bold">${weekData.Wed.kcal}</p>
                                    <p class="text-xs">kcal</p>
                                </div>
                                <p class="${weekData.Wed.itemsCount == 0 ? "hidden" : ""} text-xs text-gray-400 mt-1">${weekData.Wed.itemsCount} items</p>
                            </div>
                        
                            <div class="text-center ${today === "Thu" ? "bg-indigo-100 rounded-xl" : ""}">
                                <p class="text-xs text-gray-500 mb-1">Thu</p>
                                <p class="text-sm font-medium text-gray-900">${Days[2]}</p>
                                <div class="mt-2 ${weekData.Thu.kcal > 0 ? "text-emerald-600" : "text-gray-300"}">
                                    <p class="text-lg font-bold">${weekData.Thu.kcal}</p>
                                    <p class="text-xs">kcal</p>
                                </div>
                                <p class="${weekData.Thu.itemsCount == 0 ? "hidden" : ""} text-xs text-gray-400 mt-1">${weekData.Thu.itemsCount} items</p>
                            </div>
                        
                            <div class="text-center ${today === "Fri" ? "bg-indigo-100 rounded-xl" : ""}">
                                <p class="text-xs text-gray-500 mb-1">Fri</p>
                                <p class="text-sm font-medium text-gray-900">${Days[3]}</p>
                                <div class="mt-2 ${weekData.Fri.kcal > 0 ? "text-emerald-600" : "text-gray-300"}">
                                    <p class="text-lg font-bold">${weekData.Fri.kcal}</p>
                                    <p class="text-xs">kcal</p>
                                </div>
                                <p class="${weekData.Fri.itemsCount == 0 ? "hidden" : ""} text-xs text-gray-400 mt-1">${weekData.Fri.itemsCount} items</p>
                            </div>
                        
                            <div class="text-center ${today === "Sat" ? "bg-indigo-100 rounded-xl" : ""}">
                                <p class="text-xs text-gray-500 mb-1">Sat</p>
                                <p class="text-sm font-medium text-gray-900">${Days[4]}</p>
                                <div class="mt-2 ${weekData.Sat.kcal > 0 ? "text-emerald-600" : "text-gray-300"}">
                                    <p class="text-lg font-bold">${weekData.Sat.kcal}</p>
                                    <p class="text-xs">kcal</p>
                                </div>
                                <p class="${weekData.Sat.itemsCount == 0 ? "hidden" : ""} text-xs text-gray-400 mt-1">${weekData.Sat.itemsCount} items</p>
                            </div>

                            <div class="text-center ${today === "Sun" ? "bg-indigo-100 rounded-xl" : ""}">
                                <p class="text-xs text-gray-500 mb-1">Sun</p>
                                <p class="text-sm font-medium text-gray-900">${Days[5]}</p>
                                <div class="mt-2 ${weekData.Sun.kcal > 0 ? "text-emerald-600" : "text-gray-300"}">
                                    <p class="text-lg font-bold">${weekData.Sun.kcal}</p>
                                    <p class="text-xs">kcal</p>
                                </div>
                                <p class="${weekData.Sun.itemsCount == 0 ? "hidden" : ""} text-xs text-gray-400 mt-1">${weekData.Sun.itemsCount} items</p>
                            </div>
                        
                            <div class="text-center ${today === "Mon" ? "bg-indigo-100 rounded-xl" : ""}">
                                <p class="text-xs text-gray-500 mb-1">Mon</p>
                                <p class="text-sm font-medium text-gray-900">${Days[6]}</p>
                                <div class="mt-2 ${weekData.Mon.kcal > 0 ? "text-emerald-600" : "text-gray-300"}">
                                    <p class="text-lg font-bold">${weekData.Mon.kcal}</p>
                                    <p class="text-xs">kcal</p>
                                </div>
                                <p class="${weekData.Mon.itemsCount == 0 ? "hidden" : ""} text-xs text-gray-400 mt-1">${weekData.Mon.itemsCount} items</p>
                            </div>
                        
                    </div>`;
}
