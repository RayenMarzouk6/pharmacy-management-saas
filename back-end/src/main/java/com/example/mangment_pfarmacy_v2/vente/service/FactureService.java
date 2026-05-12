package com.example.mangment_pfarmacy_v2.vente.service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;
import com.example.mangment_pfarmacy_v2.vente.entity.LigneVente;
import com.example.mangment_pfarmacy_v2.vente.entity.Vente;
import com.example.mangment_pfarmacy_v2.vente.repository.VenteRepository;
import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional(readOnly = true)
public class FactureService {

    @Autowired
    private VenteRepository venteRepository;
    
    @Autowired
    private PharmacieRepository pharmacieRepository;

    private static final DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * Génère un PDF facture pour une vente
     */
    public byte[] generateFacturePDF(UUID venteId, UUID pharmacieId) {
        Vente vente = venteRepository.findByIdAndPharmacieId(venteId, pharmacieId)
                .orElseThrow(() -> new RuntimeException("Vente non trouvée"));

        // Fetch pharmacy details
        Pharmacie pharmacie = pharmacieRepository.findById(pharmacieId)
                .orElseThrow(() -> new RuntimeException("Pharmacie non trouvée"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document doc = new Document(pdfDoc);

        try {
            PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            // En-tête
            Paragraph title = new Paragraph("FACTURE")
                    .setFont(boldFont).setFontSize(20).setTextAlignment(TextAlignment.CENTER);
            doc.add(title);

            // Infos pharmacie
            Paragraph pharmacieInfo = new Paragraph(pharmacie.getNom())
                    .setFont(boldFont).setFontSize(12);
            doc.add(pharmacieInfo);

            doc.add(new Paragraph(pharmacie.getAdresse()).setFont(font).setFontSize(10));

            if (pharmacie.getTelephone() != null && !pharmacie.getTelephone().isEmpty()) {
                doc.add(new Paragraph("Tél: " + pharmacie.getTelephone()).setFont(font).setFontSize(10));
            }

            // Numéro et date facture
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("N° Facture: " + vente.getId()).setFont(font));
            String formattedDate = vente.getDateVente() != null ? vente.getDateVente().format(dateFormat) : "N/A";
            doc.add(new Paragraph("Date: " + formattedDate).setFont(font));
            
            if (vente.getUtilisateur() != null) {
                String nomVendeur = vente.getUtilisateur().getFirst_name() + " " + vente.getUtilisateur().getLast_name();
                doc.add(new Paragraph("Vendeur: " + nomVendeur).setFont(font).setFontSize(10));
            }

            // Table des lignes
            doc.add(new Paragraph("\n"));
            Table table = new Table(UnitValue.createPercentArray(new float[]{40, 20, 20, 20}))
                    .useAllAvailableWidth();

            // En-têtes colonnes
            table.addHeaderCell(new Paragraph("Médicament").setFont(boldFont));
            table.addHeaderCell(new Paragraph("Quantité").setFont(boldFont).setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(new Paragraph("P.U.").setFont(boldFont).setTextAlignment(TextAlignment.RIGHT));
            table.addHeaderCell(new Paragraph("Total").setFont(boldFont).setTextAlignment(TextAlignment.RIGHT));

            // Lignes de vente
            for (LigneVente ligne : vente.getLignesVente()) {
                table.addCell(new Paragraph(ligne.getMedicament().getNom()).setFont(font));
                table.addCell(new Paragraph(String.valueOf(ligne.getQuantite()))
                        .setFont(font).setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Paragraph(String.format("%.2f TND", ligne.getPrixUnitaire()))
                        .setFont(font).setTextAlignment(TextAlignment.RIGHT));
                table.addCell(new Paragraph(String.format("%.2f TND", ligne.sousTotal()))
                        .setFont(font).setTextAlignment(TextAlignment.RIGHT));
            }

            doc.add(table);

            // Total
            doc.add(new Paragraph("\n"));
            Paragraph totalLine = new Paragraph("MONTANT TOTAL: " + String.format("%.2f TND", vente.getMontantTotal()))
                    .setFont(boldFont).setFontSize(12).setTextAlignment(TextAlignment.RIGHT);
            doc.add(totalLine);

            // QR code facture
            String qrPayload = "FACTURE|" + vente.getId()
                    + "|TOTAL=" + String.format("%.2f", vente.getMontantTotal())
                    + "|DATE=" + formattedDate
                    + "|PHARMACIE=" + pharmacie.getNom();
            BarcodeQRCode qrCode = new BarcodeQRCode(qrPayload);
            Image qrImage = new Image(qrCode.createFormXObject(pdfDoc));
            qrImage.scaleToFit(110, 110);
            qrImage.setFixedPosition(pdfDoc.getNumberOfPages(), 40, 40);
            doc.add(qrImage);

            // Pied de page
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("Merci de votre achat")
                    .setFont(font).setFontSize(10).setTextAlignment(TextAlignment.CENTER));

            doc.close();
            log.info("PDF facture généré pour vente {}", venteId);

        } catch (Exception ex) {
            log.error("Erreur génération PDF", ex);
            throw new RuntimeException("Erreur lors de la génération du PDF", ex);
        }

        return baos.toByteArray();
    }
}
