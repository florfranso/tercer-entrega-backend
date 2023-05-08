import twilio from 'twilio';
import dotenv from 'dotenv'

dotenv.config()

//credenciales para conectarnos al servicio de twilio
const accountId= process.env.WAPP_ACCOUNT_ID;
const accountToken= process.env.WAPP_ACCOUNT_TOKEN;

//crear un cliente de node para conectarnos a twilio
const twilioClient = twilio(accountId,accountToken);

const twilioWapp="whatsapp:+14155238886";//este el numero generado desde twilio
const adminWapp= process.env.ADMIN_WAPP;


export {twilioWapp, adminWapp, twilioClient}