// Configuración de Firebase (reemplazar con tus propias credenciales)
const firebaseConfig = {
    apiKey: "AIzaSyADkBxoMtaFa9xKOLWFZskbgrdJLZOvb8Q",
    authDomain: "encuesta-proyectoemprendiminto.firebaseapp.com",
    projectId: "encuesta-proyectoemprendiminto",
    storageBucket: "encuesta-proyectoemprendiminto.firebasestorage.app",
    messagingSenderId: "488492623599",
    appId: "1:488492623599:web:a2f33f63144c8134c49d1a"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('activitySurvey');
    const contactSection = document.getElementById('contactSection');
    const alphaTestSelect = document.getElementById('alphaTest');
    const contactMethodSelect = document.getElementById('contactMethod');
    const phoneSection = document.getElementById('phoneSection');
    const emailSection = document.getElementById('emailSection');
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('emailAddress');
    
    // Elementos de la alerta personalizada
    const customAlert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    const alertButton = document.getElementById('alertButton');

    // Función para mostrar alerta personalizada
    function showCustomAlert(message) {
        alertMessage.textContent = message;
        customAlert.classList.add('show');
        
        // Enfocar el botón para accesibilidad
        setTimeout(() => {
            alertButton.focus();
        }, 100);
    }

    // Cerrar alerta al hacer clic en el botón
    alertButton.addEventListener('click', () => {
        customAlert.classList.remove('show');
    });

    // Mostrar/ocultar sección de contacto
    alphaTestSelect.addEventListener('change', function() {
        if (this.value === 'si') {
            contactSection.style.display = 'block';
            contactMethodSelect.required = true;
        } else {
            contactSection.style.display = 'none';
            contactMethodSelect.required = false;
            // Resetear campos de contacto
            contactMethodSelect.value = '';
            phoneInput.value = '';
            emailInput.value = '';
            phoneSection.style.display = 'none';
            emailSection.style.display = 'none';
            // Asegurarse de que los campos ocultos no sean requeridos
            phoneInput.required = false;
            emailInput.required = false;
        }
    });

    // Mostrar/ocultar campos de contacto según método seleccionado
    contactMethodSelect.addEventListener('change', function() {
        phoneSection.style.display = this.value === 'telefono' ? 'block' : 'none';
        emailSection.style.display = this.value === 'correo' ? 'block' : 'none';
        
        // Establecer campos como requeridos según la selección
        phoneInput.required = this.value === 'telefono';
        emailInput.required = this.value === 'correo';
        
        // Si cambia la selección, limpiar el campo anterior
        if (this.value === 'telefono') {
            emailInput.value = '';
            emailInput.required = false;
        } else if (this.value === 'correo') {
            phoneInput.value = '';
            phoneInput.required = false;
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar campos básicos
        const fullName = fullNameInput.value;
        const organizationProblems = document.getElementById('organizationProblems').value;
        const managementApps = document.getElementById('managementApps').value;
        const alphaTest = document.getElementById('alphaTest').value;
        
        // Verificar validación personalizada
        let isValid = true;
        
        if (!fullName.trim()) {
            showCustomAlert('Por favor, ingrese su nombre completo');
            isValid = false;
        }
        
        // Si el usuario quiere participar en la prueba alpha, validar datos de contacto
        if (alphaTest === 'si') {
            const contactMethod = contactMethodSelect.value;
            
            if (!contactMethod) {
                showCustomAlert('Por favor, seleccione un método de contacto');
                isValid = false;
            } else if (contactMethod === 'telefono' && !phoneInput.value.trim()) {
                showCustomAlert('Por favor, ingrese su número de teléfono');
                isValid = false;
            } else if (contactMethod === 'correo' && !emailInput.value.trim()) {
                showCustomAlert('Por favor, ingrese su correo electrónico');
                isValid = false;
            }
        }
        
        if (!isValid) return;
        
        // Datos de contacto (solo se usan si alphaTest es 'si')
        const contactMethod = alphaTest === 'si' ? (contactMethodSelect.value || 'No seleccionado') : 'No aplica';
        let contactInfo = 'No aplica';
        
        if (alphaTest === 'si') {
            if (contactMethod === 'telefono') {
                contactInfo = phoneInput.value || 'No proporcionado';
            } else if (contactMethod === 'correo') {
                contactInfo = emailInput.value || 'No proporcionado';
            }
        }

        try {
            // Guardar en Firestore
            await db.collection('surveyResponses').add({
                fullName,
                organizationProblems,
                managementApps,
                alphaTest,
                contactMethod,
                contactInfo,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Mostrar mensaje según si aceptó o no participar en la prueba alpha
            if (alphaTest === 'si') {
                showCustomAlert('¡Gracias por participar! Nos pondremos en contacto contigo pronto para la prueba alpha.');
            } else {
                showCustomAlert('¡Gracias por completar nuestra encuesta! Tu opinión es muy valiosa para nosotros.');
            }
            
            // Resetear formulario
            form.reset();
            contactSection.style.display = 'none';
            phoneSection.style.display = 'none';
            emailSection.style.display = 'none';
        } catch (error) {
            console.error('Error al enviar la encuesta:', error);
            showCustomAlert('Hubo un problema al enviar la encuesta. Intente nuevamente.');
        }
    });
    
    // Cerrar alerta cuando se hace clic fuera de ella
    window.addEventListener('click', (e) => {
        if (e.target === customAlert) {
            customAlert.classList.remove('show');
        }
    });
    
    // Permitir cerrar alerta con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && customAlert.classList.contains('show')) {
            customAlert.classList.remove('show');
        }
    });
});