fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.querySelector(".items");
    const cartCount = document.querySelector(".cart-count");
    const emptyCart = document.querySelector(".empty-cart");
    const itemInCart = document.querySelector(".item-in-cart");
    const creatingOrder = document.querySelector(".creating-order");
    const totalOrderPrice = document.querySelector(".total-order-price");
    const popupOverlay = document.querySelector(".popup-overlay");
    const orderPopupInfo = document.querySelector(".ordered-items");
    const totalPopupPrice = document.querySelector(
      ".total-section p:last-child"
    );

    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    function renderItems() {
      container.innerHTML = "";

      data.forEach((dessert, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        itemDiv.id = `item${index + 1}`;

        const quantity = cart[dessert.name] || 0;
        const hasItemInCart = quantity > 0;

        let cartContent = hasItemInCart
          ? `
          <div class="cart active-cart" data-name="${dessert.name}">
            <div class="decrement cart-add-rem" data-name="${dessert.name}">
              <img src="./assets/images/icon-decrement-quantity.svg" alt="decrement cart">
            </div>
            <p class="quantity">${quantity}</p>
            <div class="increment cart-add-rem" data-name="${dessert.name}">
              <img src="./assets/images/icon-increment-quantity.svg" alt="increment cart">
            </div>
          </div>`
          : `
          <div class="cart add-to-cart" data-name="${dessert.name}">
            <img src="./assets/images/icon-add-to-cart.svg" alt="cart icon">
            <p>Add to Cart</p>
          </div>`;

        itemDiv.innerHTML = `
          <img src="${dessert.image.desktop}" alt="${dessert.name}" 
               style="border: ${
                 hasItemInCart ? "2.4px solid orangered" : "none"
               };">
          ${cartContent}
          <div class="details">
            <p>${dessert.category}</p>
            <h3>${dessert.name}</h3>
            <h3>$${dessert.price.toFixed(2)}</h3>
          </div>`;

        container.appendChild(itemDiv);
      });

      renderCart();
    }

    function renderCart() {
      creatingOrder.innerHTML = "";
      let totalPrice = 0;
      let cartSize = Object.keys(cart).length;

      if (cartSize === 0) {
        emptyCart.style.display = "flex";
        itemInCart.style.display = "none";
        cartCount.textContent = "(0)";
        return;
      }

      emptyCart.style.display = "none";
      itemInCart.style.display = "block";
      cartCount.textContent = `(${cartSize})`;

      Object.entries(cart).forEach(([name, quantity]) => {
        const dessert = data.find((item) => item.name === name);
        if (!dessert) return;

        let itemTotalPrice = quantity * dessert.price;
        totalPrice += itemTotalPrice;

        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order");
        orderDiv.innerHTML = `
          <div class="info">
            <p class="item-name">${name}</p>
            <div class="item-info">
              <p class="item-quantity">${quantity}x</p>
              <p class="item-price">@ $${dessert.price.toFixed(2)}</p>
              <p class="total-price">$${itemTotalPrice.toFixed(2)}</p>
            </div>
          </div>
          <div class="delete" data-name="${name}">
            <img src="./assets/images/icon-remove-item.svg" alt="remove item">
          </div>`;

        creatingOrder.appendChild(orderDiv);
      });

      totalOrderPrice.textContent = `$${totalPrice.toFixed(2)}`;
    }

    function updatePopup() {
      orderPopupInfo.innerHTML = "";
      let totalPrice = 0;

      Object.entries(cart).forEach(([name, quantity]) => {
        const dessert = data.find((item) => item.name === name);
        if (!dessert) return;

        let itemTotalPrice = quantity * dessert.price;
        totalPrice += itemTotalPrice;

        const orderItem = document.createElement("div");
        orderItem.classList.add("order-item");
        orderItem.innerHTML = `
          <img class="dessert-image" src="${
            dessert.image.desktop
          }" alt="${name}">
          <div class="order-info">
            <p>${name}</p>
            <div class="order-info-info">
              <span>${quantity}x</span>
              <p>@$${dessert.price.toFixed(2)}</p>
            </div>
          </div>
          <p class="order-price">$${itemTotalPrice.toFixed(2)}</p>`;

        orderPopupInfo.appendChild(orderItem);
      });

      totalPopupPrice.textContent = `$${totalPrice.toFixed(2)}`;
      popupOverlay.classList.add("active");
    }

    renderItems();

    document.addEventListener("click", (event) => {
      const target = event.target.closest(
        ".cart, .delete, .increment, .decrement"
      );
      if (!target) return;

      const itemName = target.dataset.name;
      if (!itemName) return;

      if (target.classList.contains("add-to-cart")) {
        cart[itemName] = 1;
      } else if (target.classList.contains("increment")) {
        cart[itemName] = (cart[itemName] || 0) + 1;
      } else if (target.classList.contains("decrement")) {
        if (cart[itemName] > 1) {
          cart[itemName]--;
        } else {
          delete cart[itemName];
        }
      } else if (target.classList.contains("delete")) {
        delete cart[itemName];
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      renderItems();
    });

    const confirmOrderBtn = document.querySelector(".confirm-order");
    const startNewOrderBtn = document.querySelector(".start-new-order");

    confirmOrderBtn.addEventListener("click", function () {
      updatePopup();
      popupOverlay.classList.add("active");
      document.body.style.overflowY = "hidden";
    });

    startNewOrderBtn.addEventListener("click", function () {
      cart = {};
      localStorage.removeItem("cart");
      renderItems();
      renderCart();
      popupOverlay.classList.remove("active");
      document.body.style.overflowY = "auto";
    });
  })
  .catch((error) => console.error("Error fetching JSON:", error));
