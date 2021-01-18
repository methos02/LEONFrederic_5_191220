/**
 * generate and insert toast's container in the body
 */
function addToastContainer() {
    const div_container = document.createElement('div');
    div_container.classList.add('container-toast');
    div_container.setAttribute('id', 'container-toast');

    document.body.appendChild(div_container);
}

/**
 * shortcut for generate success toast
 * @param message
 */
function addSuccessToast(message) {
    addToast(message, 'success');
}

/**
 * shortcut for generate error toast
 * @param message
 */
function addErrorToast(message) {
    addToast(message, 'error');
}

/**
 * generate and insert toast in the toast's container
 * @param message
 * @param type
 */
function addToast(message, type) {
    if(document.getElementById('#container-toast') == null) {
        addToastContainer();
    }

    const div_message = document.createElement('div');
    div_message.classList.add('toast', 'toast-' + type);
    div_message.appendChild(generateTimer());
    div_message.innerHTML += '<span>' + message + '</span>';

    div_message.querySelector('[data-close=toast]').addEventListener('click', function() { closeToast(this)});
    document.getElementById('container-toast').appendChild(div_message);
    div_message.classList.add('add-toast');

    setTimeout(() => closeToast(div_message.querySelector('[data-close]')), 3500);
}

/**
 * Generate toast's timer
 * @returns {HTMLSpanElement}
 */
function generateTimer() {
    const timer = document.createElement('span');
    timer.classList.add('radial','toast-btn');
    timer.setAttribute('data-close','toast');

    timer.innerHTML += '<span> X </span>';
    timer.innerHTML += '<span class="circle left rotate"><span></span></span>';
    timer.innerHTML += '<span class="circle right rotate"><span></span></span>';
    return timer;
}

/**
 * Close toast
 * @param btn
 */
function closeToast(btn) {
    const toast = btn.closest('.toast');

    toast.classList.add('remove-toast');
    setTimeout(() => toast.remove(), 450);
}