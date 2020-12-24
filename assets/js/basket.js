function getBasket() {
    let basket = localStorage.getItem('basket');
    return basket !== null ? JSON.parse(basket) : {nb_products : 0, products: []};
}

function getProductInBasket(basket, product_id) {
    return basket.products.find((basket_product) => product_id === basket_product.id)
}

function getIndexProductInBasket(basket, product_id) {
    return basket.products.findIndex((basket_product) => product_id === basket_product.id)
}

function basketAddOrUpdateProduct(product, infos) {
    let basket = getBasket();
    let product_basket_index = getIndexProductInBasket(basket, product._id);

    if(product_basket_index === -1) {
        addSuccessToast('Votre nounours a bien été ajouté !');
        return basketAddProduct(basket, defineProduct(product, infos));
    }

    addSuccessToast('Votre panier a été modifié !');
    return basketUpdateProduct(basket, infos, product_basket_index);
}

function basketAddProduct(basket, product) {
    basket.products.push(product);
    return saveBasket(basket);
}

function basketUpdateProduct(basket, infos, index) {
    basket.products[index].colors = basketAddOrUpdateColor(basket.products[index], infos);
    return saveBasket(basket);
}

function saveBasket(basket) {
    basket.nb_products = basket.products.reduce((nb_total, product) => {
        const nb_product = product.colors.reduce((nb_product, info) => { return nb_product + parseInt(info.nb) }, 0);
        return nb_total + nb_product
    }, 0);

    localStorage.setItem('basket', JSON.stringify(basket));
    return basket.nb_products;
}

function basketNbProduct() {
    return getBasket().nb_products;
}

function productGetInfos(product, color_name) {
    if(product === undefined) return undefined;

    return product.colors.find((color) => color.name === color_name);
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
    let basket = getBasket();
    let product_index = getIndexProductInBasket(basket, product_id);

    if(basket[product_index].colors.length === 1) {
        delete basket[product_index];
        return saveBasket(basket);
    }

    basket[product_index].colors = basket[product_index].colors.filter( color => color.name !== remove_color);
    return saveBasket(basket);
}

function returnOrInitInfos(infos, color_name) {
    if(infos !== undefined) return infos;

    return {
        name: color_name,
        nb: 1
    }
}