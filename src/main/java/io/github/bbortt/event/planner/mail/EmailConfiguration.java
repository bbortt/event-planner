package io.github.bbortt.event.planner.mail;

record EmailConfiguration(String fromEmail, String toEmail, String subject, String htmlContent) {}
