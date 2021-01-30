/**
 * Get basket from localstorage
 * @returns {any|{nb_products: number, products: []}}
 */
function getBasket() {
    const basket = localStorage.getItem('basket');
    return basket !== null ? JSON.parse(basket) : { nb_products : 0, products: [] };
}

/**
 * Empty basket
 */
function emptyBasket() {
    localStorage.removeItem('basket');
    updateBadgeBasket(0);
}

/**
 * Update basket's badge in the navbar
 * @param nb_product
 */
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

/**
 * Get product's in the basket
 * @param product_id
 * @returns {*}
 */
function getProductInBasket(product_id) {
    return basket.products.find((basket_product) => product_id === basket_product.id)
}

/**
 * Get product's id in the basket
 * @param product_id
 * @returns {*}
 */
function getIndexProductInBasket(product_id) {
    return basket.products.findIndex((basket_product) => product_id === basket_product.id)
}

/**
 * Add / Update basket
 * @param product
 * @param infos
 * @returns {*}
 */
function basketAddOrUpdateProduct(product, infos) {
    const product_basket_index = getIndexProductInBasket(product._id);

    if(product_basket_index === -1) {
        addSuccessToast('Votre nounours a bien été ajouté !');
        return basketAddProduct({ id : product._id, colors: [infos] });
    }

    addSuccessToast('Votre panier a été modifié !');
    return basketUpdateProduct(infos, product_basket_index);
}

/**
 * Add basket
 * @param product
 * @returns {*}
 */
function basketAddProduct(product) {
    basket.products.push(product);
    return saveBasket();
}

/**
 * Update basket
 * @param infos
 * @param index
 * @returns {*}
 */
function basketUpdateProduct(infos, index) {
    basket.products[index].colors = basketAddOrUpdateColor(basket.products[index], infos);
    return saveBasket();
}

/**
 * Save basket
 * @returns {*}
 */
function saveBasket() {
    basket.nb_products = basket.products.reduce((nb_total, product) => {
        const nb_product = product.colors.reduce((nb_product, info) => { return nb_product + parseInt(info.nb) }, 0);
        return nb_total + nb_product
    }, 0);

    localStorage.setItem('basket', JSON.stringify(basket));
    return basket.nb_products;
}

/**
 * Get product's color info from basket
 * @param product_id
 * @param color_name
 * @returns {undefined|Object}
 */
function productGetInfos(product_id, color_name) {
    const product_basket = getProductInBasket(product_id);

    if(product_basket === undefined) return undefined;

    return product_basket.colors.find((color) => color.name === color_name);
}

/**
 * Add or Update a product's color
 * @param product
 * @param infos
 * @returns {Document.colors|[*]|*}
 */
function basketAddOrUpdateColor(product, infos) {
    const infos_index = product.colors.findIndex(color => color.name === infos.name);

    if(infos_index !== -1) {
        product.colors[infos_index] = infos
        return product.colors;
    }

    product.colors.push(infos);
    return product.colors;
}

/**
 * Remove product form basket
 * @param product_id
 * @param remove_color
 * @returns {*}
 */
function localBasketRemoveProduct(product_id, remove_color) {
    const product_index = getIndexProductInBasket(product_id);
    const product = basket.products[product_index];

    if(product.colors.length === 1) {
        basket.products = basket.products.filter( product_basket => product_basket.id !== product_id);
        return saveBasket(basket);
    }

    product.colors = product.colors.filter( color => color.name !== remove_color);
    return saveBasket(basket);
}