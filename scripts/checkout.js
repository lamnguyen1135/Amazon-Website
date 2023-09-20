import {cart, removeFromCart, updateQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
let cartSummaryHTML = "";

cart.forEach((cartItem)=> {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if(product.id === productId){
      matchingProduct = product;
    }
  });



  cartSummaryHTML +=`
  <div class="cart-item-container 
            js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id=${matchingProduct.id}>
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id=${matchingProduct.id}>Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id=${matchingProduct.id}>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input js-delivery-option-input"
                    data-product-id=${matchingProduct.id}
                    value="option-1"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input js-delivery-option-input"
                    data-product-id=${matchingProduct.id}
                    value="option-2"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input js-delivery-option-input"
                    data-product-id=${matchingProduct.id}
                    value="option-3"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  `;
});

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;
calculateTotalBeforeTax();
updateCartQuantityCheckOut();
updateCartQuantitySummary();
calculateItems();

document.querySelectorAll(".js-delete-link").forEach((link)=>{
  link.addEventListener('click', ()=>{
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(`.js-cart-item-container-${productId}`)
    container.remove();
    calculateShipping();
    updateCartQuantityCheckOut();
    updateCartQuantitySummary();
    calculateTotalBeforeTax();
    calculateItems();
  })
});

document.querySelectorAll(".js-update-link").forEach((link)=>{
  link.addEventListener('click', ()=>{
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.add('is-editing-quantity');
  });
});

document.querySelectorAll(".js-save-link").forEach((link)=>{
  link.addEventListener('click', ()=>{
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.remove('is-editing-quantity');
    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    const newQuantity = Number(quantityInput.value);
    updateQuantity(productId, newQuantity);
    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    quantityLabel.innerHTML = newQuantity;
    updateCartQuantityCheckOut();
    updateCartQuantitySummary();
    calculateTotalBeforeTax();
    calculateItems();
  });
});


function updateCartQuantityCheckOut(){
  let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
 }

 
 function updateCartQuantitySummary(){
  let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    document.querySelector('.js-order-summary-item').innerHTML = cartQuantity;
 }


 function findSelected(productId){
  let selected = document.querySelector(`input[name='delivery-option-${productId}']:checked`);
  return selected.value;
}

 document.querySelectorAll(".js-delivery-option-input").forEach((link)=>{
  link.addEventListener('change', ()=>{
    const productId = link.dataset.productId;

    cart.forEach((cartItem) => {
      if(cartItem.productId ===  productId){
        cartItem.shipping = shippingOption((findSelected(productId)));
      }
    });
    
    calculateShipping();
    calculateTotalBeforeTax();
    calculateItems();
  });
});

function calculateShipping(){
  let totalShippingCost = 0;
  cart.forEach((cartItem) => {
    if(cartItem.shipping){
    totalShippingCost += cartItem.shipping;
    }
    
  });
  document.querySelector(".js-shipping-handling").innerHTML=formatCurrency(totalShippingCost);
}
function shippingOption(value){
  let shippingCost = 0;
  if(value === "option-1"){
    shippingCost = shippingCost;
  }else if(value === "option-2"){
    shippingCost =499;
  }else if(value=== "option-3"){
    shippingCost = 999;
  }
return shippingCost;
}


function calculateTotalBeforeTax(){
  let totalBeforeTax = 0;
  
  cart.forEach((cartItem) => {
    if(cartItem.shipping){
      totalBeforeTax += cartItem.shipping;
    }
    products.forEach((products) => {
      if(cartItem.productId === products.id){
        totalBeforeTax += (products.priceCents * cartItem.quantity);
      }
    });
    
  });
  let taxCost = (totalBeforeTax *0.1);
  let totalCost = taxCost+ totalBeforeTax;
  document.querySelector(".js-payment-summary-money").innerHTML = formatCurrency(totalBeforeTax);
  document.querySelector(".js-tax").innerHTML = formatCurrency(taxCost);
  document.querySelector(".js-total-cost").innerHTML = formatCurrency(totalCost);
}

function calculateItems(){
  let itemCostTotal = 0;
  cart.forEach((cartItem) => {
    products.forEach((products) => {
      if(cartItem.productId === products.id){
        itemCostTotal += (products.priceCents * cartItem.quantity);
      }
    });
  
  });
  document.querySelector(".js-item-total").innerHTML = formatCurrency(itemCostTotal);
}
