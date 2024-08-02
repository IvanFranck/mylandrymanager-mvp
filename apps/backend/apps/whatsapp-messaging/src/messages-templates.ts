export function invoiceMessageTemplate(invoiceCode: string, baseUrl: string) {
  return `Votre facture n° ${invoiceCode} est disponible.
        Vous la trouverez dans le fichier ci-dessous ou en cliquant sur le lien suivant :
        ${baseUrl}/${invoiceCode}
        
        Merci de votre confiance. Bonne journée!`;
}
