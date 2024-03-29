var moment = require('moment');
var htmlEasyPay = (nextclock, entity, reference, element, email_info) => {
    var html = `
    <!DOCTYPE html> <!--PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">-->
    <html style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
        <head>
            <meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title>New email</title> <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
            <style type="text/css">
                @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 {
                text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r
                { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }#outlook a { padding:0;}.ExternalClass { width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {  line-height:100%;}.es-button
                {  mso-style-priority:100!important;   text-decoration:none!important;}a[x-apple-data-detectors] { color:inherit!important;    text-decoration:none!important; font-size:inherit!important;    font-family:inherit!important;  font-weight:inherit!important;  line-height:inherit!important;}.es-desk-hidden {    display:none;   float:left; overflow:hidden;    width:0;    max-height:0;   line-height:0;  mso-hide:all;}
            </style>
            <style>
                #table, #td, #th {  
                    border: 1px solid #ddd;
                    text-align: left;
                }

                #table {
                    border-collapse: collapse;
                    width: 100%;
                }

                #th, #td {
                    padding: 15px;
                    padding-left: 5px;
                    padding-right: 5px;
                }

                #td {
                    font-size: smaller;
                }
            </style>
        </head>
        <body style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
            <div class="es-wrapper-color" style="background-color:#F6F6F6;"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f6f6f6"></v:fill> </v:background><![endif]-->
                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;">
                    <tr style="border-collapse:collapse;">
                        <td valign="top" style="padding:0;Margin:0;">
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                <tr style="border-collapse:collapse;">
                                    <td align="center" style="padding:0;Margin:0;">
                                        <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" align="center">
                                            <tr style="border-collapse:collapse;">
                                                <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;"> <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="356" valign="top"><![endif]-->
                                                    <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
                                                        <tr style="border-collapse:collapse;">
                                                            <td class="es-m-p0r es-m-p20b" width="356" valign="top" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td align="center" style="padding:0;Margin:0;display:none;"></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table> <!--[if mso]></td><td width="20"></td><td width="184" valign="top"><![endif]-->
                                                    <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                        <tr style="border-collapse:collapse;">
                                                            <td width="184" align="left" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td align="center" style="padding:0;Margin:0;display:none;"></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table> <!--[if mso]></td></tr></table><![endif]-->
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                <tr style="border-collapse:collapse;">
                                    <td align="center" style="padding:0;Margin:0;">
                                        <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;">
                                            <tr style="border-collapse:collapse;">
                                                <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;">
                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                        <tr style="border-collapse:collapse;">
                                                            <td width="560" class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;">
                                                                <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;">
                                                                            <img src="cid:logo" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="108">
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr style="border-collapse:collapse;">
                                                <td align="left" style="Margin:0;padding-top:20px;padding-left:5px;padding-right:5px;padding-bottom:40px;">
                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                        <tr style="border-collapse:collapse;">
                                                            <td width="560" valign="top" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <!--tr style="border-collapse:collapse;">
                                                                        <td class="es-m-txt-c" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:40px;padding-right:40px;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#333333;text-align:center;">
                                                                            /*'Dados de pagamento para a reserva de dia ' + date + ' às ' + hour + ', para o candidato ' + student + ' (NIF: ' + tax_num + '):*/
                                                                            </p>
                                                                        </td>
                                                                    </tr>-->
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td align="center" style="padding:0;Margin:0;padding-top:20px;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333;"></p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td style="padding:0;Margin:0;">
                                                                            <p style="text-align: center; font-size: initial;">Valor total com data limite de pagamento de <b>${moment(nextclock).format('DD-MM-YYYY HH:mm')}</b></p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td class="es-m-txt-c" align="center" style="padding:20px; padding-top: 5px;Margin:0;">
                                                                            <table width="75%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tr style="border-collapse:collapse;">
                                                                                    <td style="padding:0;Margin:0px 0px 0px 0px;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px;"></td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td style="padding:0;Margin:0;">
                                                                            <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;margin:auto;width:40%;font-size:16px;">
                                                                                <tr style="border-collapse:collapse;">
                                                                                    <td style="padding:0;Margin:0;text-align:left;">
                                                                                        <b>Entidade:</b>
                                                                                    </td>
                                                                                    <td style="padding:0;Margin:0;text-align:right;">
                                                                                        ${entity}
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="border-collapse:collapse;">
                                                                                    <td style="padding:0;Margin:0;text-align:left;">
                                                                                        <b>Referência:</b>
                                                                                    </td>
                                                                                    <td style="padding:0;Margin:0;text-align:right;">
                                                                                        ${reference}
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="border-collapse:collapse;">
                                                                                    <td style="padding:0;Margin:0;text-align:left;">
                                                                                        <b>Valor:</b>
                                                                                    </td>
                                                                                    <td style="padding:0;Margin:0;text-align:right;">
                                                                                        ${element.value}€
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td class="es-m-txt-c" align="center" style="padding:20px; padding-top:10px; Margin:0;">
                                                                            <table width="75%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tr style="border-collapse:collapse;">
                                                                                    <td style="padding:0;Margin:0px 0px 0px 0px;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px;"></td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                <table id="table">
                                                                    <tr>
                                                                        <th id="th" style="width:23%">Tipo de exame:</th>
                                                                        <th id="th" style="width:12%">Data:</th>
                                                                        <th id="th" style="width:12%">Horas:</th>
                                                                        <th id="th">Candidato:</th>
                                                                        <th id="th" style="width:5%">Preço</th>
                                                                    </tr>`
                                                                for (let i = 0; i < email_info.length; i++) {
                                                                    html+=`
                                                                    <tr>
                                                                        <td id="td">${email_info[i].Exam_type_name}</td>
                                                                        <td id="td">${email_info[i].Timeslot_date}</td>
                                                                        <td id="td">${email_info[i].Time}</td>
                                                                        <td id="td">${email_info[i].Student_name}</td>
                                                                        <td id="td">${email_info[i].Price}</td>
                                                                    </tr>`
                                                                }
                                                                html+=`
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                                <tr style="border-collapse:collapse;">
                                    <td align="center" style="padding:0;Margin:0;">
                                        <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;">
                                            <tr style="border-collapse:collapse;">
                                                <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;">
                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                        <tr style="border-collapse:collapse;">
                                                            <td width="560" valign="top" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td class="es-m-txt-c" align="center" style="padding:20px;Margin:0;">
                                                                            <table width="75%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tr style="border-collapse:collapse;">
                                                                                    <td style="padding:0;Margin:0px 0px 0px 0px;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px;"></td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td class="es-m-txt-c" align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:11px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:17px;color:#333333;">
                                                                                © 2019 ANIECA - Associação Nacional de Escolas de Condução Automóvel
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
    </html>`
    return html
}

module.exports = function(){
    return htmlEasyPay
}
