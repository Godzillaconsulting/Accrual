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
    const fechaObj = new Date(fecha);
    const gcalFechaInicio = `${fechaObj.toISOString().split('T')[0].replace(/-/g, '')}T${horasInt.toString().padStart(2, '0')}${minutos}00`;
    
    // Asumir 1 hora de duración para el GCal
    let endHorasInt = horasInt + 1;
    const gcalFechaFin = `${fechaObj.toISOString().split('T')[0].replace(/-/g, '')}T${endHorasInt.toString().padStart(2, '0')}${minutos}00`;
    
    const location = modalidad === 'presencial' ? 'Calle Minerva 1174. Col. Olimpia' : 'Videollamada / En línea';
    const gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${gcalFechaInicio}/${gcalFechaFin}&ctz=America/Ojinaga&text=Cita+con+Accrual+-+${encodeURIComponent(service_requested)}&details=Cita+${modalidad}&location=${encodeURIComponent(location)}`;

    const fechaFormateada = fechaObj.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            <!-- Header -->
            <div style="background-color: #233657; padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: 3px; font-weight: 900;">ACCRUAL</h1>
                <p style="color: #D0D0DA; margin: 10px 0 0 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Ingeniería Fiscal y Patrimonial</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px 30px; color: #374151;">
                <h2 style="color: #0F4C82; margin-top: 0; font-size: 24px;">¡Hola ${nombre}!</h2>
                <p style="font-size: 16px; line-height: 1.7;">Tu cita con <strong>Accrual Consultoría</strong> ha sido pre-registrada exitosamente. A continuación te presentamos los detalles de tu reunión:</p>
                
                <!-- Detalles de la cita -->
                <div style="background-color: #f8fafc; border-left: 4px solid #0F4C82; padding: 25px; margin: 35px 0; border-radius: 0 12px 12px 0;">
                    <p style="margin: 0 0 12px 0; font-size: 15px; color: #1f2937;"><strong>Servicio:</strong> ${service_requested}</p>
                    <p style="margin: 0 0 12px 0; font-size: 15px; color: #1f2937;"><strong>Modalidad:</strong> ${modalidad.toUpperCase()}</p>
                    <p style="margin: 0 0 12px 0; font-size: 15px; color: #1f2937; text-transform: capitalize;"><strong>Fecha:</strong> ${fechaFormateada}</p>
                    <p style="margin: 0 0 12px 0; font-size: 15px; color: #1f2937;"><strong>Hora:</strong> ${hora}</p>
                    <p style="margin: 0; font-size: 15px; color: #1f2937;"><strong>Lugar:</strong> ${location}</p>
                </div>
                
                <div style="text-align: center; margin: 45px 0;">
                    <a href="${gcalLink}" style="background-color: #0F4C82; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">Agregar a Calendario</a>
                </div>
                
                <p style="font-size: 13px; color: #6b7280; line-height: 1.6; border-top: 1px solid #e5e7eb; padding-top: 25px;">
                    <strong>Nota Importante:</strong> Si elegiste pagar vía transferencia, tienes un plazo de 2 horas para enviar tu comprobante a nuestro WhatsApp para asegurar definitivamente tu horario. Si pagaste con tarjeta, tu cita ya está 100% confirmada.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 35px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 20px 0; font-size: 13px; color: #233657; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Conecta con nosotros</p>
                <div style="margin-bottom: 25px;">
                    <a href="https://www.facebook.com/profile.php?id=61572307195995" style="display: inline-block; margin: 0 15px; color: #0F4C82; text-decoration: none; font-size: 14px; font-weight: bold;">📘 Facebook</a>
                    <a href="https://www.instagram.com/accrual.accounting?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" style="display: inline-block; margin: 0 15px; color: #0F4C82; text-decoration: none; font-size: 14px; font-weight: bold;">📸 Instagram</a>
                    <a href="https://api.whatsapp.com/send/?phone=526563049604&text&type=phone_number&app_absent=0" style="display: inline-block; margin: 0 15px; color: #0F4C82; text-decoration: none; font-size: 14px; font-weight: bold;">💬 WhatsApp</a>
                </div>
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                    &copy; ${new Date().getFullYear()} Accrual Consultoría. Todos los derechos reservados.<br/>
                    Calle Minerva 1174, Col. Olimpia, Ciudad Juárez, Chihuahua.
                </p>
                <p style="margin: 0; font-size: 11px; color: #d1d5db;">
                    Este correo se generó automáticamente, por favor no respondas a esta dirección.
                </p>
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: '"Accrual Consultoría" <servicios@accrual.com.mx>',
            to: email,
            subject: 'Confirmación de Cita - Accrual Consultoría',
            html: html
        });
        console.log(`Email enviado a ${email}`);
    } catch (error) {
        console.error('Error enviando email:', error);
    }
}
