document.addEventListener("DOMContentLoaded", () => {
    const nb_product = getBasket().nb_products;
    updateBadgeBasket(nb_product);
});

function formatPrice(price_cent) {
    const price = price_cent / 100;
    return price.toLocaleString("fr-FR", {style: "currency", currency: "EUR"})
}

async function getProduct(product_id) {
    const productJson = await fetch('http://localhost:3000/api/teddies/' + product_id);
    return await productJson.json();
}

function defineProduct(product, infos) {
     return {
        id : product._id,
        colors: [infos]
    }
}

function animate_logo_basket( nb_total_product) {
    const logo_basket = document.getElementById('nb_article');

    logo_basket.classList.add('update_nb');

    setTimeout(() =>  updateBadgeBasket(nb_total_product), 300);
    setTimeout(() =>  logo_basket.classList.remove('update_nb'), 600);
}

function switchElementById(selectorIn, selectorOut) {
    const elemIn = document.getElementById(selectorIn);
    const elemOut = document.getElementById(selectorOut);
    const halfDuration = 150;

    elemOut.style.transition = 'opacity ' +  halfDuration + 'ms ease';
    elemIn.style.transition = 'opacity ' +  (halfDuration + 50 ) + 'ms ease';
    elemOut.style.opacity = "0";
    elemIn.style.opacity = "0";


    setTimeout(() => {
        elemOut.classList.add('hide');
        elemIn.classList.remove('hide');
        }, halfDuration
    );

    setTimeout(() => elemIn.style.opacity = "1", halfDuration + 5);

    setTimeout(() => {
        elemIn.removeAttribute('style');
        elemOut.removeAttribute('style');
    },halfDuration * 2.5);
}