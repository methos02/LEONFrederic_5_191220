function addSuccessToast(message) {
    addToast(message, 'success');
}

function addErrorToast(message) {
    addToast(message, 'error');
}

function addToastContainer() {
    const div_container = document.createElement('div');
    div_container.classList.add('container-toast');
    div_container.setAttribute('id', 'container-toast');

    document.body.appendChild(div_container);
}

function addToast(message, type) {
    if(document.getElementById('#container-toast') == null) {
        addToastContainer();
    }

    const div_message = document.createElement('div');
    div_message.classList.add('toast', 'toast-' + type);
    div_message.appendChild(generateSpinner());
    div_message.innerHTML += '<span>' + message + '</span>';

    div_message.querySelector('[data-close=toast]').addEventListener('click', function() { closeToast(this)});
    document.getElementById('container-toast').appendChild(div_message);
    div_message.classList.add('add-toast');

    setTimeout(() => closeToast(div_message.querySelector('[data-close]')), 3350);
}

function generateSpinner() {
    const spinner = document.createElement('span');
    spinner.classList.add('radial','toast-btn');
    spinner.setAttribute('data-close','toast');

    spinner.innerHTML += '<span> X </span>';
    spinner.innerHTML += '<span class="circle left rotate"><span></span></span>';
    spinner.innerHTML += '<span class="circle right rotate"><span></span></span>';
    return spinner;
}

function closeToast(btn) {
    const toast = btn.closest('.toast');

    toast.classList.add('remove-toast');
    setTimeout(() => toast.remove(), 450);
}