import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// Ensure the API key exists
if (!process.env.GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not defined in the environment.');
}

// Initialize Gemini 2.0 Flash
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'PLACEHOLDER');
// We use the 2.0-flash model for reasoning and tool-calling
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Parses user intent to schedule an appointment.
 * Extracts firstName, lastName, service, preferred date and time.
 * @param {string} userMessage - The message from the user
 * @returns {Promise<Object>} The parsed intent.
 */
export async function parseAppointmentIntent(userMessage) {
    // Defines the instructions and constraints for the AI
    const systemInstruction = `
Eres una asistente virtual (mujer) experta y amable que trabaja para Accrual (https://www.accrual.com.mx/), una firma especializada en servicios contables, fiscales y financieros.
Como parte de tu conocimiento central: "Nuestro equipo de especialistas en materia tributaria implementa controles, revisa procesos internos y ofrece recomendaciones estratégicas para fortalecer la gobernanza fiscal y asegurar transparencia ante las autoridades."
Tu objetivo es ayudar a los clientes a resolver sus dudas sobre nuestros servicios basándote en esta filosofía, y agendar citas si así lo desean.
Cuando el usuario indique que quiere una cita, debes extraer la siguiente información del texto:
- Nombre (firstName)
- Apellido (lastName)
- Fecha deseada (date) en formato YYYY-MM-DD (asume que si dice "mañana" o "próximo mes" puedes calcular la fecha aproximada basada en la fecha actual ${new Date().toISOString()})
- Hora deseada (time) en formato HH:MM (24 horas)
- Servicio de interés (service)
- Modalidad (modality) (Virtual o Presencial)

Devuelve ÚNICAMENTE un JSON con esta estructura (sin texto extra) cuando logres extraer intenciones de agendar:
{
  "intent": "schedule_appointment" | "general_inquiry" | "unknown",
  "data": {
     "firstName": "",
     "lastName": "",
     "date": "",
     "time": "",
     "service": "",
     "modality": "Virtual"
  },
  "missingFields": ["firstName", "lastName", ...] // campos que aún faltan para completar la cita
}
Si el usuario hace una pregunta general, usa "general_inquiry" y no intentes forzar "schedule_appointment".
`;

    try {
        const result = await model.generateContent([
            { text: systemInstruction },
            { text: 'User message: ' + userMessage }
        ]);

        const responseText = result.response.text();
        
        // Try parsing the text as JSON
        // Find the first '{' and last '}'
        const startIndex = responseText.indexOf('{');
        const endIndex = responseText.lastIndexOf('}');
        
        if (startIndex !== -1 && endIndex !== -1) {
            const jsonStr = responseText.substring(startIndex, endIndex + 1);
            return JSON.parse(jsonStr);
        } else {
            console.error('Gemini response was not JSON:', responseText);
            return { intent: "unknown", data: null, missingFields: [] };
        }
    } catch (error) {
        console.error('Error in Gemini parsing:', error);
        return { intent: "error", error: error.message };
    }
}
