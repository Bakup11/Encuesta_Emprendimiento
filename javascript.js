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

    // Mostrar/ocultar sección de contacto
    alphaTestSelect.addEventListener('change', function() {
        if (this.value === 'si') {
            contactSection.style.display = 'block';
            fullNameInput.required = true;
            contactMethodSelect.required = true;
        } else {
            contactSection.style.display = 'none';
            fullNameInput.required = false;
            contactMethodSelect.required = false;
            // Resetear todos los campos de contacto
            fullNameInput.value = '';
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
        const organizationProblems = document.getElementById('organizationProblems').value;
        const managementApps = document.getElementById('managementApps').value;
        const alphaTest = document.getElementById('alphaTest').value;
        
        // Verificar validación personalizada
        let isValid = true;
        
        // Si el usuario quiere participar en la prueba alpha, validar datos de contacto
        if (alphaTest === 'si') {
            const contactMethod = contactMethodSelect.value;
            
            if (!fullNameInput.value.trim()) {
                alert('Por favor, ingrese su nombre completo');
                isValid = false;
            } else if (!contactMethod) {
                alert('Por favor, seleccione un método de contacto');
                isValid = false;
            } else if (contactMethod === 'telefono' && !phoneInput.value.trim()) {
                alert('Por favor, ingrese su número de teléfono');
                isValid = false;
            } else if (contactMethod === 'correo' && !emailInput.value.trim()) {
                alert('Por favor, ingrese su correo electrónico');
                isValid = false;
            }
        }
        
        if (!isValid) return;
        
        // Datos de contacto (solo se usan si alphaTest es 'si')
        const fullName = alphaTest === 'si' ? (fullNameInput.value || 'No proporcionado') : 'No aplica';
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
                organizationProblems,
                managementApps,
                alphaTest,
                fullName,
                contactMethod,
                contactInfo,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert('Encuesta enviada exitosamente');
            form.reset();
            contactSection.style.display = 'none';
            phoneSection.style.display = 'none';
            emailSection.style.display = 'none';
        } catch (error) {
            console.error('Error al enviar la encuesta:', error);
            alert('Hubo un problema al enviar la encuesta. Intente nuevamente.');
        }
    });
});