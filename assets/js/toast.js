function addSuccessToast(message) {
    if(document.getElementById('#container-toast') == null) {
        addToastContainer();
    }

    addToast(message, 'success');
}

function addErrorToast(message) {
    if(document.getElementById('#container-toast') == null) {
        addToastContainer();
    }

    addToast(message, 'error');
}

function addToastContainer() {
    const div_container = document.createElement('div');
    div_container.classList.add('container-toast');
    div_container.setAttribute('id', 'container-toast');

    document.body.appendChild(div_container);
}

function addToast(message, type) {
    const div_message = document.createElement('div');
    div_message.classList.add('toast', 'toast-' + type);
    div_message.innerHTML = '<span class="toast-btn" data-close="toast"> x </span><span>'  + message + '</span>';

    div_message.querySelector('[data-close=toast]').addEventListener('click', function() { closeToast(this)});
    document.getElementById('container-toast').appendChild(div_message);
}

function closeToast(btn) {
    btn.closest('.toast').remove();
}