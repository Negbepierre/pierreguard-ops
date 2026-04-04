# User Manual
## PierreGuard Ops — AI Security Operations Centre

**Live URL:** https://pierreguard-ops.netlify.app
**GitHub:** https://github.com/Negbepierre/pierreguard-ops
**Built by:** Inegbenose Pierre

---

## What This Tool Does

PierreGuard Ops is an AI-powered Security Operations Centre that monitors
a live AWS environment in real time. It pulls threat findings from Amazon
GuardDuty, API activity from AWS CloudTrail, and network architecture from
a CloudFormation-deployed VPC, then uses Claude AI via AWS Bedrock to
produce a comprehensive security report.

---

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| pierre@pierreguard.ai | pierre2026 | Chief Security Officer |
| analyst@pierreguard.ai | analyst2026 | Security Analyst |
| soc@pierreguard.ai | soc2026 | SOC Engineer |

---

## How to Use It

### Step 1 — Sign In

Go to the live URL and sign in using one of the demo credentials above.

### Step 2 — Review the Monitored Environment

The scan configuration screen shows:

- Connected AWS account ID and name
- Live status indicator
- Services being monitored: GuardDuty, CloudTrail, VPC
- VPC security architecture summary including subnets,
  security groups, and NACL rules

### Step 3 — Start the Scan

Click **Start Security Scan**. The tool will:

1. Query the PierreGuard Security Standards knowledge base
2. Pull active GuardDuty findings from the AWS account
3. Pull the last 24 hours of CloudTrail events
4. Pull live VPC configuration from the CloudFormation stack
5. Send all data to Claude via AWS Bedrock for analysis
6. Return a full security operations report

This takes approximately 20 to 40 seconds.

### Step 4 — Review the Dashboard

**Stats bar**
- Overall threat level: CRITICAL, HIGH, MEDIUM, or LOW
- GuardDuty findings count
- CloudTrail events analysed
- VPC subnets detected

**Compliance status**
- CIS AWS Benchmark
- SOC 2 Type II
- ISO 27001
- PierreGuard Standards

**AI Threat Analysis panel**
Tabbed sections covering:
- Threat Summary — overall posture assessment
- Active Threats — GuardDuty findings with explanations
- Suspicious Activity — unusual CloudTrail patterns
- Immediate Actions — top 3 priority actions for the security team
- Compliance — framework-by-framework assessment

**VPC Security Architecture panel**
- Live VPC details pulled directly from AWS
- Subnet configuration across two availability zones
- Security Group inbound and outbound rules
- NACL rules with deny and allow explanations
- Defence in Depth explanation

**CloudTrail Event Feed**
- Every API call in the last 24 hours
- Events classified by severity: Critical, High, Medium, Normal
- Service source identified for each event
- Username and timestamp for every event

---

## Understanding the NACL

The Network Access Control List is one of the most important security
controls in this architecture and a key topic in the AWS Security
Specialty exam. Here is what it does and why it matters.

A Security Group is stateful. When you allow HTTPS inbound, the Security
Group automatically allows the return traffic outbound. You only need to
write one rule.

A NACL is stateless. It does not track connections. You must explicitly
write rules for both directions — inbound traffic and the return traffic
separately. This is why the NACL has both an inbound HTTPS rule on port
443 and an inbound ephemeral ports rule on 1024 to 65535. The ephemeral
ports rule is what allows the response from the server to reach the client.

The NACL in this architecture explicitly denies three dangerous ports
before any other rules are evaluated:

SSH port 22 is denied because it is the most commonly attacked port in
cloud environments. Attackers scan for open SSH ports continuously.
Denying it at the NACL level means even if a Security Group is
misconfigured to allow it, the NACL blocks the traffic first.

RDP port 3389 is denied for the same reason applied to Windows servers.
Remote Desktop Protocol is a primary attack vector for ransomware.

Telnet port 23 is denied because Telnet transmits all data including
passwords in plain text with no encryption. No modern infrastructure
should ever accept Telnet connections.

This layered approach — Security Group plus NACL — is called defence in
depth and is a core principle of the CIS AWS Foundations Benchmark.

---

## What Happens Behind the Scenes

1. Scan request sent from React frontend to Flask backend
2. Backend queries PierreGuard Security Standards via Bedrock Knowledge Base
3. Backend calls GuardDuty API to pull active threat findings
4. Backend calls CloudTrail API to pull last 24 hours of events
5. Backend calls EC2 API to pull live VPC configuration
6. All data sent to Claude 3 Haiku via AWS Bedrock with standards context
7. Claude produces structured threat analysis report
8. Results returned to React frontend and rendered as dashboard

---

## Technical Concepts Demonstrated

| Concept | Implementation |
|---------|---------------|
| Amazon GuardDuty | Live threat findings via boto3 |
| AWS CloudTrail | 24-hour event monitoring via boto3 |
| VPC architecture | Two public subnets across two AZs |
| Security Groups | Stateful instance-level firewall |
| Network ACLs | Stateless subnet-level firewall with explicit deny rules |
| Defence in depth | NACL plus Security Group layered controls |
| CloudFormation | Entire VPC deployed from a single YAML template |
| Infrastructure as Code | Reproducible, version-controlled infrastructure |
| RAG pattern | Security standards retrieved from Bedrock Knowledge Base |
| AWS Bedrock | Claude 3 Haiku called directly via boto3 |
| Principle of least privilege | Dedicated read-only IAM user per service |
| Secret scanning | GitHub blocked credential exposure during development |

---

## Running Locally

### Prerequisites

- Python 3.11 or above
- Node.js v18 or above
- AWS account with GuardDuty enabled
- VPC deployed via the CloudFormation template in templates/vpc.yaml

### Backend Setup
```bash
git clone https://github.com/Negbepierre/pierreguard-ops.git
cd pierreguard-ops
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
KNOWLEDGE_BASE_ID=your_kb_id
VPC_ID=your_vpc_id
```

Start the backend:
```bash
flask run --port 5001
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Deploy the VPC
```bash
aws cloudformation create-stack \
  --stack-name pierreguard-ops-vpc \
  --template-body file://templates/vpc.yaml
```

-