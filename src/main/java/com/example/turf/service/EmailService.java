package com.example.turf.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    private static final String FROM_EMAIL = "noreply@turfmanagement.com";
    private static final String APP_NAME = "Turf Management System";
    private static final long OTP_VALIDITY_MINUTES = 10;

    /**
     * Send OTP verification email with HTML formatting
     */
    public boolean sendVerificationEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setFrom(FROM_EMAIL);
            helper.setSubject("🔐 Verify Your " + APP_NAME + " Account");
            
            String htmlContent = buildVerificationEmailHtml(otp);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Verification email sent successfully to: {}", toEmail);
            return true;
        } catch (MessagingException | MailException e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
            return false;
        }
    }

    /**
     * Send password reset email
     */
    public boolean sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setFrom(FROM_EMAIL);
            helper.setSubject("🔑 Reset Your " + APP_NAME + " Password");
            
            String htmlContent = buildPasswordResetEmailHtml(resetToken);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email sent successfully to: {}", toEmail);
            return true;
        } catch (MessagingException | MailException e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            return false;
        }
    }

    /**
     * Send welcome email after successful verification
     */
    public boolean sendWelcomeEmail(String toEmail, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setFrom(FROM_EMAIL);
            helper.setSubject("✅ Welcome to " + APP_NAME + "!");
            
            String htmlContent = buildWelcomeEmailHtml(username);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Welcome email sent successfully to: {}", toEmail);
            return true;
        } catch (MessagingException | MailException e) {
            log.error("Failed to send welcome email to: {}", toEmail, e);
            return false;
        }
    }

    /**
     * Build HTML content for verification email
     */
    private String buildVerificationEmailHtml(String otp) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <style>" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }" +
                "        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }" +
                "        .header { background: linear-gradient(135deg, #4df33b, #00cc6a); padding: 30px; text-align: center; color: white; }" +
                "        .header h1 { margin: 0; font-size: 28px; }" +
                "        .content { padding: 40px 30px; }" +
                "        .greeting { font-size: 16px; color: #333; margin-bottom: 20px; }" +
                "        .otp-box { background-color: #f9f9f9; border: 2px solid #4df33b; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }" +
                "        .otp-text { font-size: 14px; color: #666; margin-bottom: 10px; }" +
                "        .otp-code { font-size: 32px; font-weight: bold; color: #4df33b; letter-spacing: 5px; font-family: 'Courier New', monospace; }" +
                "        .validity { font-size: 12px; color: #999; text-align: center; margin-top: 15px; }" +
                "        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; }" +
                "        .note { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 13px; color: #856404; }" +
                "        .button { display: inline-block; background-color: #4df33b; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; margin: 20px 0; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>🎯 Turf Management System</h1>" +
                "            <p style='margin: 10px 0 0 0;'>Email Verification</p>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <p class='greeting'>Hello,</p>" +
                "            <p>Thank you for signing up! To complete your registration, please verify your email address using the code below:</p>" +
                "            <div class='otp-box'>" +
                "                <div class='otp-text'>Your Verification Code:</div>" +
                "                <div class='otp-code'>" + otp + "</div>" +
                "                <div class='validity'>Valid for " + OTP_VALIDITY_MINUTES + " minutes</div>" +
                "            </div>" +
                "            <p>Enter this code on the verification page to activate your account.</p>" +
                "            <div class='note'>" +
                "                <strong>⚠️ Security Note:</strong> Never share this code with anyone. Our team will never ask for your OTP via email or phone." +
                "            </div>" +
                "            <p style='margin-top: 30px;'>If you didn't create this account, please ignore this email.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>© 2024 Turf Management System. All rights reserved.</p>" +
                "            <p>If you have any questions, contact us at support@turfmanagement.com</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Build HTML content for password reset email
     */
    private String buildPasswordResetEmailHtml(String resetToken) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <style>" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }" +
                "        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }" +
                "        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a6f); padding: 30px; text-align: center; color: white; }" +
                "        .content { padding: 40px 30px; }" +
                "        .button { display: inline-block; background-color: #ff6b6b; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; margin: 20px 0; text-align: center; }" +
                "        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>🔑 Password Reset Request</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <p>We received a request to reset your password. Use the token below:</p>" +
                "            <p style='background-color: #f9f9f9; padding: 15px; border-radius: 5px; font-family: monospace;'><strong>" + resetToken + "</strong></p>" +
                "            <p>This token will expire in 1 hour. If you didn't request this, please ignore this email.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>© 2024 Turf Management System</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Build HTML content for welcome email
     */
    private String buildWelcomeEmailHtml(String username) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <style>" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }" +
                "        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }" +
                "        .header { background: linear-gradient(135deg, #4df33b, #00cc6a); padding: 30px; text-align: center; color: white; }" +
                "        .content { padding: 40px 30px; }" +
                "        .feature { margin: 15px 0; padding-left: 20px; }" +
                "        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>✅ Welcome " + username + "!</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <p>Your email has been successfully verified!</p>" +
                "            <p>You can now log in to your account and start booking turf fields.</p>" +
                "            <div class='feature'>🎯 Browse available turfs</div>" +
                "            <div class='feature'>📅 Book your slots</div>" +
                "            <div class='feature'>💳 Make secure payments</div>" +
                "            <p style='margin-top: 30px;'>If you have any questions, feel free to reach out to our support team.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>© 2024 Turf Management System</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}
