// Dessert & Soul menu — sample cafe pricing in INR, suitable as a starter menu for Coimbatore.
const products = [
  // SOUTH INDIAN — 10 items
  {id:1,name:"Idli (2 pcs)",description:"Soft steamed rice cakes · sambar · 2 chutneys",price:45,category:"South Indian",photo:"photo-idli",tag:"POPULAR"},
  {id:2,name:"Ghee Podi Idli",description:"Mini idlis tossed in house podi · ghee",price:85,category:"South Indian",photo:"photo-idli"},
  {id:3,name:"Crispy Masala Dosa",description:"Golden dosa · potato masala · sambar · chutneys",price:95,category:"South Indian",photo:"photo-dosa"},
  {id:4,name:"Ghee Roast Dosa",description:"Crisp paper dosa finished with aromatic ghee",price:110,category:"South Indian",photo:"photo-dosa",tag:"HOUSE FAVOURITE"},
  {id:5,name:"Pongal",description:"Pepper-cumin ven pongal · sambar · coconut chutney",price:85,category:"South Indian",photo:"photo-pongal"},
  {id:6,name:"Poori Masala (2 pcs)",description:"Fluffy pooris · potato masala · pickle",price:90,category:"South Indian",photo:"photo-poori"},
  {id:7,name:"Onion Uthappam",description:"Soft rice-lentil pancake · onion · green chilli",price:100,category:"South Indian",photo:"photo-uthappam"},
  {id:8,name:"Medu Vada (2 pcs)",description:"Crispy outside · soft centre · sambar · chutney",price:60,category:"South Indian",photo:"photo-vada"},
  {id:9,name:"Lemon Rice",description:"Tempered rice · lemon · peanuts · papad",price:90,category:"South Indian",photo:"photo-rice"},
  {id:10,name:"Curd Rice",description:"Creamy curd rice · tempered spices · pickle",price:80,category:"South Indian",photo:"photo-rice"},

  // CHINESE — 10 items
  {id:11,name:"Veg Fried Rice",description:"Wok-tossed rice · vegetables · spring onion",price:140,category:"Chinese",photo:"photo-friedrice",tag:"POPULAR"},
  {id:12,name:"Paneer Fried Rice",description:"Wok-fried rice · paneer · peppers · soy",price:170,category:"Chinese",photo:"photo-friedrice"},
  {id:13,name:"Veg Hakka Noodles",description:"Stir-fried noodles · crunchy vegetables · mild sauces",price:150,category:"Chinese",photo:"photo-noodles"},
  {id:14,name:"Schezwan Fried Rice",description:"Spicy wok-fried rice · house Schezwan sauce",price:160,category:"Chinese",photo:"photo-friedrice"},
  {id:15,name:"Chilli Paneer",description:"Paneer cubes · peppers · onion · Indo-Chinese sauce",price:190,category:"Chinese",photo:"photo-chillipaneer"},
  {id:16,name:"Gobi Manchurian",description:"Crisp cauliflower · ginger-garlic · Manchurian glaze",price:150,category:"Chinese",photo:"photo-manchurian"},
  {id:17,name:"Veg Manchow Soup",description:"Hot savoury soup · vegetables · crispy noodles",price:110,category:"Chinese",photo:"photo-soup"},
  {id:18,name:"Spring Rolls (4 pcs)",description:"Crispy pastry rolls · seasoned vegetable filling",price:130,category:"Chinese",photo:"photo-springroll"},
  {id:19,name:"Schezwan Noodles",description:"Noodles tossed in spicy Schezwan sauce · vegetables",price:160,category:"Chinese",photo:"photo-noodles"},
  {id:20,name:"Crispy Corn",description:"Golden corn kernels · pepper · chilli · herbs",price:130,category:"Chinese",photo:"photo-corn"},

  // REGULAR DRINKS — 10 items
  {id:21,name:"Filter Coffee",description:"Traditional South Indian degree coffee",price:35,category:"Drinks",photo:"photo-coffee",tag:"CAFE CLASSIC"},
  {id:22,name:"Masala Tea",description:"Freshly brewed tea · ginger · cardamom",price:30,category:"Drinks",photo:"photo-tea"},
  {id:23,name:"Fresh Lime Soda",description:"Fresh lime · soda · sweet or salted",price:65,category:"Drinks",photo:"photo-lime"},
  {id:24,name:"Lime Mint Cooler",description:"Fresh lime · mint · chilled soda",price:80,category:"Drinks",photo:"photo-lime"},
  {id:25,name:"Cold Coffee",description:"Chilled coffee · milk · light sweetness",price:110,category:"Drinks",photo:"photo-coldcoffee"},
  {id:26,name:"Iced Americano",description:"Double espresso · chilled water · ice",price:100,category:"Drinks",photo:"photo-icedcoffee"},
  {id:27,name:"Classic Cappuccino",description:"Espresso · steamed milk · soft foam",price:120,category:"Drinks",photo:"photo-coffee"},
  {id:28,name:"Hot Chocolate",description:"Creamy cocoa · steamed milk · chocolate",price:130,category:"Drinks",photo:"photo-hotchocolate"},
  {id:29,name:"Mango Milkshake",description:"Mango · chilled milk · ice cream",price:130,category:"Drinks",photo:"photo-milkshake"},
  {id:30,name:"Oreo Milkshake",description:"Oreo cookies · chilled milk · ice cream",price:140,category:"Drinks",photo:"photo-milkshake"}
];

let activeCategory = "All";
let cart = [];
const $ = (selector) => document.querySelector(selector);
const toast = (message) => {
  $("#toastMessage").textContent = message;
  $("#toastMessage").classList.add("show");
  setTimeout(() => $("#toastMessage").classList.remove("show"), 2200);
};

function renderProducts() {
  const term = $("#menuSearch").value.trim().toLowerCase();
  const filtered = products.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term))
  );
  const labels = {
    "All": "Explore our menu, thoughtfully grouped for every craving.",
    "South Indian": "South Indian favourites · 10 freshly prepared choices.",
    "Chinese": "Indo-Chinese cafe classics · 10 flavour-packed choices.",
    "Drinks": "Coffee, tea, coolers and milkshakes · 10 refreshing choices."
  };
  $("#categoryIntro").textContent = labels[activeCategory] || labels.All;
  productGrid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-photo ${p.photo}">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button>
      </div>
      <div class="product-info"><div><h3>${p.name}</h3><p>${p.description}</p></div><strong>₹${p.price}</strong></div>
    </article>`).join("");
  if (!filtered.length) productGrid.innerHTML = '<p class="empty-cart">No menu items found. Try another search.</p>';
}
function updateCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity,0);
  const total = cart.reduce((sum,item) => sum + item.price * item.quantity,0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartSubtotal").textContent = `₹${total}`;
  $("#cartItems").innerHTML = cart.length ? cart.map(item => `
    <div class="cart-line"><div><strong>${item.name}</strong><small>₹${item.price} each</small></div>
    <div class="quantity-control"><button data-qty="-1" data-id="${item.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-qty="1" data-id="${item.id}" aria-label="Increase quantity">+</button></div></div>`).join("") :
    '<div class="empty-cart">Your bag is feeling lonely.<br><span>Let’s find it something sweet.</span></div>';
}
function addToCart(id) {
  const product = products.find(p => p.id === Number(id));
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity++;
  else cart.push({...product,quantity:1});
  updateCart();
  toast(`${product.name} added to your bag`);
}
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartOverlay").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden","false");
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartOverlay").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden","true");
}
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});
$("#categoryFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active",chip === button));
  renderProducts();
});
$("#menuSearch").addEventListener("input",renderProducts);
$("#showAll").addEventListener("click",() => {
  activeCategory = "All";
  $("#menuSearch").value = "";
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active",chip.dataset.category === "All"));
  renderProducts();
  $("#menu").scrollIntoView({behavior:"smooth"});
});
$("#openCart").addEventListener("click",openCart);
$("#closeCart").addEventListener("click",closeCart);
$("#cartOverlay").addEventListener("click",closeCart);
$("#cartItems").addEventListener("click",event => {
  const button = event.target.closest("[data-qty]");
  if (!button) return;
  const item = cart.find(p => p.id === Number(button.dataset.id));
  item.quantity += Number(button.dataset.qty);
  if (item.quantity <= 0) cart = cart.filter(p => p.id !== item.id);
  updateCart();
});
$("#checkoutButton").addEventListener("click",() => {
  if (!cart.length) return toast("Add a little something sweet first!");
  closeCart();
  $("#checkoutModal").classList.add("open");
});
$("#closeCheckout").addEventListener("click",() => $("#checkoutModal").classList.remove("open"));
$("#checkoutModal").addEventListener("click",event => {
  if (event.target.id === "checkoutModal") $("#checkoutModal").classList.remove("open");
});
$("#checkoutForm").addEventListener("submit",event => {
  event.preventDefault();
  const name = $("#customerName").value.trim();
  const phone = $("#customerPhone").value.trim();
  const address = $("#customerAddress").value.trim();
  const error = $("#checkoutError");
  if (name.length < 2) error.textContent = "Please enter your name.";
  else if (!/^[0-9]{10}$/.test(phone)) error.textContent = "Enter a valid 10-digit phone number.";
  else if (address.length < 5) error.textContent = "Please add a pickup or delivery note.";
  else {
    error.textContent = "";
    const orderTotal = cart.reduce((sum,item) => sum + item.price * item.quantity,0);
    $("#checkoutModal").classList.remove("open");
    toast(`Thank you, ${name}! Demo order placed · ₹${orderTotal}`);
    cart = [];
    updateCart();
    event.target.reset();
  }
});
$("#newsletterForm").addEventListener("submit",event => {
  event.preventDefault();
  const email = $("#emailInput");
  const message = $("#formMessage");
  if (!email.checkValidity()) {
    message.textContent = "Please enter a valid email address.";
    message.style.color = "#b94b37";
    email.focus();
  } else {
    message.textContent = "You're on the list! A little sweetness is coming your way.";
    message.style.color = "#6b7959";
    event.target.reset();
  }
});
async function loadDailyQuote() {
  const quoteElement = $("#dailyQuote");
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    if (!response.ok) throw new Error("Quote service unavailable");
    const data = await response.json();
    quoteElement.textContent = `“${data.quote}”`;
  } catch (error) {
    quoteElement.textContent = "Good things take time. Enjoy every little bite.";
  }
}
renderProducts();
updateCart();
loadDailyQuote();
