#!/usr/bin/env python3
"""
Generate synthetic ventilator technical specification PDF
for Synthetic_Ventilator_Model_1X with security characteristics
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
import os

def create_synthetic_ventilator_pdf():
    """Create a synthetic ventilator technical specification PDF"""
    
    # Create PDF file
    pdf_path = os.path.join('client', 'public', 'pdf', 'Synthetic_Ventilator_Model_1X_Spec.pdf')
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    
    doc = SimpleDocTemplate(pdf_path, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=18)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a5490'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#2c5282'),
        spaceAfter=12
    )
    
    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=14,
        textColor=colors.HexColor('#2d3748'),
        spaceAfter=10
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=12
    )
    
    # Title
    elements.append(Paragraph("SYNTHETIC VENTILATOR MODEL 1X", title_style))
    elements.append(Paragraph("Technical Specification Document", styles['Heading2']))
    elements.append(Paragraph("Version 2.0 - Security Enhanced Edition", styles['Normal']))
    elements.append(Spacer(1, 0.5*inch))
    
    # Executive Summary
    elements.append(Paragraph("EXECUTIVE SUMMARY", heading_style))
    elements.append(Paragraph(
        "The Synthetic Ventilator Model 1X (SVM-1X) represents a next-generation medical ventilator "
        "designed with comprehensive security features to ensure patient safety, data protection, and "
        "reliable operation in critical care environments. This specification details the security "
        "characteristics implemented across five key domains: Confidentiality, Integrity, Availability, "
        "Human/Trust, and Authentication.",
        normal_style
    ))
    elements.append(Spacer(1, 0.3*inch))
    
    # Table of Security Features Overview
    elements.append(Paragraph("SECURITY FEATURES OVERVIEW", heading_style))
    
    security_overview = [
        ['Characteristic', 'Implementation Level', 'Compliance'],
        ['Confidentiality', 'AES-256 Encryption', 'HIPAA, GDPR'],
        ['Integrity', 'Digital Signatures', 'FDA 21 CFR Part 11'],
        ['Availability', '99.999% Uptime', 'IEC 60601-1'],
        ['Human/Trust', 'Intuitive UI Design', 'IEC 62366'],
        ['Authentication', 'Multi-factor Auth', 'ISO 27001']
    ]
    
    overview_table = Table(security_overview, colWidths=[2.5*inch, 2.5*inch, 2*inch])
    overview_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4299e1')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(overview_table)
    elements.append(PageBreak())
    
    # 1. CONFIDENTIALITY
    elements.append(Paragraph("1. CONFIDENTIALITY", heading_style))
    
    elements.append(Paragraph("1.1 Data Encryption", subheading_style))
    elements.append(Paragraph(
        "The SVM-1X implements AES-256 encryption for all patient data at rest and in transit. "
        "Patient records, ventilation parameters, and monitoring data are encrypted using "
        "FIPS 140-2 validated cryptographic modules. The encryption keys are managed through "
        "a secure key management system with automatic key rotation every 90 days.",
        normal_style
    ))
    
    elements.append(Paragraph("1.2 Access Control", subheading_style))
    elements.append(Paragraph(
        "Role-based access control (RBAC) restricts data access based on user roles: "
        "Physician, Respiratory Therapist, Nurse, and Technician. Each role has predefined "
        "permissions for viewing and modifying patient data. Audit logs track all access "
        "attempts and data modifications.",
        normal_style
    ))
    
    elements.append(Paragraph("1.3 Network Security", subheading_style))
    elements.append(Paragraph(
        "All network communications use TLS 1.3 with mutual authentication. The ventilator "
        "operates on a segregated medical network with firewall protection. External connectivity "
        "is limited to approved hospital information systems through encrypted VPN tunnels.",
        normal_style
    ))
    
    elements.append(Paragraph("Requirements:", styles['Heading4']))
    elements.append(Paragraph("• REQ-CONF-001: Implement AES-256 encryption for all patient data", normal_style))
    elements.append(Paragraph("• REQ-CONF-002: Deploy RBAC with minimum privilege principle", normal_style))
    elements.append(Paragraph("• REQ-CONF-003: Use TLS 1.3 for all network communications", normal_style))
    elements.append(Paragraph("• REQ-CONF-004: Maintain audit logs for 7 years per HIPAA requirements", normal_style))
    
    elements.append(Spacer(1, 0.3*inch))
    
    # 2. INTEGRITY
    elements.append(Paragraph("2. INTEGRITY", heading_style))
    
    elements.append(Paragraph("2.1 Data Validation", subheading_style))
    elements.append(Paragraph(
        "All ventilator parameters undergo real-time validation against clinically acceptable "
        "ranges. The system implements checksums and digital signatures for critical data "
        "transfers. Any data corruption is immediately detected and alerts are generated.",
        normal_style
    ))
    
    elements.append(Paragraph("2.2 Firmware Protection", subheading_style))
    elements.append(Paragraph(
        "Firmware updates are digitally signed by the manufacturer and verified before installation. "
        "Secure boot ensures only authorized firmware can run on the device. The system maintains "
        "firmware integrity through continuous monitoring and tamper detection.",
        normal_style
    ))
    
    elements.append(Paragraph("2.3 Calibration Integrity", subheading_style))
    elements.append(Paragraph(
        "Automated calibration checks occur every 24 hours with results digitally signed and "
        "timestamped. Manual calibration requires two-person verification with biometric "
        "authentication. All calibration data is immutably logged in the system.",
        normal_style
    ))
    
    elements.append(Paragraph("Requirements:", styles['Heading4']))
    elements.append(Paragraph("• REQ-INTG-001: Implement real-time parameter validation", normal_style))
    elements.append(Paragraph("• REQ-INTG-002: Deploy secure boot with firmware signature verification", normal_style))
    elements.append(Paragraph("• REQ-INTG-003: Perform automated calibration checks every 24 hours", normal_style))
    elements.append(Paragraph("• REQ-INTG-004: Use blockchain for immutable calibration logging", normal_style))
    
    elements.append(PageBreak())
    
    # 3. AVAILABILITY
    elements.append(Paragraph("3. AVAILABILITY", heading_style))
    
    elements.append(Paragraph("3.1 Redundancy Systems", subheading_style))
    elements.append(Paragraph(
        "The SVM-1X features dual redundant control systems with automatic failover in <100ms. "
        "Critical components including power supplies, processors, and sensors have N+1 redundancy. "
        "The system maintains full functionality even with single component failure.",
        normal_style
    ))
    
    elements.append(Paragraph("3.2 Power Management", subheading_style))
    elements.append(Paragraph(
        "Triple power source capability: mains power, internal battery (8-hour runtime), and "
        "external battery connection. Automatic power source switching with zero interruption. "
        "Battery health monitoring with predictive replacement alerts 30 days in advance.",
        normal_style
    ))
    
    elements.append(Paragraph("3.3 Fault Tolerance", subheading_style))
    elements.append(Paragraph(
        "Self-diagnostic routines run continuously to detect potential failures. Predictive "
        "maintenance algorithms analyze component wear and schedule preventive maintenance. "
        "Emergency ventilation mode ensures basic life support even during system failures.",
        normal_style
    ))
    
    elements.append(Paragraph("Requirements:", styles['Heading4']))
    elements.append(Paragraph("• REQ-AVAIL-001: Achieve 99.999% uptime (less than 5.26 minutes downtime/year)", normal_style))
    elements.append(Paragraph("• REQ-AVAIL-002: Implement N+1 redundancy for all critical components", normal_style))
    elements.append(Paragraph("• REQ-AVAIL-003: Provide 8-hour battery backup minimum", normal_style))
    elements.append(Paragraph("• REQ-AVAIL-004: Enable emergency ventilation mode within 2 seconds", normal_style))
    
    elements.append(Spacer(1, 0.3*inch))
    
    # 4. HUMAN/TRUST
    elements.append(Paragraph("4. HUMAN/TRUST", heading_style))
    
    elements.append(Paragraph("4.1 User Interface Design", subheading_style))
    elements.append(Paragraph(
        "Intuitive touchscreen interface with context-sensitive help and guided workflows. "
        "Color-coded alarms follow international standards (red: high priority, yellow: medium, "
        "blue: informational). Large, clear displays visible from 5 meters distance.",
        normal_style
    ))
    
    elements.append(Paragraph("4.2 Alarm Management", subheading_style))
    elements.append(Paragraph(
        "Smart alarm system reduces false positives by 70% using AI-based pattern recognition. "
        "Alarm fatigue prevention through intelligent alarm suppression and escalation. "
        "Customizable alarm limits based on patient condition with clinical decision support.",
        normal_style
    ))
    
    elements.append(Paragraph("4.3 Training Integration", subheading_style))
    elements.append(Paragraph(
        "Built-in simulation mode for training without patient connection. Interactive tutorials "
        "for each ventilation mode with competency verification. Continuous learning system "
        "tracks user proficiency and suggests refresher training when needed.",
        normal_style
    ))
    
    elements.append(Paragraph("Requirements:", styles['Heading4']))
    elements.append(Paragraph("• REQ-TRUST-001: Implement intuitive UI with <3 clicks to any function", normal_style))
    elements.append(Paragraph("• REQ-TRUST-002: Reduce false positive alarms by minimum 70%", normal_style))
    elements.append(Paragraph("• REQ-TRUST-003: Provide built-in training mode with certification tracking", normal_style))
    elements.append(Paragraph("• REQ-TRUST-004: Display confidence intervals for all measurements", normal_style))
    
    elements.append(PageBreak())
    
    # 5. AUTHENTICATION
    elements.append(Paragraph("5. AUTHENTICATION", heading_style))
    
    elements.append(Paragraph("5.1 Multi-Factor Authentication", subheading_style))
    elements.append(Paragraph(
        "Two-factor authentication combining smart card and biometric (fingerprint or facial "
        "recognition). Emergency override available with dual-person authentication and "
        "automatic incident reporting. Session timeout after 15 minutes of inactivity.",
        normal_style
    ))
    
    elements.append(Paragraph("5.2 User Management", subheading_style))
    elements.append(Paragraph(
        "Centralized user management integrated with hospital Active Directory. Automatic "
        "deprovisioning when staff leave the organization. Regular access reviews every 90 days "
        "with manager approval required for continued access.",
        normal_style
    ))
    
    elements.append(Paragraph("5.3 Audit Trail", subheading_style))
    elements.append(Paragraph(
        "Comprehensive audit trail captures all authentication attempts, parameter changes, "
        "and system access. Tamper-proof logging with cryptographic signatures. Real-time "
        "alerts for suspicious authentication patterns or unauthorized access attempts.",
        normal_style
    ))
    
    elements.append(Paragraph("Requirements:", styles['Heading4']))
    elements.append(Paragraph("• REQ-AUTH-001: Implement two-factor authentication for all users", normal_style))
    elements.append(Paragraph("• REQ-AUTH-002: Integrate with hospital LDAP/Active Directory", normal_style))
    elements.append(Paragraph("• REQ-AUTH-003: Maintain tamper-proof audit logs for 7 years", normal_style))
    elements.append(Paragraph("• REQ-AUTH-004: Enable emergency override with dual authentication", normal_style))
    
    elements.append(Spacer(1, 0.3*inch))
    
    # SECURITY GAPS AND RECOMMENDATIONS
    elements.append(Paragraph("IDENTIFIED SECURITY GAPS", heading_style))
    
    gaps_data = [
        ['Gap ID', 'Characteristic', 'Description', 'Recommendation'],
        ['GAP-001', 'Confidentiality', 'No quantum-resistant encryption', 'Plan migration to post-quantum cryptography by 2025'],
        ['GAP-002', 'Human/Trust', 'Limited multilingual support', 'Add support for 10 additional languages'],
        ['GAP-003', 'Authentication', 'No continuous authentication', 'Implement behavioral biometrics monitoring'],
        ['GAP-004', 'Integrity', 'Manual supply chain verification', 'Deploy blockchain for component tracking']
    ]
    
    gaps_table = Table(gaps_data, colWidths=[1*inch, 1.5*inch, 2.5*inch, 2*inch])
    gaps_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e53e3e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#fff5f5')),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP')
    ]))
    elements.append(gaps_table)
    
    # Build PDF
    doc.build(elements)
    print(f"PDF created successfully at: {pdf_path}")

if __name__ == "__main__":
    create_synthetic_ventilator_pdf()