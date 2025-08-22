import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { MemberRegistration } from '../types';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async generateIdCardPDF(memberData: MemberRegistration): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: [242.6, 153.1] }); // Credit card size in points
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Generate front side
        this.generateFrontSide(doc, memberData);
        doc.addPage();
        
        // Generate back side
        this.generateBackSide(doc, memberData);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private generateFrontSide(doc: PDFKit.PDFDocument, memberData: MemberRegistration) {
    const cardWidth = 242.6;
    const cardHeight = 153.1;

    // Background
    doc.rect(0, 0, cardWidth, cardHeight).fill('#f8fafc');

    // Enhanced watermark
    doc.save();
    doc.fillOpacity(0.06);
    doc.fillColor('#f8f9fa');
    doc.fontSize(10);
    
    // Watermark pattern
    doc.rotate(30, { origin: [cardWidth/2, cardHeight/2] });
    for (let i = -20; i < 40; i += 12) {
      for (let j = -10; j < 20; j += 8) {
        doc.text('ADYC', i * 2.83, j * 2.83); // Convert mm to points
        doc.text('OFFICIAL', i * 2.83 + 6, j * 2.83 - 6);
      }
    }
    doc.restore();

    // Header section
    doc.fillColor('#f97316');
    doc.fontSize(16);
    doc.text('AFRICAN DEMOCRATIC', 20, 20);
    doc.text('YOUTH CONGRESS', 20, 35);

    // Member information
    doc.fillColor('black');
    doc.fontSize(10);
    doc.text(`NAME: ${memberData.full_name.toUpperCase()}`, 15, 80);
    doc.text(`ID: ${memberData.member_id}`, 15, 95);
    doc.text(`STATE: ${memberData.state.toUpperCase()}`, 15, 110);
    doc.text(`EMAIL: ${memberData.email}`, 130, 80);
    doc.text(`GENDER: ${memberData.gender.toUpperCase()}`, 130, 95);
    doc.text(`DOB: ${memberData.dob}`, 130, 110);

    // Footer
    doc.rect(0, cardHeight - 20, cardWidth, 20).fill('#16a34a');
    doc.fillColor('white');
    doc.fontSize(8);
    doc.text(`S/N: ${memberData.id_card_serial_number || 'SN-UNKNOWN'}`, 10, cardHeight - 15);
    doc.text('VALID NATIONWIDE • ISSUED: 2025', 10, cardHeight - 5);

    // Slogan
    doc.fontSize(9);
    const slogan = "ARISE, IT'S YOUTH O'CLOCK!";
    const sloganWidth = doc.widthOfString(slogan);
    doc.text(slogan, (cardWidth - sloganWidth) / 2, cardHeight - 10);
  }

  private generateBackSide(doc: PDFKit.PDFDocument, memberData: MemberRegistration) {
    const cardWidth = 242.6;
    const cardHeight = 153.1;

    // Background
    doc.rect(0, 0, cardWidth, cardHeight).fill('#f8fafc');

    // Header
    doc.rect(0, cardHeight - 40, cardWidth, 40).fill('#16a34a');
    doc.fillColor('white');
    doc.fontSize(12);
    doc.text('AFRICAN DEMOCRATIC YOUTH CONGRESS', 15, cardHeight - 35);
    doc.fontSize(10);
    doc.text('MEMBERSHIP TERMS & CONDITIONS', 15, cardHeight - 20);

    // Terms and conditions
    doc.fillColor('black');
    doc.fontSize(8);
    const terms = [
      '• This card is the property of ADYC and must be returned upon request.',
      '• Misuse of this card is prohibited and may result in membership termination.',
      '• Report lost or stolen cards immediately to ADYC administration.',
      '• This card grants access to ADYC programs and events nationwide.',
      '• Valid for active members in good standing only.'
    ];

    let yPos = 30;
    terms.forEach(term => {
      doc.text(term, 10, yPos);
      yPos += 12;
    });

    // Contact Information
    doc.fillColor('#f97316');
    doc.fontSize(10);
    doc.text('CONTACT INFORMATION:', 10, yPos + 10);
    
    doc.fillColor('black');
    doc.fontSize(8);
    doc.text('Phone: 08156257998', 10, yPos + 25);
    doc.text('Email: africandemocraticyouthcongress@gmail.com', 10, yPos + 40);

    // Footer with social media
    doc.rect(0, 0, cardWidth, 25).fill('#059669');
    doc.fillColor('white');
    doc.fontSize(8);
    doc.text('OFFICIAL MEMBERSHIP CARD', 10, 15);
    doc.fontSize(6);
    doc.text('WhatsApp: wa.me/c/2349156257998 | TikTok: @adyc676', 10, 5);
  }

  async sendRegistrationEmail(memberData: MemberRegistration): Promise<boolean> {
    try {
      // Generate ID card PDF
      const pdfBuffer = await this.generateIdCardPDF(memberData);

      const htmlBody = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://customer-assets.emergentagent.com/job_c6e56cf6-bfc9-4e7f-baab-fad031a53cd0/artifacts/wqczelzo_ADYC%20LOGO%202-1.jpg" 
                     alt="ADYC Logo" style="width: 100px; height: 100px; margin-bottom: 20px;">
                <h1 style="color: #f97316; margin: 0;">Welcome to ADYC!</h1>
                <p style="font-size: 18px; color: #22c55e; font-weight: bold;">African Democratic Youth Congress</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0;">Dear ${memberData.full_name},</h2>
                
                <p>Congratulations! Your registration with the African Democratic Youth Congress has been successfully completed.</p>
                
                <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #f97316;">
                  <h3 style="margin-top: 0; color: #f97316;">Your Membership Details:</h3>
                  <p><strong>Member ID:</strong> ${memberData.member_id}</p>
                  <p><strong>Full Name:</strong> ${memberData.full_name}</p>
                  <p><strong>Email:</strong> ${memberData.email}</p>
                  <p><strong>State:</strong> ${memberData.state}</p>
                  <p><strong>Local Government Area:</strong> ${memberData.lga}</p>
                  <p><strong>Ward:</strong> ${memberData.ward}</p>
                  <p><strong>Gender:</strong> ${memberData.gender}</p>
                  <p><strong>Registration Date:</strong> ${new Date(memberData.registration_date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div style="background-color: #22c55e; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                <h3 style="margin-top: 0;">Your Official ADYC ID Card</h3>
                <p>We've attached your official ADYC membership ID card as a PDF. Please keep this safe as it serves as proof of your membership.</p>
                <p style="font-size: 16px; font-weight: bold;">📎 ADYC_ID_Card_${memberData.member_id}.pdf</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <h2 style="color: #f97316; font-style: italic;">"Arise, It's Youth O'Clock!"</h2>
              </div>
              
              <div style="border-top: 2px solid #f97316; padding-top: 20px; text-align: center; color: #666;">
                <p><strong>African Democratic Youth Congress (ADYC)</strong></p>
                <p>Email: africandemocraticyouthcongress@gmail.com</p>
                <p>Building a better Nigeria through youth empowerment and democratic participation.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: memberData.email,
        subject: 'Welcome to ADYC - Your Membership Confirmation',
        html: htmlBody,
        attachments: [
          {
            filename: `ADYC_ID_Card_${memberData.member_id}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });

      return true;
    } catch (error) {
      console.error('Error sending registration email:', error);
      return false;
    }
  }

  async sendAdminNotificationEmail(memberData: MemberRegistration): Promise<boolean> {
    try {
      const pdfBuffer = await this.generateIdCardPDF(memberData);

      const htmlBody = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://customer-assets.emergentagent.com/job_c6e56cf6-bfc9-4e7f-baab-fad031a53cd0/artifacts/wqczelzo_ADYC%20LOGO%202-1.jpg" 
                     alt="ADYC Logo" style="width: 80px; height: 80px; margin-bottom: 15px;">
                <h1 style="color: #f97316; margin: 0;">New Member Registration</h1>
                <p style="font-size: 16px; color: #22c55e; font-weight: bold;">African Democratic Youth Congress</p>
              </div>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                <h2 style="color: #92400e; margin-top: 0;">🎉 New Member Alert!</h2>
                <p style="color: #92400e; font-size: 16px;">A new member has successfully registered with ADYC. Please find their details below:</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="color: #f97316; margin-top: 0;">Member Information:</h3>
                
                <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                  <p style="margin: 5px 0;"><strong style="color: #374151;">Full Name:</strong> <span style="color: #1f2937;">${memberData.full_name}</span></p>
                  <p style="margin: 5px 0;"><strong style="color: #374151;">Member ID:</strong> <span style="color: #f97316; font-weight: bold;">${memberData.member_id}</span></p>
                  <p style="margin: 5px 0;"><strong style="color: #374151;">Email:</strong> <span style="color: #1f2937;">${memberData.email}</span></p>
                  <p style="margin: 5px 0;"><strong style="color: #374151;">Gender:</strong> <span style="color: #1f2937;">${memberData.gender}</span></p>
                  <p style="margin: 5px 0;"><strong style="color: #374151;">Date of Birth:</strong> <span style="color: #1f2937;">${memberData.dob}</span></p>
                </div>
                
                <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                  <h4 style="color: #22c55e; margin-top: 0;">📍 Location Details:</h4>
                  <p style="margin: 5px 0;"><strong style="color: #374151;">State:</strong> <span style="color: #1f2937;">${memberData.state}</span></p>
                  <p style="margin: 5px 0;"><strong style="color: #374151;">Local Government Area (LGA):</strong> <span style="color: #1f2937;">${memberData.lga}</span></p>
                  <p style="margin: 5px 0;"><strong style="color: #374151;">Ward:</strong> <span style="color: #1f2937;">${memberData.ward}</span></p>
                  <p style="margin: 5px 0;"><strong style="color: #374151;">Country:</strong> <span style="color: #1f2937;">${memberData.country}</span></p>
                  <p style="margin: 5px 0;"><strong style="color: #374151;">Address:</strong> <span style="color: #1f2937;">${memberData.address}</span></p>
                </div>
                
                <div style="background-color: #e0f2fe; padding: 15px; border-radius: 5px; border-left: 4px solid #0277bd;">
                  <p style="margin: 5px 0;"><strong style="color: #01579b;">Registration Date:</strong> <span style="color: #01579b;">${new Date(memberData.registration_date).toLocaleString()}</span></p>
                  <p style="margin: 5px 0;"><strong style="color: #01579b;">Marital Status:</strong> <span style="color: #01579b;">${memberData.marital_status || 'Not specified'}</span></p>
                  <p style="margin: 5px 0;"><strong style="color: #01579b;">Language:</strong> <span style="color: #01579b;">${memberData.language || 'Not specified'}</span></p>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <h2 style="color: #f97316; font-style: italic;">"Arise, It's Youth O'Clock!"</h2>
              </div>
              
              <div style="border-top: 2px solid #f97316; padding-top: 20px; text-align: center; color: #666;">
                <p><strong>ADYC Admin Notification System</strong></p>
                <p>This is an automated notification. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: process.env.EMAIL_USERNAME, // Send to admin email
        subject: `🔔 New ADYC Member Registration - ${memberData.full_name}`,
        html: htmlBody,
        attachments: [
          {
            filename: `ADYC_ID_Card_${memberData.member_id}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });

      return true;
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      return false;
    }
  }
}

export default EmailService;