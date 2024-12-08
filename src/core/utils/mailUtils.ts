import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { logger } from './logger';
import nodemailer from 'nodemailer'

@Injectable()
export class MailUtils {


  public static async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'anandmar883@gmail.com',
        pass: 'juys mnqs xpxv ysnx',
      },
    });

    const mailOptions = {
      from: 'anandroyal147@gmail.com',
      to: email,
      subject: 'Verify your email address',
      text: `Your verification code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  }

}

export interface MailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  cc?: string[];
  attachments?: AttachmentOptions[];
}

export interface AttachmentOptions {
  filename: string;
  content: any;
  type?: string;
  disposition?: string;
}
