import { GenerateBarcodeDTO } from './dto/generate-barcode.dto';
import { Injectable, Logger } from '@nestjs/common';
import { RenderOptions, toBuffer } from 'bwip-js';
import { promises } from 'fs-extra';
import { join } from 'path';
import { pdfGenerator } from './pdfgenerator';

@Injectable()
export class InvoicesService {
  private loger = new Logger(InvoicesService.name);
  async createInvoice() {
    const result = await this.generateInvoiceBarcode({
      barcodeText: '123456789',
      outputPath: join('./', 'barcode.png'),
    });

    try {
      await pdfGenerator();
    } catch (error) {
      this.loger.error('Erreur lors de la génération du PDF:', error);
      throw new Error('Erreur lors de la génération du PDF:');
    }

    return result;
  }

  async generateInvoiceBarcode(dto: GenerateBarcodeDTO) {
    // Options pour le code-barres
    const options: RenderOptions = {
      bcid: 'code128',
      text: dto.barcodeText,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'justify',
    };
    try {
      // Générer le code-barres
      const png = await toBuffer(options);
      const fullOutputPath = dto.outputPath;

      await promises.writeFile(fullOutputPath, png);
      this.loger.log(`Code-barres sauvegardé à ${fullOutputPath}`);
      return {
        message: 'Code-barres sauvegardé',
      };
    } catch (error) {
      this.loger.error('Erreur lors de la génération du code-barres:', error);
      throw new Error('Erreur lors de la génération du code-barres:');
    }
  }
}
