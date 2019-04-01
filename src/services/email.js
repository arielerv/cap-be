const {EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD, DOMAIN} = process.env;
const EWS = require('node-ews');
const querystring = require('querystring');

const CryptoService = require('./crypto');

const TOKEN_TYPE = 'passRecover';

class EmailService {
    static async sendMail(to, subject, message) {
        const ews = new EWS({
            host: EMAIL_HOST,
            username: EMAIL_USER,
            password: EMAIL_PASSWORD
        });
        await ews.run('CreateItem', {
            attributes: {
                MessageDisposition: 'SendOnly'
            },
            Items: {
                Message: {
                    ItemClass: 'IPM.Note',
                    Subject: subject,
                    Body: {
                        attributes: {
                            BodyType: 'HTML'
                        },
                        $value: `${message}<br/><br/><small>Por favor no responda a este mensaje automático.</small><br/><small>Please do not reply to this automated message.</small>`
                    },
                    ToRecipients: {
                        Mailbox: {
                            EmailAddress: to
                        }
                    },
                    IsRead: 'false'
                }
            }
        });
    }

    static async sendCredentials(user, password) {
        await EmailService.sendMail(
            user.email,
            'Blanqueo de contraseña',
            `<p>Hola ${user.name},</p><p>A continuación se le adjunta su usuario para ingresar al sistema. Lo puede utilizar, tanto en el sistema de gestión como también en la aplicación.</p></br><p>Usuario <strong>${user.username}</strong><br/>Contraseña <strong>${password}</strong></p>`
        );
    }

    static async sendTokenToPasswordRecovery(user) {
        const token = CryptoService.encrypt(JSON.stringify({
            type: TOKEN_TYPE,
            user: user._id,
            timestamp: Date.now()
        }));
        await EmailService.sendMail(
            user.email,
            'Recuperación de contraseña',
            `Hola ${user.name},<br/><br/>Para ingresar al sistema, debe crear una nueva contraseña haciendo click en este <a href="${DOMAIN}/signIn.html#/resetPassword?t=${querystring.escape(token)}">link</a>.`
        );
    };

    static async sendTokenToNewPassword(user) {
        const token = CryptoService.encrypt(JSON.stringify({
            type: TOKEN_TYPE,
            user: user._id,
            timestamp: Date.now()
        }));
        await EmailService.sendMail(
            user.email,
            'Generación de clave',
            `Hola ${user.name},<br/><br/>Para ingresar al sistema, debe generar una contraseña haciendo click en este <a href="${DOMAIN}/signIn.html#/resetPassword?t=${querystring.escape(token)}">link</a>.`
        );
    };
}

module.exports = EmailService;
