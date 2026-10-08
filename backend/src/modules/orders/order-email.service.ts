import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../mail/mail.service.js';
import { adminNewOrder, confirmation, statusUpdate } from '../../templates/order-email.templates.js';

@Injectable()
export class OrderEmailService {
  private readonly logger = new Logger(OrderEmailService.name);
  constructor(private readonly mail: MailService, private readonly config: ConfigService) {}
  private url(base: string | undefined, path: string) { return `${(base ?? '').replace(/\/$/, '')}${path}`; }
  private async send(kind: string, orderId: string, email: string, message: { subject: string; html: string; text: string }) { try { await this.mail.sendMail({ to: email, ...message }); } catch (error) { this.logger.error(`Failed to send ${kind} email orderId=${orderId} customerEmail=${email}`, error instanceof Error ? error.stack : String(error)); } }
  async sendOrderConfirmation(order: any) { const message = confirmation(order, this.url(this.config.get('mail.frontendUrl'), `/orders/${encodeURIComponent(order.id)}`)); await this.send('order confirmation', order.id, order.email, message); const admin = this.config.get<string>('mail.adminEmail'); if (admin) await this.send('admin new-order notification', order.id, admin, adminNewOrder(order, this.url(this.config.get('mail.adminUrl'), `/orders/${encodeURIComponent(order.id)}`))); }
  async sendOrderStatusUpdate(order: any, oldStatus: string) { await this.send('order status update', order.id, order.email, statusUpdate(order, oldStatus, this.url(this.config.get('mail.frontendUrl'), `/orders/${encodeURIComponent(order.id)}`))); }
}
