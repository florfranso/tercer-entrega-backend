import twilio from 'twilio';
import dotenv from 'dotenv'

dotenv.config()

//credenciales para conectarnos al servicio de twilio
const accountId="twilio Account SID";
const accountToken="twilio Auth Token";

//crear un cliente de node para conectarnos a twilio
const twilioClient = twilio(accountId,accountToken);

const twilioWapp="whatsapp:+numbero generado por twilio";//este el numero generado desde twilio
const adminWapp="whatsapp:+numero al que envio";


module.exports = {twilioWapp, adminWapp, twilioClient};