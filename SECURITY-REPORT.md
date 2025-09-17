# Security Report - CouncilWorks - Asset Lifecycle Intelligence Platform

**Generated:** 16/09/2025, 2:54:21 pm  
**Version:** 0.2.0  
**Overall Security Score:** 0/100

## Executive Summary

This comprehensive security report analyzes the CouncilWorks codebase for security vulnerabilities, misconfigurations, and best practices compliance.

### Security Score Breakdown

- **Critical Issues:** 0
- **High Issues:** 6
- **Medium Issues:** 5
- **Low Issues:** 0
- **Total Issues:** 11

## Detailed Findings

### Raw SQL query detected

- **Category:** SQL Injection
- **Severity:** HIGH
- **Status:** open
- **Description:** Raw SQL queries detected - ensure proper parameterization
- **File:** app/api/assets/spatial/route.ts

- **Recommendation:** Use Prisma ORM methods or ensure proper parameterization of raw queries

### Dangerous HTML rendering

- **Category:** XSS
- **Severity:** MEDIUM
- **Status:** open
- **Description:** dangerouslySetInnerHTML detected - ensure content is sanitized
- **File:** app/layout.tsx

- **Recommendation:** Sanitize HTML content or use safer alternatives

### Dangerous HTML rendering

- **Category:** XSS
- **Severity:** MEDIUM
- **Status:** open
- **Description:** dangerouslySetInnerHTML detected - ensure content is sanitized
- **File:** app/page.tsx

- **Recommendation:** Sanitize HTML content or use safer alternatives

### Raw SQL query detected

- **Category:** SQL Injection
- **Severity:** HIGH
- **Status:** open
- **Description:** Raw SQL queries detected - ensure proper parameterization
- **File:** lib/migration/migration-service.ts

- **Recommendation:** Use Prisma ORM methods or ensure proper parameterization of raw queries

### Raw SQL query detected

- **Category:** SQL Injection
- **Severity:** HIGH
- **Status:** open
- **Description:** Raw SQL queries detected - ensure proper parameterization
- **File:** lib/rls.ts

- **Recommendation:** Use Prisma ORM methods or ensure proper parameterization of raw queries

### Raw SQL query detected

- **Category:** SQL Injection
- **Severity:** HIGH
- **Status:** open
- **Description:** Raw SQL queries detected - ensure proper parameterization
- **File:** scripts/generate-security-report.ts

- **Recommendation:** Use Prisma ORM methods or ensure proper parameterization of raw queries

### Dangerous HTML rendering

- **Category:** XSS
- **Severity:** MEDIUM
- **Status:** open
- **Description:** dangerouslySetInnerHTML detected - ensure content is sanitized
- **File:** scripts/generate-security-report.ts

- **Recommendation:** Sanitize HTML content or use safer alternatives

### Potential authentication bypass

- **Category:** Authentication
- **Severity:** HIGH
- **Status:** open
- **Description:** Code contains authentication bypass logic
- **File:** scripts/generate-security-report.ts

- **Recommendation:** Review authentication logic for security implications

### Raw SQL query detected

- **Category:** SQL Injection
- **Severity:** HIGH
- **Status:** open
- **Description:** Raw SQL queries detected - ensure proper parameterization
- **File:** scripts/test-postgis.ts

- **Recommendation:** Use Prisma ORM methods or ensure proper parameterization of raw queries

### Security headers not configured

- **Category:** Configuration
- **Severity:** MEDIUM
- **Status:** open
- **Description:** Next.js security headers not explicitly configured
- **File:** next.config.ts

- **Recommendation:** Configure security headers in Next.js configuration

### CORS not explicitly configured

- **Category:** Configuration
- **Severity:** MEDIUM
- **Status:** open
- **Description:** CORS policy not explicitly configured in middleware
- **File:** middleware.ts

- **Recommendation:** Configure CORS policy for API endpoints

## Security Recommendations

- Implement automated security scanning in CI/CD pipeline
- Regular dependency updates and vulnerability scanning
- Code review process for security-sensitive changes
- Security training for development team
- Regular penetration testing
- Implement security monitoring and alerting
- Maintain security documentation and incident response procedures

## Next Steps

1. **Immediate Actions:**
   - Address all critical and high severity findings
   - Implement security monitoring
   - Review and update security policies

2. **Short-term Actions:**
   - Address medium severity findings
   - Implement automated security scanning
   - Conduct security training

3. **Long-term Actions:**
   - Regular security assessments
   - Penetration testing
   - Security architecture review

## Compliance Status

- **ISO 27001:** ⚠️ Needs attention
- **ISO 27002:** ⚠️ Needs attention
- **OWASP Top 10:** ⚠️ Needs attention

---

_This report was generated automatically. Please review all findings and implement appropriate security measures._
