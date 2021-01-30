document.addEventListener("DOMContentLoaded", () => {
    window.onunload = function(){ window.scrollTo(0,0); }
    const nb_product = getBasket().nb_products;
    updateBadgeBasket(nb_product);
    insertFooterYear();
});

/**
 * Format price cent to euro with €
 * @param price_cent
 * @returns {string}
 */
function formatPrice(price_cent) {
    const price = price_cent / 100;
    return price.toLocaleString("fr-FR", {style: "currency", currency: "EUR"})
}

/**
 * Get product from API
 * @param product_id
 * @returns {Promise<any>}
 */
async function getProduct(product_id) {
    const productJson = await fetch('http://localhost:3000/api/teddies/' + product_id);
    return await productJson.json();
}

/**
 * Remove load page if there are an error or the content page
 * @param content_selector
 */
function loadPage(content_selector) {
    setTimeout(() => {
        const div = document.getElementById(content_selector);

        const id = setInterval(() => {
            let div_error = document.getElementById('div_error');

            if(div.innerHTML === '' && div_error === null) { return false; }

            const div_load = document.getElementById('div-load');
            document.getElementsByTagName("body")[0].classList.remove('loading');
            div_load.style.opacity = "0";

            setTimeout(() => div_load.remove(), 300);
            clearInterval(id);
        }, 300);
    }, 3000);
}

/**
 * Set pattern's error
 */
function setPatternError(input_name, error, event) {
    const input = document.getElementById(input_name);
    input.addEventListener(event, () => input.setCustomValidity(input.validity.patternMismatch ? error : ""));
}

/**
 * Animate basket logo
 * @param nb_total_product
 */
function animate_logo_basket( nb_total_product) {
    const logo_basket = document.getElementById('nb_article');

    logo_basket.classList.add('update_nb');

    setTimeout(() =>  updateBadgeBasket(nb_total_product), 300);
    setTimeout(() =>  logo_basket.classList.remove('update_nb'), 600);
}

/**
 * FadeIn / FadeOut two element
 * @param selectorIn
 * @param selectorOut
 */
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

/**
 * Generate error div
 * @param error
 */
function insertDivError(error) {
    console.log(error);
    const div = document.createElement('section');
    div.classList.add('div_error');
    div.setAttribute('id', 'div_error');

    div.innerHTML += '<h2 class="title"> Un problème a été rencontré. </h2>';
    div.innerHTML += '<img src="/assets/images/ours_sade.png" alt="Image d\'ourse triste">';
    div.innerHTML += '<p> Nous n\'avons pas réussi a récupérer les produits. </p>';

    document.querySelector('.container-custom').appendChild(div);
}

/**
 * insert the current year in the footer
 */
function insertFooterYear() {
    document.getElementById('copyright-year').innerText = new Date().getFullYear().toString();
}