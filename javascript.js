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
        } else {
            contactSection.style.display = 'none';
            fullNameInput.required = false;
            // Resetear todos los campos de contacto
            fullNameInput.value = '';
            contactMethodSelect.value = '';
            phoneInput.value = '';
            emailInput.value = '';
            phoneSection.style.display = 'none';
            emailSection.style.display = 'none';
        }
    });

    // Mostrar/ocultar campos de contacto según método seleccionado
    contactMethodSelect.addEventListener('change', function() {
        phoneSection.style.display = this.value === 'telefono' ? 'block' : 'none';
        emailSection.style.display = this.value === 'correo' ? 'block' : 'none';
        
        // Establecer campos como requeridos según la selección
        phoneInput.required = this.value === 'telefono';
        emailInput.required = this.value === 'correo';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar campos
        const organizationProblems = document.getElementById('organizationProblems').value;
        const managementApps = document.getElementById('managementApps').value;
        const alphaTest = document.getElementById('alphaTest').value;
        
        // Datos de contacto
        const fullName = fullNameInput.value || 'No proporcionado';
        const contactMethod = contactMethodSelect.value || 'No seleccionado';
        const contactInfo = contactMethod === 'telefono' 
            ? (phoneInput.value || 'No proporcionado')
            : (emailInput.value || 'No proporcionado');

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