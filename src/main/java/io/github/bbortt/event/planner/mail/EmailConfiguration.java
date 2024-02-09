package io.github.bbortt.event.planner.mail;

public record EmailConfiguration(String fromEmail, String toEmail, String subject, String htmlContent) {}
