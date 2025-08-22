import QRCode from 'qrcode';
import { QRCodeResponse } from '../types';

class QRCodeService {
  private frontendUrl: string;

  constructor() {
    this.frontendUrl = process.env.REACT_APP_FRONTEND_URL || 'https://adyc-platform.vercel.app';
  }

  async generateMemberQR(memberId: string, memberName?: string): Promise<QRCodeResponse> {
    try {
      // Create member verification URL
      const verificationUrl = `${this.frontendUrl}/verify/${memberId}`;

      // Generate QR code as base64 image
      const qrCodeBase64 = await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#FF6600', // ADYC orange
          light: '#FFFFFF'
        },
        width: 256
      });

      // Remove data URL prefix to get just the base64 data
      const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, '');

      return {
        qr_code_base64: base64Data,
        verification_url: verificationUrl,
        member_id: memberId,
        qr_type: 'member_verification'
      };
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`);
    }
  }

  async generateEventQR(eventData: { id: string; [key: string]: any }): Promise<QRCodeResponse> {
    try {
      const eventId = eventData.id;
      const eventUrl = `${this.frontendUrl}/events/${eventId}`;

      const qrCodeBase64 = await QRCode.toDataURL(eventUrl, {
        errorCorrectionLevel: 'M',
        type: 'png',
        margin: 1,
        color: {
          dark: '#2E8B57', // ADYC green
          light: '#FFFFFF'
        },
        width: 200
      });

      const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, '');

      return {
        qr_code_base64: base64Data,
        verification_url: eventUrl,
        member_id: eventId,
        qr_type: 'event_info'
      };
    } catch (error) {
      throw new Error(`Failed to generate event QR code: ${error}`);
    }
  }
}

export default QRCodeService;