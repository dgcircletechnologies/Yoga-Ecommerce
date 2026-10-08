import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter?: Transporter;
  private readonly from?: string;

  constructor(config: ConfigService) {
    const host = config.get<string>('mail.host');
    const user = config.get<string>('mail.user');
    const password = config.get<string>('mail.password');
    const fromEmail = config.get<string>('mail.fromEmail');
    if (host && user && password && fromEmail) {
      this.transporter = nodemailer.createTransport({ host, port: config.get<number>('mail.port') ?? 587, secure: config.get<boolean>('mail.secure') ?? false, auth: { user, pass: password } });
      this.from = `${config.get<string>('mail.fromName') ?? 'Yoga Fitness'} <${fromEmail}>`;
    } else {
      this.logger.warn('Order email notifications are disabled: mail configuration is incomplete.');
    }
  }

  async sendMail(options: { to: string; subject: string; html: string; text: string }) {
    if (!this.transporter || !this.from) return;
    await this.transporter.sendMail({ from: this.from, ...options });
  }
}
