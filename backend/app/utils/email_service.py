import smtplib
import secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Optional
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    """Service for sending emails"""
    
    def __init__(self):
        self.smtp_server = settings.MAIL_SERVER
        self.smtp_port = settings.MAIL_PORT
        self.username = settings.MAIL_USERNAME
        self.password = settings.MAIL_PASSWORD
        self.from_email = settings.MAIL_FROM or settings.MAIL_USERNAME
        self.from_name = settings.MAIL_FROM_NAME
        self.frontend_url = settings.FRONTEND_URL
    
    def _send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send an email using SMTP"""
        try:
            if not self.username or not self.password:
                logger.warning("Email credentials not configured. Email not sent.")
                print(f"[EMAIL SIMULATION] To: {to_email}")
                print(f"[EMAIL SIMULATION] Subject: {subject}")
                print(f"[EMAIL SIMULATION] Would send email with content")
                return True
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.sendmail(self.from_email, to_email, msg.as_string())
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def generate_verification_token(self) -> str:
        """Generate a secure random token for email verification"""
        return secrets.token_urlsafe(32)
    
    def send_verification_email(self, to_email: str, user_name: str, token: str) -> bool:
        """Send email verification link to new user"""
        verification_link = f"{self.frontend_url}/verify-email?token={token}"
        
        subject = "Verify Your Email - IIoT Security Dashboard"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                            <!-- Header -->
                            <tr>
                                <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #475569;">
                                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); border-radius: 12px; display: inline-block; line-height: 60px;">
                                        <span style="font-size: 30px;">🛡️</span>
                                    </div>
                                    <h1 style="color: #f8fafc; margin: 20px 0 0; font-size: 24px; font-weight: 600;">IIoT Security Dashboard</h1>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px;">
                                    <h2 style="color: #f8fafc; margin: 0 0 20px; font-size: 20px;">Hello {user_name}! 👋</h2>
                                    <p style="color: #94a3b8; line-height: 1.6; margin: 0 0 25px;">
                                        Thank you for registering with the IIoT Security Dashboard. To complete your registration and verify your email address, please click the button below:
                                    </p>
                                    
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="padding: 20px 0;">
                                                <a href="{verification_link}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px -5px rgba(6, 182, 212, 0.4);">
                                                    Verify Email Address
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="color: #64748b; font-size: 14px; margin: 25px 0 0; padding-top: 20px; border-top: 1px solid #475569;">
                                        This verification link will expire in <strong style="color: #f8fafc;">24 hours</strong>. If you didn't create an account, you can safely ignore this email.
                                    </p>
                                    
                                    <p style="color: #64748b; font-size: 12px; margin: 20px 0 0;">
                                        Or copy and paste this link in your browser:<br>
                                        <span style="color: #06b6d4; word-break: break-all;">{verification_link}</span>
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 20px 40px; background-color: #0f172a; text-align: center;">
                                    <p style="color: #64748b; font-size: 12px; margin: 0;">
                                        © 2026 IIoT Security Dashboard - FYP Project<br>
                                        DQN-GNN Based FDI Attack Detection System
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        return self._send_email(to_email, subject, html_content)
    
    def send_approval_email(self, to_email: str, user_name: str) -> bool:
        """Send notification email when user is approved"""
        login_link = f"{self.frontend_url}/login"
        
        subject = "🎉 Account Approved - IIoT Security Dashboard"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                            <!-- Header with success gradient -->
                            <tr>
                                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #059669 0%, #10b981 100%);">
                                    <div style="font-size: 50px; margin-bottom: 10px;">✅</div>
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Account Approved!</h1>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px;">
                                    <h2 style="color: #f8fafc; margin: 0 0 20px; font-size: 20px;">Great news, {user_name}! 🎉</h2>
                                    <p style="color: #94a3b8; line-height: 1.6; margin: 0 0 25px;">
                                        Your account has been reviewed and <strong style="color: #10b981;">approved</strong> by our administrator. You now have full access to the IIoT Security Dashboard.
                                    </p>
                                    
                                    <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; margin: 20px 0;">
                                        <h3 style="color: #f8fafc; margin: 0 0 15px; font-size: 16px;">What you can do now:</h3>
                                        <ul style="color: #94a3b8; padding-left: 20px; margin: 0;">
                                            <li style="margin-bottom: 10px;">🔍 Monitor IIoT sensor data in real-time</li>
                                            <li style="margin-bottom: 10px;">🚨 View and manage security alerts</li>
                                            <li style="margin-bottom: 10px;">📊 Access analytics and attack statistics</li>
                                            <li style="margin-bottom: 10px;">🌐 Explore network topology visualization</li>
                                        </ul>
                                    </div>
                                    
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="padding: 20px 0;">
                                                <a href="{login_link}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);">
                                                    Login to Dashboard
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 20px 40px; background-color: #0f172a; text-align: center;">
                                    <p style="color: #64748b; font-size: 12px; margin: 0;">
                                        © 2026 IIoT Security Dashboard - FYP Project<br>
                                        DQN-GNN Based FDI Attack Detection System
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        return self._send_email(to_email, subject, html_content)
    
    def send_rejection_email(self, to_email: str, user_name: str, reason: Optional[str] = None) -> bool:
        """Send notification email when user registration is declined"""
        
        subject = "Registration Status Update - IIoT Security Dashboard"
        
        reason_text = ""
        if reason:
            reason_text = f"""
            <div style="background-color: #1e1e2e; border-left: 4px solid #f97316; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #f8fafc; margin: 0 0 5px; font-weight: 600;">Reason:</p>
                <p style="color: #94a3b8; margin: 0;">{reason}</p>
            </div>
            """
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                            <!-- Header -->
                            <tr>
                                <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #475569;">
                                    <div style="font-size: 50px; margin-bottom: 10px;">📋</div>
                                    <h1 style="color: #f8fafc; margin: 0; font-size: 24px; font-weight: 600;">Registration Update</h1>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px;">
                                    <h2 style="color: #f8fafc; margin: 0 0 20px; font-size: 20px;">Hello {user_name},</h2>
                                    <p style="color: #94a3b8; line-height: 1.6; margin: 0 0 25px;">
                                        Thank you for your interest in the IIoT Security Dashboard. After reviewing your registration request, we regret to inform you that your application has not been approved at this time.
                                    </p>
                                    
                                    {reason_text}
                                    
                                    <p style="color: #94a3b8; line-height: 1.6; margin: 25px 0 0;">
                                        If you believe this was a mistake or would like to reapply with additional information, please contact your system administrator or submit a new registration request.
                                    </p>
                                    
                                    <div style="margin-top: 30px; padding: 20px; background-color: #0f172a; border-radius: 12px; text-align: center;">
                                        <p style="color: #64748b; font-size: 14px; margin: 0;">
                                            Need assistance? Contact support for help.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 20px 40px; background-color: #0f172a; text-align: center;">
                                    <p style="color: #64748b; font-size: 12px; margin: 0;">
                                        © 2026 IIoT Security Dashboard - FYP Project<br>
                                        DQN-GNN Based FDI Attack Detection System
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        return self._send_email(to_email, subject, html_content)


# Create singleton instance
email_service = EmailService()
