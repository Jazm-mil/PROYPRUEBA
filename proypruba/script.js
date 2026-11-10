/*
 * ============================================================================
 * script.js - Lógica de validación e interacción del formulario de login
 *
 * ⚠️ ADVERTENCIA DIDÁCTICA (IMPORTANTE PARA ESTUDIANTES):
 * La "autenticación" implementada en este archivo es EXCLUSIVAMENTE
 * con fines educativos. Las credenciales se comparan directamente en
 * el código del cliente, lo cual NO es seguro: cualquier usuario puede
 * verlas inspeccionando el código fuente de la página.
 *
 * En un sistema real, las credenciales deben validarse en un SERVIDOR,
 * usando HTTPS, hash de contraseñas (ej. bcrypt/argon2) y sesiones o
 * tokens JWT. Nunca implementes autenticación solo con JavaScript del lado
 * del cliente.
 * ============================================================================
 */

// Esperamos a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {

    // ========================================================================
    // 1. REFERENCIAS A LOS ELEMENTOS DEL DOM
    // ========================================================================
    const form          = document.getElementById("login-form");
    const emailInput    = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberBox   = document.getElementById("remember");
    const toggleBtn     = document.getElementById("toggle-password");
    const eyeOpenIcon   = document.getElementById("icon-eye-open");
    const eyeClosedIcon = document.getElementById("icon-eye-closed");
    const globalMessage = document.getElementById("global-message");
    const forgotLink    = document.getElementById("forgot-link");

    // ========================================================================
    // 2. CREDENCIALES DE DEMOSTRACIÓN (¡solo para la práctica universitaria!)
    // ========================================================================
    const DEMO_EMAIL    = "demo@ejemplo.com";
    const DEMO_PASSWORD = "Demo1234!";

    // Expresión regular para validar el formato del correo electrónico.
    // Verifica: texto@texto.dominio (permite subdominios y TLD de 2+ letras)
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // ========================================================================
    // 3. VALIDACIONES INDIVIDUALES DE CAMPOS
    // ========================================================================

    /**
     * Valida el campo de correo electrónico.
     * @returns {boolean} true si el valor es válido, false en caso contrario.
     */
    function validateEmail() {
        const value = emailInput.value.trim(); // trim(): elimina espacios al inicio/fin

        if (value === "") {
            showFieldError(emailInput, "email-error", "El correo electrónico es obligatorio.");
            return false;
        }
        if (!EMAIL_REGEX.test(value)) {
            showFieldError(emailInput, "email-error", "Ingresa un correo electrónico válido (ej: usuario@dominio.com).");
            return false;
        }
        clearFieldError(emailInput, "email-error");
        return true;
    }

    /**
     * Valida el campo de contraseña.
     * @returns {boolean} true si el valor es válido, false en caso contrario.
     */
    function validatePassword() {
        const value = passwordInput.value;

        if (value === "") {
            showFieldError(passwordInput, "password-error", "La contraseña es obligatoria.");
            return false;
        }
        if (value.length < 8) {
            showFieldError(passwordInput, "password-error", "La contraseña debe tener al menos 8 caracteres.");
            return false;
        }
        clearFieldError(passwordInput, "password-error");
        return true;
    }

    /**
     * Muestra un mensaje de error debajo de un campo y lo marca como inválido.
     */
    function showFieldError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = "⚠ " + message; // ⚠ icono visual simple (texto)
        errorElement.hidden = false;               // Se hace visible (accesible)
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true"); // Anuncia el error a lectores de pantalla
    }

    /**
     * Oculta el mensaje de error de un campo y restaura su estado válido.
     */
    function clearFieldError(input, errorId) {
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = "";
        errorElement.hidden = true;
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
    }

    // ========================================================================
    // 4. MENSAJES GLOBALES (éxito / error de autenticación)
    // ========================================================================

    /**
     * Muestra un mensaje global dentro del formulario.
     * @param {string} type   "success" o "error"
     * @param {string} message Texto a mostrar
     */
    function showGlobalMessage(type, message) {
        globalMessage.textContent = message;
        globalMessage.className = "global-message global-message--" + type;
        globalMessage.hidden = false;
    }

    function hideGlobalMessage() {
        globalMessage.hidden = true;
    }

    // ========================================================================
    // 5. EVENTOS DE VALIDACIÓN (validación en tiempo real)
    // ========================================================================

    // Al salir del campo (blur): se valida y muestra el error si aplica
    emailInput.addEventListener("blur", validateEmail);
    passwordInput.addEventListener("blur", validatePassword);

    // Al escribir (input): si el campo ya tiene error, se revalida de inmediato
    // para que el mensaje desaparezca apenas el usuario corrige el valor.
    emailInput.addEventListener("input", () => {
        if (emailInput.classList.contains("is-invalid")) validateEmail();
        hideGlobalMessage();
    });
    passwordInput.addEventListener("input", () => {
        if (passwordInput.classList.contains("is-invalid")) validatePassword();
        hideGlobalMessage();
    });

    // ========================================================================
    // 6. MOSTRAR / OCULTAR CONTRASEÑA
    // ========================================================================
    toggleBtn.addEventListener("click", () => {
        // Alternamos el tipo del input entre "password" y "text"
        const isHidden = passwordInput.type === "password";
        passwordInput.type = isHidden ? "text" : "password";

        // Intercambiamos los iconos de ojo abierto / cerrado
        eyeOpenIcon.style.display   = isHidden ? "none" : "block";
        eyeClosedIcon.style.display = isHidden ? "block" : "none";

        // Atributos de accesibilidad: el lector de pantalla anuncia el cambio
        toggleBtn.setAttribute("aria-pressed", String(isHidden));
        toggleBtn.setAttribute("aria-label",
            isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
    });

    // ========================================================================
    // 7. ENLACE "¿OLVIDASTE TU CONTRASEÑA?" (comportamiento didáctico)
    // ========================================================================
    forgotLink.addEventListener("click", (event) => {
        event.preventDefault(); // Evita la navegación (el enlace no apunta a ninguna parte)
        showGlobalMessage("error",
            "Función no implementada en esta práctica. Usa las credenciales de demostración.");
    });

    // ========================================================================
    // 8. ENVÍO DEL FORMULARIO: VALIDACIÓN COMPLETA + AUTENTICACIÓN SIMULADA
    // ========================================================================
    form.addEventListener("submit", (event) => {
        // ⚠️ Imprescindible: evita que el formulario se envíe y la página
        // se recargue antes de completar nuestras validaciones.
        event.preventDefault();

        // 1) Validamos TODOS los campos
        const isEmailValid    = validateEmail();
        const isPasswordValid = validatePassword();

        // 2) Si hay algún error: mostramos mensaje global y enfocamos el
        //    primer campo inválido (mejora la navegación con teclado).
        if (!isEmailValid || !isPasswordValid) {
            showGlobalMessage("error", "Corrige los campos marcados para continuar.");
            const firstInvalid = form.querySelector(".is-invalid");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // 3) Validación exitosa: autenticación simulada (¡solo didáctica!)
        const enteredEmail    = emailInput.value.trim();
        const enteredPassword = passwordInput.value;

        if (enteredEmail === DEMO_EMAIL && enteredPassword === DEMO_PASSWORD) {
            showGlobalMessage("success",
                "✔ ¡Bienvenido! Inicio de sesión exitoso (autenticación de demostración).");
            handleRememberEmail(enteredEmail);
            form.reset();               // Limpia el formulario tras el éxito
            restorePasswordVisibility(); // Restaura el campo a tipo "password"
        } else {
            showGlobalMessage("error",
                "✖ Credenciales incorrectas. Verifica tu correo y contraseña.");
            passwordInput.value = "";   // Se vacía la contraseña por seguridad
            passwordInput.focus();
        }
    });

    // ========================================================================
    // 9. OPCIÓN "RECORDAR MI CORREO" (localStorage)
    // ========================================================================
    // ⚠️ REGLA DE SEGURIDAD: JAMÁS guardamos contraseñas en localStorage
    // ni sessionStorage. Solo guardamos el correo, dato no sensible.

    const REMEMBER_KEY = "remembered_email";

    /**
     * Guarda o elimina el correo recordado según el estado de la casilla.
     */
    function handleRememberEmail(email) {
        if (rememberBox.checked) {
            localStorage.setItem(REMEMBER_KEY, email);
        } else {
            localStorage.removeItem(REMEMBER_KEY);
        }
    }

    /**
     * Al cargar la página: si existe un correo recordado, lo precarga
     * en el campo y marca la casilla automáticamente.
     */
    function loadRememberedEmail() {
        const savedEmail = localStorage.getItem(REMEMBER_KEY);
        if (savedEmail) {
            emailInput.value = savedEmail;
            rememberBox.checked = true;
        }
    }

    /** Restaura el campo de contraseña a su estado oculto inicial. */
    function restorePasswordVisibility() {
        passwordInput.type = "password";
        eyeOpenIcon.style.display   = "block";
        eyeClosedIcon.style.display = "none";
        toggleBtn.setAttribute("aria-pressed", "false");
        toggleBtn.setAttribute("aria-label", "Mostrar contraseña");
    }

    // Precargamos el correo recordado al iniciar
    loadRememberedEmail();
});
