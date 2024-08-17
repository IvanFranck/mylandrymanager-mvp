import PDFDocument from 'pdfkit';
import { InvoicePDFParamsDto } from './dto/invoice-pdf-params.dto';
import dayjs from 'dayjs';
import { PassThrough } from 'stream';

export const pdfGenerator = async (
  invoiceParams: InvoicePDFParamsDto,
): Promise<Buffer | Error> => {
  const doc: PDFKit.PDFDocument = new PDFDocument({
    margin: 50,
    size: 'A4',
  });

  const pdfStream = new PassThrough();
  const chunks: Buffer[] = [];
  const barcodeFilePath = invoiceParams.barcodeFilePath;

  // Collecter les données du stream
  pdfStream.on('data', (chunk) => {
    chunks.push(chunk);
  });

  doc.pipe(pdfStream);

  // Définir les largeurs des sections avec marges
  const pageWidth = doc.page.width; // Largeur d'une page A4
  const usableWidth =
    pageWidth - doc.page.margins.left - doc.page.margins.right; // Soustraire 50 de chaque côté pour les marges

  /**
   * ****************************************
   * ****************************************
   * ********* INFOS ENTREPRISE **********
   * ****************************************
   * ****************************************
   */

  const enterpriseIndfosStartX = doc.page.margins.left;
  const enterpriseIndfosStartY = doc.page.margins.top;

  const userInfos = invoiceParams.invoice.command.user;

  doc.font('Helvetica-Bold').fontSize(20);
  doc.text(userInfos.username, enterpriseIndfosStartX, enterpriseIndfosStartY, {
    width: usableWidth,
    align: 'center',
  });
  doc.font('Helvetica').fontSize(12);
  doc.text(userInfos.address, {
    width: usableWidth,
    align: 'center',
  });
  doc.text(userInfos.phone.toString(), { width: usableWidth, align: 'center' });

  const enterpriseIndfosHeight = 70;

  /**
   * ****************************************
   * ****************************************
   * ********* CORPS DE LA FACTURE **********
   * ****************************************
   * ****************************************
   */

  const bodyStartX = doc.page.margins.left;
  const bodyStartY = doc.page.margins.top + enterpriseIndfosHeight;

  /**
   * ********* partie de gauche: infos client **********
   */

  const headerStarterX = bodyStartX;
  const headerStarterY = bodyStartY;

  // infos client
  const customerInfos = invoiceParams.invoice.command.customer;
  const customerWidth = usableWidth * 0.5;
  doc.fillColor('black').fontSize(14).font('Helvetica-Bold');
  doc.text('FACTURÉ À', headerStarterX, headerStarterY, {
    width: customerWidth,
    align: 'left',
  });
  doc.fillColor('#41413F').fontSize(12).font('Helvetica');
  doc.text(customerInfos.name, { width: customerWidth, align: 'left' });
  if (customerInfos.address) {
    doc.text(customerInfos.address, { width: customerWidth, align: 'left' });
  }

  /**
   * ********* partie de droite: infos facture **********
   */

  const infosFacture = [
    {
      titre: 'FACTURE N°',
      valeur: invoiceParams.invoice.code,
    },
    {
      titre: 'DATE',
      valeur: dayjs(invoiceParams.invoice.createdAt).format('DD/MM/YYYY'),
    },
    {
      titre: 'COMMANDE N°',
      valeur: invoiceParams.invoice.command.code,
    },
    {
      titre: 'ÉCHÉANCE',
      valeur: dayjs(invoiceParams.invoice.command.withdrawDate).format(
        'DD/MM/YYYY',
      ),
    },
  ];
  const billInfosWidth = usableWidth * 0.5;
  let billInfosLineGap = 0;
  infosFacture.forEach((item) => {
    doc.fillColor('black').fontSize(12).font('Helvetica-Bold');
    doc.text(
      item.titre,
      headerStarterX + customerWidth,
      headerStarterY + billInfosLineGap,
      { width: billInfosWidth / 2, align: 'left' },
    );
    doc.fillColor('#41413F').fontSize(10).font('Helvetica');
    doc.text(
      item.valeur,
      headerStarterX + customerWidth + billInfosWidth / 2,
      headerStarterY + billInfosLineGap,
      { width: billInfosWidth / 2, align: 'right' },
    );
    billInfosLineGap += 17;
  });

  const infosSectionHeight = 80;

  /**
   * ********* table de produits **********
   */

  const productTableStartX = bodyStartX;
  const productTableStartY = headerStarterY + infosSectionHeight;
  const productTableHeaderHeight = 40;
  const sectionWidths = [
    usableWidth * 0.6,
    usableWidth * 0.15,
    usableWidth * 0.05,
    usableWidth * 0.2,
  ];

  // Dessiner le rectangle de fond noir pour le header avec marges
  doc
    .rect(
      productTableStartX,
      productTableStartY,
      usableWidth,
      productTableHeaderHeight,
    )
    .fill('#52524F');

  // Définir la couleur du texte et la taille de la police
  doc.fillColor('white').fontSize(10);

  // Ajouter les titres des sections avec marges
  let currentX = productTableStartX; // Commencer à 50 pour la marge gauche
  const titles = ['Service / Référence', 'Prix unitaire', 'Qté', 'Prix total'];
  titles.forEach((title, index) => {
    doc.text(
      title,
      index === 0 ? currentX + 2 : currentX,
      productTableStartY + 5,
      {
        width: sectionWidths[index] - 5,
        align: index === 0 ? 'left' : 'right',
      },
    );
    currentX += sectionWidths[index];
    if (index < titles.length - 1) {
      // Dessiner les lignes de séparation avec marges
      doc
        .moveTo(currentX, productTableStartY)
        .lineTo(currentX, productTableStartY + productTableHeaderHeight)
        .stroke('#9B9B97');
    }
  });

  // Paramètres de hauteur
  const lineHeightPerArticle = 30;
  const marginBetweenArticles = 0;
  const totalHeightPerArticle = lineHeightPerArticle + marginBetweenArticles;

  function getPrixTotal(prixUnitaire: number, quantite: number) {
    return prixUnitaire * quantite;
  }

  // Supposons que vous ayez un tableau d'articles
  const articles = invoiceParams.invoice.command.services;

  let articleStartY = productTableHeaderHeight + productTableStartY + 10;
  const articleStartX = productTableStartX;
  // Ajouter les informations de l'article sous le header
  doc.fillColor('black').fontSize(10);

  articles.forEach((article, index) => {
    if (index % 2 !== 0) {
      doc.rect(articleStartX, articleStartY, usableWidth, 30).fill('#EBEBEA'); // Dessiner le fond coloré
      doc.fillColor('black').fontSize(10);
      currentX = articleStartX;
      doc.text(article.service.label, 50 + 2, articleStartY + 5, {
        width: sectionWidths[0] - 5,
        align: 'left',
      });
      currentX += sectionWidths[0];
      doc
        .moveTo(currentX, articleStartY)
        .lineTo(currentX, articleStartY + 30)
        .stroke('white');
      doc.text(
        article.service.price.toString() + ' fcfa',
        50 + sectionWidths[0],
        articleStartY + 5,
        { width: sectionWidths[1] - 5, align: 'right' },
      );
      currentX += sectionWidths[1];
      doc
        .moveTo(currentX, articleStartY)
        .lineTo(currentX, articleStartY + 30)
        .stroke('white');
      doc.text(
        article.quantity.toString(),
        50 + sectionWidths[0] + sectionWidths[1],
        articleStartY + 5,
        { width: sectionWidths[2] - 5, align: 'right' },
      );
      currentX += sectionWidths[2];
      doc
        .moveTo(currentX, articleStartY)
        .lineTo(currentX, articleStartY + 30)
        .stroke('white');
      doc.text(
        getPrixTotal(article.service.price, article.quantity) + ' fcfa',
        50 + sectionWidths[0] + sectionWidths[1] + sectionWidths[2],
        articleStartY + 5,
        { width: sectionWidths[3] - 5, align: 'right' },
      );
    } else {
      doc.text(article.service.label, 50 + 2, articleStartY, {
        width: sectionWidths[0] - 5,
        align: 'left',
      });
      doc.text(
        article.service.price.toString() + ' fcfa',
        articleStartX + sectionWidths[0],
        articleStartY,
        { width: sectionWidths[1] - 5, align: 'right' },
      );
      doc.text(
        article.quantity.toString(),
        articleStartX + sectionWidths[0] + sectionWidths[1],
        articleStartY,
        { width: sectionWidths[2] - 5, align: 'right' },
      );
      doc.text(
        getPrixTotal(article.service.price, article.quantity) + ' fcfa',
        articleStartX + sectionWidths[0] + sectionWidths[1] + sectionWidths[2],
        articleStartY,
        { width: sectionWidths[3] - 5, align: 'right' },
      );
    }
    articleStartY += totalHeightPerArticle;
  });

  const totalPartiel = articles.reduce(
    (acc, article) =>
      acc + getPrixTotal(article.service.price, article.quantity),
    0,
  );
  const remise = invoiceParams.invoice.command.discount; // Remise fixe pour l'exemple
  const advance = invoiceParams.invoice.command.advance;
  const totalFinal = totalPartiel - remise;

  const total = [
    {
      text: 'Total Partiel :',
      value: totalPartiel,
    },
    {
      text: 'Remise :',
      value: remise,
    },
    {
      text: 'Net à payer :',
      value: totalFinal,
    },
    {
      text: 'Montant avancé :',
      value: advance ?? '0',
    },
    {
      text: 'Reste à payer :',
      value: totalFinal - advance,
    },
  ];

  let totalStartY = articleStartY + 10; // Ajouter une marge après le dernier article

  total.forEach((item) => {
    doc.font('Helvetica-Bold').fontSize(12);
    doc.text(item.text, 50, totalStartY, {
      width: usableWidth * 0.8 - 5,
      align: 'right',
    });
    doc.font('Helvetica').fontSize(10);
    doc.text(item.value + ' Fcfa', 50 + usableWidth * 0.8, totalStartY, {
      width: usableWidth * 0.2 - 5,
      align: 'right',
    });
    totalStartY += 20;
  });

  const totalSectionHeight = 20 * total.length + 10;

  const totalArticlesHeight = articles.length * totalHeightPerArticle;

  const totalProductTableHeight =
    productTableHeaderHeight + totalArticlesHeight + totalSectionHeight;

  const bodyHeight = totalProductTableHeight + infosSectionHeight;

  /**
   * ****************************************
   * ****************************************
   * ********* CODE BARE **********
   * ****************************************
   * ****************************************
   */

  const barcodeWidth = 200;
  const barcodeStartX = pageWidth / 2 - barcodeWidth / 2;
  const barcodeStartY =
    doc.page.margins.top + enterpriseIndfosHeight + bodyHeight + 40;

  doc.image(barcodeFilePath, barcodeStartX, barcodeStartY, {
    width: barcodeWidth,
  });

  doc.end();

  return new Promise((resolve, reject) => {
    pdfStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    pdfStream.on('error', (err) => {
      reject(new Error("Erreur lors de l'écriture du PDF: " + err));
    });
  });
};
