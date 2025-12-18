/**
 * ACTEA - Form Validation Module
 * Validacion accesible con mensajes inline
 */

document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form');

    forms.forEach(function (form) {
        var inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(function (input) {
            // Crear elemento de error si no existe
            var errorEl = document.getElementById(input.id + '-error');
            if (!errorEl && input.id) {
                errorEl = document.createElement('span');
                errorEl.id = input.id + '-error';
                errorEl.className = 'c-form-error';
                errorEl.setAttribute('role', 'alert');
                input.parentNode.appendChild(errorEl);
                input.setAttribute('aria-describedby', errorEl.id);
            }

            // Validar al perder foco
            input.addEventListener('blur', function () {
                validateField(input, errorEl);
            });

            // Limpiar error al escribir
            input.addEventListener('input', function () {
                if (input.validity.valid) {
                    if (errorEl) errorEl.textContent = '';
                    input.classList.remove('c-input--error');
                    input.classList.add('c-input--success');
                    input.setAttribute('aria-invalid', 'false');
                }
            });
        });
    });
});

function validateField(input, errorEl) {
    if (!input.validity.valid) {
        var message = '';

        if (input.validity.valueMissing) {
            message = 'Este campo es obligatorio';
        } else if (input.validity.typeMismatch && input.type === 'email') {
            message = 'Introduce un email valido';
        } else if (input.validity.tooShort) {
            message = 'Minimo ' + input.minLength + ' caracteres';
        }

        if (errorEl) errorEl.textContent = message;
        input.classList.add('c-input--error');
        input.classList.remove('c-input--success');
        input.setAttribute('aria-invalid', 'true');
    }
}
