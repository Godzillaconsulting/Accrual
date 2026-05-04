import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: 'a5927a001@smtp-brevo.com',
        pass: 'tY9HNr5OLZ6ynvSE'
    }
});

export async function sendConfirmationEmail(appointment) {
    const { nombre, apellidos, email, fecha, hora, modalidad, service_requested } = appointment;

    // Formatear hora (ej: 09:00 am -> 09:00:00)
    let horaStr = hora.split(' ')[0];
    const isPM = hora.includes('pm') || hora.includes('PM');
    let [horas, minutos] = horaStr.split(':');
    let horasInt = parseInt(horas);
    if (isPM && horasInt !== 12) horasInt += 12;
    if (!isPM && horasInt === 12) horasInt = 0;
    
    // Crear fecha local en zona de Juarez (aproximación para GCal)
    const gcalFechaInicio = `${fecha.toISOString().split('T')[0].replace(/-/g, '')}T${horasInt.toString().padStart(2, '0')}${minutos}00`;
    
    // Asumir 1 hora de duración para el GCal
    let endHorasInt = horasInt + 1;
    const gcalFechaFin = `${fecha.toISOString().split('T')[0].replace(/-/g, '')}T${endHorasInt.toString().padStart(2, '0')}${minutos}00`;
    
    const location = modalidad === 'presencial' ? 'Calle Minerva 1174. Col. Olimpia' : 'Videollamada / En línea';
    const gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${gcalFechaInicio}/${gcalFechaFin}&text=Cita+con+Accrual+-+${encodeURIComponent(service_requested)}&details=Cita+${modalidad}&location=${encodeURIComponent(location)}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #233657;">
            <h2 style="color: #0F4C82;">¡Hola ${nombre} ${apellidos}!</h2>
            <p>Tu cita con <strong>Accrual Consultoría</strong> ha sido pre-registrada exitosamente.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Servicio:</strong> ${service_requested}</p>
                <p><strong>Modalidad:</strong> ${modalidad}</p>
                <p><strong>Fecha:</strong> ${fecha.toISOString().split('T')[0]}</p>
                <p><strong>Hora:</strong> ${hora}</p>
                <p><strong>Ubicación:</strong> ${location}</p>
            </div>
            <p>Por favor agrega este evento a tu calendario para que no lo olvides:</p>
            <a href="${gcalLink}" style="display: inline-block; background-color: #0F4C82; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-bottom: 20px;">Agregar a Google Calendar</a>
            
            <p style="margin-top: 10px; font-size: 14px; color: #4b5563;"><strong>Importante:</strong> Si elegiste pagar vía transferencia, tienes un plazo de 2 horas para enviar tu comprobante a nuestro WhatsApp para asegurar definitivamente tu horario. Si pagaste con tarjeta, tu cita ya está 100% confirmada.</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: '"Accrual Consultoría" <info@godzillaconsulting.ai>',
            to: email,
            subject: 'Confirmación de Cita - Accrual Consultoría',
            html: html
        });
        console.log(`Email enviado a ${email}`);
    } catch (error) {
        console.error('Error enviando email:', error);
    }
}
