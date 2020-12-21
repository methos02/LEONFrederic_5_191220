document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('nb_article').textContent = basketNbProduct();
});

function formatPrice(price_cent) {
    let price = price_cent / 100;
    return price.toLocaleString("fr-FR", {style: "currency", currency: "EUR"})
}

function getBasket() {
    let basket = localStorage.getItem('basket');
    return basket !== null ? JSON.parse(basket) : {nb_products : 0, products: []};
}

function basketNbProduct() {
    return getBasket().nb_products;
}

function addSuccessToast(message) {
    if(document.getElementById('#container-toast') == null) {
        addToastContainer();
    }

    addToast(message, 'success');
}

function addToastContainer() {
    let div_container = document.createElement('div');
    div_container.classList.add('container-toast');
    div_container.setAttribute('id', 'container-toast');

    document.body.appendChild(div_container);
}

function addToast(message, type) {
    let div_message = document.createElement('div');
    div_message.classList.add('toast', 'toast-' + type);
    div_message.innerHTML = '<span class="toast-btn" data-close="toast"> x </span><span>'  + message + '</span>';

    div_message.querySelector('[data-close=toast]').addEventListener('click', function() { closeToast(this)});
    document.getElementById('container-toast').appendChild(div_message);
}

function closeToast(btn) {
    btn.closest('.toast').remove();
}

function basketAddOrUpdateProduct(product) {
    let basket = getBasket();
    let product_index = getIndexProductInBasket(basket, product);

    if(product_index === -1) {
        addSuccessToast('Votre nounours a bien été ajouté !');
        return basketAddProduct(basket, product);
    }

    addSuccessToast('Votre panier a été modifié !');
    return basketUpdateProduct(basket, product, product_index);
}

function basketAddProduct(basket, product) {
    basket.products.push(product);
    return saveBasket(basket);
}

function basketUpdateProduct(basket, product, index) {
    basket.products[index] = product;
    return saveBasket(basket);
}

function getIndexProductInBasket(basket, product) {
    return basket.products.findIndex((basket_product) => product.name === basket_product.name && product.color === basket_product.color)
}

function saveBasket(basket) {
    basket.nb_products = basket.products.reduce((nb_product, product) => { return nb_product + product.nb_product}, 0);
    localStorage.setItem('basket', JSON.stringify(basket));
    return basket.nb_products;
}

function defineProduct(container) {
    let td_price = container.querySelector('[data-product_price]');
    let nb_product = container.querySelector('input[name=product_numb]').value;

    return {
        name : container.querySelector('[data-product_name]').textContent,
        color: defineColor(container),
        nb_product : parseInt(nb_product),
        price : td_price.getAttribute('data-product_price'),
        total_price: formatPrice(nb_product * parseInt(td_price.getAttribute('data-product_price')))
    }
}

function defineColor (container) {
    return container.querySelector('#colors') !== null  ? container.querySelector('#colors').value : container.querySelector('[data-product_color]').textContent
}

function changeNumberItems(btn) {
    let input = btn.parentElement.querySelector('input');
    let current_nb_items = parseInt(input.value);
    let diff = parseInt(btn.getAttribute('data-product_nb_update'))
    let nb_items = current_nb_items + diff;

    if(nb_items > 0) {
        input.value = nb_items;
        input.dispatchEvent(new Event('change'));
    }
}