function getBasket() {
    const basket = localStorage.getItem('basket');
    return basket !== null ? JSON.parse(basket) : {nb_products : 0, products: []};
}

function emptyBasket() {
    localStorage.clear();
    updateBadgeBasket(0);
}

function updateBadgeBasket (nb_product) {
    const badge = document.getElementById("nb_article");

    if(parseInt(nb_product) === 0) {
        badge.innerText = "";
        badge.classList.add('empty-basket');
        return;
    }

    badge.innerText = nb_product;
    badge.classList.remove('empty-basket');
}

function getProductInBasket(product_id) {
    return basket.products.find((basket_product) => product_id === basket_product.id)
}

function getIndexProductInBasket(product_id) {
    return basket.products.findIndex((basket_product) => product_id === basket_product.id)
}

function basketAddOrUpdateProduct(product, infos) {
    const product_basket_index = getIndexProductInBasket(product._id);

    if(product_basket_index === -1) {
        addSuccessToast('Votre nounours a bien été ajouté !');
        return basketAddProduct(defineProduct(product, infos));
    }

    addSuccessToast('Votre panier a été modifié !');
    return basketUpdateProduct(infos, product_basket_index);
}

function basketAddProduct(product) {
    basket.products.push(product);
    return saveBasket();
}

function basketUpdateProduct(infos, index) {
    basket.products[index].colors = basketAddOrUpdateColor(basket.products[index], infos);
    return saveBasket();
}

function saveBasket() {
    basket.nb_products = basket.products.reduce((nb_total, product) => {
        const nb_product = product.colors.reduce((nb_product, info) => { return nb_product + parseInt(info.nb) }, 0);
        return nb_total + nb_product
    }, 0);

    localStorage.setItem('basket', JSON.stringify(basket));
    return basket.nb_products;
}

function productGetInfos(product_id, color_name) {
    const product_basket = getProductInBasket(product_id);

    if(product_basket === undefined) return undefined;

    return product_basket.colors.find((color) => color.name === color_name);
}

function basketAddOrUpdateColor(product, infos) {
    const infos_index = product.colors.findIndex(color => color.name === infos.name);

    if(infos_index !== -1) {
        product.colors[infos_index] = infos
        return product.colors;
    }

    product.colors.push(infos);
    return product.colors;
}

function localBasketRemoveProduct(product_id, remove_color) {
    const product_index = getIndexProductInBasket(product_id);

    if(basket[product_index].colors.length === 1) {
        delete basket[product_index];
        return saveBasket(basket);
    }

    basket[product_index].colors = basket[product_index].colors.filter( color => color.name !== remove_color);
    return saveBasket(basket);
}