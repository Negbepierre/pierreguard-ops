# Product Requirements Document
## PierreGuard Ops — AI Security Operations Centre
**Version:** 1.0
**Author:** Inegbenose Pierre
**Date:** April 2026
**Status:** Live

---

## 1. Problem Statement

Security teams in cloud environments face an overwhelming volume of signals.
GuardDuty generates findings. CloudTrail logs every API call. VPC Flow Logs
track network traffic. Most organisations have the data but lack the
capacity to analyse it continuously. Security incidents go undetected for
days because analysts are drowning in noise.

PierreGuard Ops gives security teams an AI-powered operations centre that
pulls live threat data from multiple AWS services, reasons about the
combination of signals, and produces a prioritised security report in under
60 seconds. It turns raw AWS telemetry into actionable intelligence.

---

## 2. Goal

Build an AI-powered Security Operations Centre that:
- Monitors a live AWS environment using GuardDuty, CloudTrail, and VPC data
- Assesses threats against the PierreGuard Security Standards knowledge base
- Produces a threat level classification and detailed security report
- Displays the VPC security architecture with NACL and Security Group rules
- Shows a live CloudTrail event feed with severity classification per event

---

## 3. Target Users

| User | Need |
|------|------|
| Security Engineer | Monitor the AWS environment for active threats |
| SOC Analyst | Triage GuardDuty findings with AI-assisted context |
| CISO | Understand the overall threat posture at a glance |
| Cloud Architect | Validate VPC security architecture against best practices |

---

## 4. Core Features

### 4.1 Authentication
- Staff login with email and password
- Three demo users covering CSO, Analyst, and SOC Engineer roles
- Session persistence via localStorage

### 4.2 Monitored Environment Display
- Connected AWS account details before scan
- Live status indicator
- Services monitored: GuardDuty, CloudTrail, VPC
- VPC architecture summary showing subnets, security groups, and NACL

### 4.3 Live Security Data Fetching
- GuardDuty: pulls all active findings with severity 4 and above
- CloudTrail: pulls last 24 hours of management events up to 20 events
- VPC: pulls live configuration including subnets, security groups,
  NACLs, and internet gateway from the deployed CloudFormation stack

### 4.4 RAG-Powered Threat Analysis
- PierreGuard Security Standards retrieved from Bedrock Knowledge Base
- Claude analyses the combination of GuardDuty findings, CloudTrail
  events, and VPC architecture against retrieved standards
- Report structured into: Threat Summary, Active Threats, Suspicious
  Activity, VPC Assessment, Immediate Actions, and Compliance

### 4.5 Security Dashboard
- Threat level badge: CRITICAL, HIGH, MEDIUM, or LOW
- Stats bar: GuardDuty findings count, CloudTrail events count, subnet count
- Compliance status: CIS AWS Benchmark, SOC2, ISO27001
- AI Threat Analysis panel with tabbed sections
- VPC Security Architecture panel with visual NACL rules
- CloudTrail Event Feed table with per-event severity classification

---

## 5. Technical Architecture
```
[React Frontend — Netlify]
        ↓ POST /api/ops-scan
[Python Flask Backend — Render]
        ↓ boto3 — AWS Bedrock Knowledge Bases
[PierreGuard Security Standards — S3 Vectors]
        ↓ boto3 — Amazon GuardDuty
[Live threat findings]
        ↓ boto3 — AWS CloudTrail
[Last 24 hours API events]
        ↓ boto3 — Amazon EC2 API
[VPC configuration — CloudFormation stack]
        ↓ boto3 — AWS Bedrock Runtime
[Claude 3 Haiku — threat analysis]
        ↓ JSON response
[React Dashboard]
```

---

## 6. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + Vite | Component-based UI |
| Styling | Tailwind CSS | Rapid UI development |
| Backend | Python + Flask | Lightweight API server |
| Threat Detection | Amazon GuardDuty | Managed AWS threat detection |
| Audit Logging | AWS CloudTrail | Complete API activity trail |
| Network Security | VPC, Security Groups, NACLs | Defence in depth architecture |
| Infrastructure | AWS CloudFormation | Infrastructure as Code |
| AI Model | Claude 3 Haiku via AWS Bedrock | Fast threat analysis |
| Knowledge Base | Amazon Bedrock Knowledge Bases | RAG pipeline for standards |
| Vector Store | Amazon S3 Vectors | Pay-as-you-go vector storage |
| Hosting Frontend | Netlify | Free, Git-connected deployment |
| Hosting Backend | Render | Python support, always-on |
| Version Control | Git + GitHub | Professional commit history |

---

## 7. VPC Architecture

The VPC was deployed using AWS CloudFormation — Infrastructure as Code.
The template creates the entire network stack from a single YAML file,
demonstrating production-grade infrastructure management.

**Components deployed:**

| Resource | Configuration | Purpose |
|----------|--------------|---------|
| VPC | 10.0.0.0/16 | Isolated network boundary |
| Public Subnet A | 10.0.1.0/24 — us-east-1a | High availability zone 1 |
| Public Subnet B | 10.0.2.0/24 — us-east-1b | High availability zone 2 |
| Internet Gateway | Attached to VPC | Public internet connectivity |
| Route Table | 0.0.0.0/0 via IGW | Traffic routing for public subnets |
| Security Group | HTTPS 443 inbound only | Stateful instance-level firewall |
| Network ACL | Explicit deny and allow rules | Stateless subnet-level firewall |

**NACL Rules — Defence in Depth:**

The NACL provides a second layer of protection at the subnet level.
Unlike Security Groups which are stateful, NACLs are stateless — both
inbound and outbound traffic must be explicitly permitted. This is a
critical distinction tested in the AWS Security Specialty exam.

| Rule | Action | Port | Reason |
|------|--------|------|--------|
| 50 | DENY | 22 (SSH) | Prevents unauthorised remote access |
| 60 | DENY | 3389 (RDP) | Blocks Windows remote desktop attacks |
| 70 | DENY | 23 (Telnet) | Eliminates unencrypted protocol exposure |
| 100 | ALLOW | 443 (HTTPS) | Encrypted web traffic only |
| 200 | ALLOW | 1024-65535 | Ephemeral ports for return traffic |

**Two availability zones** provide high availability. If one AWS data
centre experiences an outage, traffic fails over to the second subnet
automatically.

---

## 8. IAM Security Design

A dedicated IAM user `pierreguard-ops-dev` was created with minimum
required permissions following the principle of least privilege.

| Policy | Purpose | Access Level |
|--------|---------|-------------|
| AmazonGuardDutyReadOnlyAccess | Read GuardDuty findings | Read only |
| AWSCloudTrail_ReadOnlyAccess | Read CloudTrail events | Read only |
| AmazonEC2ReadOnlyAccess | Read VPC configuration | Read only |
| AmazonBedrockFullAccess | Call Claude and query KB | Inference only |

If these credentials were ever compromised, an attacker could only read
security data. They could not disable GuardDuty, delete CloudTrail
trails, modify network infrastructure, or create new IAM users.

---

## 9. Security Incident — Credential Exposure

During development, AWS credentials were accidentally committed to Git.
GitHub secret scanning blocked the push immediately. The credentials were
rotated within minutes, the git history was cleaned using `git
filter-branch`, and the clean history was force pushed. No credentials
were ever publicly accessible.

This incident reinforced the importance of having `.env` in `.gitignore`
before the first commit and using GitHub secret scanning as a safety net.

---

## 10. Success Criteria

- [x] User can log in with PierreGuard credentials
- [x] Monitored environment displayed before scan
- [x] Live GuardDuty findings pulled from AWS account
- [x] Live CloudTrail events pulled from last 24 hours
- [x] VPC architecture pulled from CloudFormation stack
- [x] AI threat analysis produced against PierreGuard standards
- [x] NACL rules displayed with deny and allow explanations
- [x] CloudTrail events classified by severity
- [x] Application live at a public URL
- [x] VPC deployed via CloudFormation

---

## 11. AWS Security Specialty Exam Coverage

This project directly covers the following exam domains:

| Exam Domain | Implementation |
|-------------|---------------|
| Infrastructure security | VPC, subnets, security groups, NACLs |
| Threat detection | GuardDuty integration and findings analysis |
| Logging and monitoring | CloudTrail event monitoring |
| Incident response | AI-powered threat triage and remediation |
| IAM and access control | Least privilege IAM user design |
| Infrastructure as Code | CloudFormation VPC template |
| Defence in depth | NACL plus Security Group layered controls |

---

## 12. Future Improvements (Version 2)

- VPC Flow Logs integration for network-level threat detection
- AWS Security Hub integration for unified findings dashboard
- Real-time alerting via SNS when Critical findings are detected
- Historical scan comparison to identify new versus persistent threats
- Multi-account support for enterprise AWS organisations
- Lambda-based automated remediation with approval workflow
- KMS encryption for all data at rest
- AWS Config rules for continuous compliance monitoring