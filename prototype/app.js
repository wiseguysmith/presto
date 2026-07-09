const categories = ["Popular", "Starters", "Mains", "Dessert", "Drinks"];

const menuItems = [
  {
    id: "burrata",
    name: "Charred Peach Burrata",
    category: "Starters",
    description: "Creamy burrata, basil oil, pistachio, grilled local peaches.",
    price: 16,
    popular: true,
    color: "#f0b45f",
    available: true,
  },
  {
    id: "salmon",
    name: "Citrus Miso Salmon",
    category: "Mains",
    description: "Ora king salmon, yuzu miso glaze, sesame greens, jasmine rice.",
    price: 32,
    popular: true,
    color: "#e77653",
    available: true,
  },
  {
    id: "pasta",
    name: "Truffle Mafaldine",
    category: "Mains",
    description: "Hand-cut ribbons, black truffle, parmesan cream, chives.",
    price: 28,
    popular: true,
    color: "#d8c18a",
    available: true,
  },
  {
    id: "tacos",
    name: "Crispy Baja Tacos",
    category: "Mains",
    description: "Tempura cod, lime crema, shaved cabbage, salsa verde.",
    price: 21,
    popular: false,
    color: "#8fbe72",
    available: true,
  },
  {
    id: "cake",
    name: "Olive Oil Citrus Cake",
    category: "Dessert",
    description: "Whipped mascarpone, preserved lemon, candied almond.",
    price: 12,
    popular: true,
    color: "#f2d576",
    available: true,
  },
  {
    id: "spritz",
    name: "Garden Spritz",
    category: "Drinks",
    description: "Cucumber, elderflower, lime, sparkling mineral water.",
    price: 11,
    popular: false,
    color: "#93c7a7",
    available: true,
  },
];

const orders = [
  { id: 1084, table: 4, status: "New", time: "2m", total: 74, notes: "Anniversary. Send dessert menu.", items: ["1 Burrata", "2 Salmon"] },
  { id: 1085, table: 9, status: "Preparing", time: "8m", total: 49, notes: "Shellfish allergy.", items: ["1 Mafaldine", "1 Garden Spritz"] },
  { id: 1086, table: 2, status: "Ready", time: "13m", total: 63, notes: "No cilantro.", items: ["2 Baja Tacos", "1 Citrus Cake"] },
  { id: 1087, table: 12, status: "New", time: "Now", total: 0, notes: "VIP tasting lead.", items: ["Pending guest order"] },
  { id: 1081, table: 7, status: "Completed", time: "24m", total: 112, notes: "Google review prompted.", items: ["2 Mafaldine", "2 Spritz", "1 Cake"] },
];

const feedback = [
  { rating: "5/5", table: "Table 7", text: "The QR flow was faster than waiting for a server, and the salmon was perfect.", action: "Google review clicked" },
  { rating: "3/5", table: "Table 3", text: "Loved the drinks, but entree timing felt uneven.", action: "Private recovery" },
  { rating: "5/5", table: "Table 11", text: "Easy ordering, allergy note handled beautifully.", action: "Google review clicked" },
  { rating: "2/5", table: "Table 5", text: "Dessert arrived cold. Manager follow-up requested.", action: "Private recovery" },
];

const state = {
  route: "guest",
  category: "Popular",
  query: "",
  cart: {},
  statusIndex: -1,
  draggedOrder: null,
};

const statuses = ["New", "Preparing", "Cooking", "Ready", "Delivered"];
const kanbanStatuses = ["New", "Preparing", "Ready", "Completed"];

const money = (value) => `$${value.toFixed(2)}`;
const byId = (id) => document.getElementById(id);

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function setRoute(route) {
  state.route = route;
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.dataset.view === route));
  document.querySelectorAll(".rail-nav a").forEach((link) => link.classList.toggle("active", link.dataset.route === route));
  history.replaceState(null, "", `#${route}`);
}

function renderCategories() {
  byId("categoryTabs").innerHTML = categories
    .map((category) => `<button class="${category === state.category ? "active" : ""}" data-category="${category}" role="tab">${category}</button>`)
    .join("");
}

function filteredMenu() {
  return menuItems.filter((item) => {
    const matchesCategory = state.category === "Popular" ? item.popular : item.category === state.category;
    const matchesSearch = `${item.name} ${item.description}`.toLowerCase().includes(state.query.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderMenu() {
  renderCategories();
  const items = filteredMenu();
  byId("menuGrid").innerHTML = items
    .map(
      (item) => `
        <article class="menu-card">
          <div class="dish-art" style="--dish-color: ${item.color}"></div>
          <div class="menu-card-body">
            <div class="price-row">
              <h3>${item.name}</h3>
              <strong>${money(item.price)}</strong>
            </div>
            <p>${item.description}</p>
            <span class="availability ${item.available ? "" : "off"}">${item.available ? "Available" : "Sold out"}</span>
            <button class="primary-btn" data-add="${item.id}" ${item.available ? "" : "disabled"}>Add to order</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function cartEntries() {
  return Object.entries(state.cart).map(([id, quantity]) => ({
    ...menuItems.find((item) => item.id === id),
    quantity,
  }));
}

function renderCart() {
  const entries = cartEntries();
  const subtotal = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;
  const count = entries.reduce((sum, item) => sum + item.quantity, 0);

  byId("cartCount").textContent = `${count} ${count === 1 ? "item" : "items"}`;
  byId("cartCount").classList.toggle("hot", count > 0);
  byId("subtotal").textContent = money(subtotal);
  byId("tax").textContent = money(tax);
  byId("total").textContent = money(total);

  byId("cartItems").className = entries.length ? "cart-items" : "cart-items empty-state";
  byId("cartItems").innerHTML = entries.length
    ? entries
        .map(
          (item) => `
            <div class="item-row">
              <div>
                <strong>${item.name}</strong>
                <small>${money(item.price)} each</small>
              </div>
              <div class="qty-controls">
                <button class="icon-btn" aria-label="Remove one ${item.name}" data-dec="${item.id}">-</button>
                <strong>${item.quantity}</strong>
                <button class="icon-btn" aria-label="Add one ${item.name}" data-add="${item.id}">+</button>
              </div>
            </div>
          `,
        )
        .join("")
    : "Add a dish to begin.";
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  renderCart();
  showToast("Added to Table 12 order");
}

function decCart(id) {
  if (!state.cart[id]) return;
  state.cart[id] -= 1;
  if (state.cart[id] <= 0) delete state.cart[id];
  renderCart();
}

function renderOrderProgress() {
  const label = statuses[Math.max(state.statusIndex, 0)] || "New";
  byId("statusLabel").textContent = label;
  byId("progressSteps").innerHTML = statuses
    .map((status, index) => `<span class="step ${index <= state.statusIndex ? "active" : ""}" title="${status}"></span>`)
    .join("");
}

function submitOrder() {
  if (!cartEntries().length) {
    showToast("Add at least one item before submitting");
    return;
  }
  const submitted = cartEntries().map((item) => `${item.quantity} ${item.name}`);
  const tableOrder = orders.find((order) => order.id === 1087);
  tableOrder.items = submitted;
  tableOrder.total = cartEntries().reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.0825;
  tableOrder.notes = byId("orderNotes").value || "No notes";
  state.statusIndex = 0;
  byId("orderStatus").hidden = false;
  byId("ratingBox").hidden = true;
  renderOrderProgress();
  renderKanban();
  renderKitchen();
  showToast("Order #1087 sent to the kitchen");

  [1, 2, 3].forEach((step) => {
    window.setTimeout(() => {
      state.statusIndex = step;
      tableOrder.status = statuses[step] === "Cooking" ? "Preparing" : statuses[step];
      renderOrderProgress();
      renderKanban();
      renderKitchen();
      showToast(`Order moved to ${statuses[step]}`);
    }, step * 2800);
  });
}

function renderStars(selected = 0) {
  byId("stars").innerHTML = [1, 2, 3, 4, 5]
    .map((rating) => `<button class="${rating <= selected ? "active" : ""}" data-rating="${rating}" aria-label="${rating} stars">${rating}</button>`)
    .join("");
}

function renderKanban() {
  byId("kanban").innerHTML = kanbanStatuses
    .map((status) => {
      const statusOrders = orders.filter((order) => order.status === status);
      return `
        <section class="kanban-column" data-drop-status="${status}">
          <header><span>${status}</span><span>${statusOrders.length}</span></header>
          ${statusOrders
            .map(
              (order) => `
                <article class="order-card" draggable="true" data-order-id="${order.id}">
                  <div class="price-row"><strong>#${order.id} · Table ${order.table}</strong><span>${order.time}</span></div>
                  <ul class="order-items">${order.items.map((item) => `<li>${item}</li>`).join("")}</ul>
                  <small>${order.notes}</small>
                  <strong>${money(order.total)}</strong>
                </article>
              `,
            )
            .join("")}
        </section>
      `;
    })
    .join("");
}

function renderKitchen() {
  const activeOrders = orders.filter((order) => ["New", "Preparing", "Ready"].includes(order.status));
  byId("kitchenGrid").innerHTML = activeOrders
    .map(
      (order, index) => `
        <article class="kitchen-card ${order.status === "Ready" ? "ready" : ""}">
          <div class="price-row"><h2>Table ${order.table}</h2><span class="status-chip hot">${order.status}</span></div>
          <div class="timer">${index === 0 ? "02:14" : index === 1 ? "08:33" : "13:02"}</div>
          <ul class="order-items">${order.items.map((item) => `<li>${item}</li>`).join("")}</ul>
          <small>${order.notes}</small>
          <button class="primary-btn" data-kitchen-next="${order.id}">Move forward</button>
        </article>
      `,
    )
    .join("");
}

function renderManager() {
  byId("menuManager").innerHTML = menuItems
    .map(
      (item) => `
        <article class="manager-item">
          <div class="manager-top"><strong>${item.name}</strong><strong>${money(item.price)}</strong></div>
          <small>${item.category}</small>
          <p>${item.description}</p>
          <span class="availability ${item.available ? "" : "off"}">${item.available ? "Available" : "Archived / sold out"}</span>
          <button class="ghost-btn" data-edit-item="${item.id}">Edit item</button>
        </article>
      `,
    )
    .join("");
}

function renderTables(seed = 0) {
  byId("tableGrid").innerHTML = Array.from({ length: 12 }, (_, index) => {
    const table = index + 1;
    const active = [2, 4, 9, 12].includes(table);
    return `
      <article class="table-card">
        <div class="price-row"><h2>Table ${table}</h2><span class="status-chip ${active ? "hot" : ""}">${active ? "Active" : "Idle"}</span></div>
        <div class="qr" style="transform: rotate(${(seed + table) % 4}deg)"></div>
        <small>/restaurant/solana/table/${table}</small>
        <button class="ghost-btn">Download QR</button>
      </article>
    `;
  }).join("");
}

function renderReviews() {
  byId("feedbackList").innerHTML = feedback
    .map(
      (item) => `
        <div class="feedback-row">
          <strong>${item.rating}</strong>
          <div><strong>${item.table}</strong><p>${item.text}</p></div>
          <span class="status-chip ${item.rating.startsWith("5") ? "hot" : ""}">${item.action}</span>
        </div>
      `,
    )
    .join("");
}

function renderAnalytics() {
  const bars = [
    ["11a", 42],
    ["12p", 72],
    ["1p", 56],
    ["5p", 64],
    ["6p", 92],
    ["7p", 100],
    ["8p", 78],
  ];
  byId("barChart").innerHTML = bars.map(([label, height]) => `<div class="bar" style="height:${height}%">${label}</div>`).join("");
  byId("topSellers").innerHTML = [
    ["Citrus Miso Salmon", 92],
    ["Truffle Mafaldine", 84],
    ["Charred Peach Burrata", 76],
    ["Garden Spritz", 63],
  ]
    .map((seller) => `<div class="seller"><strong>${seller[0]}</strong><span>${seller[1]} sold</span><div class="seller-line"><span style="width:${seller[1]}%"></span></div></div>`)
    .join("");
}

function moveOrderForward(id) {
  const order = orders.find((item) => item.id === Number(id));
  if (!order) return;
  const next = { New: "Preparing", Preparing: "Ready", Ready: "Completed" }[order.status];
  if (next) {
    order.status = next;
    renderKanban();
    renderKitchen();
    showToast(`Order #${id} moved to ${next}`);
  }
}

document.addEventListener("click", (event) => {
  const routeLink = event.target.closest("[data-route]");
  const categoryButton = event.target.closest("[data-category]");
  const addButton = event.target.closest("[data-add]");
  const decButton = event.target.closest("[data-dec]");
  const ratingButton = event.target.closest("[data-rating]");
  const kitchenButton = event.target.closest("[data-kitchen-next]");

  if (routeLink) {
    event.preventDefault();
    setRoute(routeLink.dataset.route);
  }
  if (categoryButton) {
    state.category = categoryButton.dataset.category;
    renderMenu();
  }
  if (addButton) addToCart(addButton.dataset.add);
  if (decButton) decCart(decButton.dataset.dec);
  if (kitchenButton) moveOrderForward(kitchenButton.dataset.kitchenNext);
  if (event.target.matches("[data-scroll-menu]")) document.querySelector(".menu-panel").scrollIntoView({ behavior: "smooth" });
  if (event.target.matches("[data-demo-submit]")) {
    addToCart("burrata");
    addToCart("salmon");
    submitOrder();
  }
  if (event.target.id === "submitOrder") submitOrder();
  if (event.target.id === "rateMeal") {
    byId("ratingBox").hidden = false;
    renderStars();
  }
  if (ratingButton) {
    const rating = Number(ratingButton.dataset.rating);
    renderStars(rating);
    const positive = rating >= 4;
    byId("ratingMessage").textContent = positive
      ? "We're so glad you enjoyed your meal. PRESTO routes happy guests toward public reviews at exactly the right moment."
      : "Thanks for being candid. PRESTO keeps this private and alerts the manager so the team can recover the experience.";
    byId("reviewAction").hidden = !positive;
  }
  if (event.target.id === "reviewAction") showToast("Opening Google Review handoff");
  if (event.target.id === "advanceKitchen") moveOrderForward(orders.find((order) => ["New", "Preparing", "Ready"].includes(order.status))?.id);
  if (event.target.id === "toggleSoldOut") {
    const salmon = menuItems.find((item) => item.id === "salmon");
    salmon.available = !salmon.available;
    renderMenu();
    renderManager();
    showToast(`Salmon marked ${salmon.available ? "available" : "sold out"}`);
  }
  if (event.target.id === "regenQr") {
    renderTables(Date.now());
    showToast("QR codes regenerated");
  }
  if (event.target.matches("[data-edit-item]")) showToast("Prototype edit drawer would open here");
});

document.addEventListener("input", (event) => {
  if (event.target.id === "menuSearch") {
    state.query = event.target.value;
    renderMenu();
  }
});

document.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-order-id]");
  if (!card) return;
  state.draggedOrder = Number(card.dataset.orderId);
});

document.addEventListener("dragover", (event) => {
  if (event.target.closest("[data-drop-status]")) event.preventDefault();
});

document.addEventListener("drop", (event) => {
  const column = event.target.closest("[data-drop-status]");
  if (!column || !state.draggedOrder) return;
  const order = orders.find((item) => item.id === state.draggedOrder);
  order.status = column.dataset.dropStatus;
  state.draggedOrder = null;
  renderKanban();
  renderKitchen();
  showToast(`Order #${order.id} moved to ${order.status}`);
});

window.addEventListener("hashchange", () => setRoute(location.hash.slice(1) || "guest"));

function init() {
  byId("serviceClock").textContent = `Live at ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  renderMenu();
  renderCart();
  renderOrderProgress();
  renderKanban();
  renderKitchen();
  renderManager();
  renderTables();
  renderReviews();
  renderAnalytics();
  setRoute(location.hash.slice(1) || "guest");
}

init();
