import os
import json
import boto3
from datetime import datetime, timezone, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
KNOWLEDGE_BASE_ID = os.environ.get('KNOWLEDGE_BASE_ID', '58SGJUBGOB')
VPC_ID = os.environ.get('VPC_ID', 'vpc-0a4a1cd7d85b9bfb1')
CLAUDE_MODEL = 'anthropic.claude-3-haiku-20240307-v1:0'

def get_client(service):
    return boto3.client(
        service,
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )


def call_claude(prompt):
    client = get_client('bedrock-runtime')
    body = json.dumps({
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': 2000,
        'temperature': 0,
        'messages': [{'role': 'user', 'content': prompt}]
    })
    response = client.invoke_model(
        modelId=CLAUDE_MODEL,
        body=body,
        contentType='application/json',
        accept='application/json'
    )
    result = json.loads(response['body'].read())
    return result['content'][0]['text']


def query_knowledge_base(query):
    try:
        client = get_client('bedrock-agent-runtime')
        response = client.retrieve(
            knowledgeBaseId=KNOWLEDGE_BASE_ID,
            retrievalQuery={'text': query},
            retrievalConfiguration={
                'vectorSearchConfiguration': {'numberOfResults': 3}
            }
        )
        results = []
        for r in response.get('retrievalResults', []):
            results.append(r['content']['text'])
        return '\n\n'.join(results)[:1500]
    except Exception as e:
        print(f'KB error: {str(e)}')
        return ''


def fetch_guardduty_findings():
    try:
        client = get_client('guardduty')
        detectors = client.list_detectors()
        if not detectors['DetectorIds']:
            return []
        detector_id = detectors['DetectorIds'][0]
        finding_ids_response = client.list_findings(
            DetectorId=detector_id,
            FindingCriteria={
                'Criterion': {
                    'severity': {
                        'Gte': 4
                    }
                }
            },
            MaxResults=20
        )
        finding_ids = finding_ids_response.get('FindingIds', [])
        if not finding_ids:
            return []
        findings_response = client.get_findings(
            DetectorId=detector_id,
            FindingIds=finding_ids
        )
        findings = []
        for f in findings_response.get('Findings', []):
            findings.append({
                'id': f['Id'],
                'title': f['Title'],
                'description': f['Description'],
                'severity': f['Severity'],
                'type': f['Type'],
                'region': f['Region'],
                'created': f['CreatedAt'],
                'updated': f['UpdatedAt'],
                'account': f['AccountId']
            })
        return findings
    except Exception as e:
        print(f'GuardDuty error: {str(e)}')
        return []


def fetch_cloudtrail_events():
    try:
        client = get_client('cloudtrail')
        end_time = datetime.now(timezone.utc)
        start_time = end_time - timedelta(hours=24)
        response = client.lookup_events(
            StartTime=start_time,
            EndTime=end_time,
            MaxResults=20
        )
        events = []
        for e in response.get('Events', []):
            events.append({
                'event_name': e.get('EventName'),
                'event_time': str(e.get('EventTime')),
                'username': e.get('Username', 'unknown'),
                'source_ip': e.get('CloudTrailEvent', '{}'),
                'resources': [r.get('ResourceName', '') for r in e.get('Resources', [])]
            })
        return events
    except Exception as e:
        print(f'CloudTrail error: {str(e)}')
        return []


def fetch_vpc_details():
    try:
        client = get_client('ec2')
        vpc_response = client.describe_vpcs(VpcIds=[VPC_ID])
        vpc = vpc_response['Vpcs'][0]

        subnets_response = client.describe_subnets(
            Filters=[{'Name': 'vpc-id', 'Values': [VPC_ID]}]
        )

        sg_response = client.describe_security_groups(
            Filters=[{'Name': 'vpc-id', 'Values': [VPC_ID]}]
        )

        nacl_response = client.describe_network_acls(
            Filters=[{'Name': 'vpc-id', 'Values': [VPC_ID]}]
        )

        igw_response = client.describe_internet_gateways(
            Filters=[{'Name': 'attachment.vpc-id', 'Values': [VPC_ID]}]
        )

        return {
            'vpc_id': VPC_ID,
            'cidr': vpc['CidrBlock'],
            'state': vpc['State'],
            'subnets': [
                {
                    'id': s['SubnetId'],
                    'cidr': s['CidrBlock'],
                    'az': s['AvailabilityZone'],
                    'name': next((t['Value'] for t in s.get('Tags', [])
                                  if t['Key'] == 'Name'), 'unnamed')
                }
                for s in subnets_response['Subnets']
            ],
            'security_groups': [
                {
                    'id': sg['GroupId'],
                    'name': sg['GroupName'],
                    'inbound_rules': len(sg['IpPermissions']),
                    'outbound_rules': len(sg['IpPermissionsEgress'])
                }
                for sg in sg_response['SecurityGroups']
            ],
            'nacls': len(nacl_response['NetworkAcls']),
            'internet_gateway': len(igw_response['InternetGateways']) > 0
        }
    except Exception as e:
        print(f'VPC error: {str(e)}')
        return {}


def analyse_threats(findings, events, vpc_details, kb_context):
    findings_summary = []
    for f in findings[:5]:
        findings_summary.append({
            'title': f['title'],
            'severity': f['severity'],
            'type': f['type'],
            'description': f['description'][:200]
        })

    recent_events = []
    for e in events[:10]:
        recent_events.append({
            'event': e['event_name'],
            'user': e['username'],
            'time': e['event_time']
        })

    prompt = (
        "You are an expert cloud security analyst for PierreGuard AI.\n\n"
        "PIERREGUARD SECURITY STANDARDS:\n"
        + kb_context +
        "\n\nSECURITY DATA:\n"
        + json.dumps({
            'guardduty_findings': findings_summary,
            'recent_cloudtrail_events': recent_events,
            'vpc_architecture': vpc_details
        }, indent=2, default=str) +
        "\n\nProduce a security operations report with these sections:\n\n"
        "1. THREAT SUMMARY\n"
        "   - Overall threat level: LOW, MEDIUM, HIGH, or CRITICAL\n"
        "   - Brief summary of current security posture\n\n"
        "2. ACTIVE THREATS\n"
        "   - List each GuardDuty finding with severity, what it means, and recommended action\n\n"
        "3. SUSPICIOUS ACTIVITY\n"
        "   - Identify any suspicious patterns in CloudTrail events\n"
        "   - Flag any unusual API calls or access patterns\n\n"
        "4. VPC SECURITY ASSESSMENT\n"
        "   - Assess the VPC architecture against security best practices\n"
        "   - Note: NACL provides stateless subnet-level filtering blocking SSH port 22, "
        "RDP port 3389, and Telnet port 23. Security Group provides stateful "
        "instance-level filtering allowing only HTTPS port 443 inbound.\n\n"
        "5. IMMEDIATE ACTIONS\n"
        "   - Top 3 actions the security team should take right now\n\n"
        "6. COMPLIANCE NOTES\n"
        "   - CIS AWS Benchmark, SOC2, ISO27001: PASS, PARTIAL, or FAIL\n\n"
        "Be specific and actionable."
    )

    return call_claude(prompt)


@app.route('/api/ops-scan', methods=['POST'])
def ops_scan():
    try:
        print('Starting PierreGuard Ops scan...')

        print('Querying knowledge base...')
        kb_context = query_knowledge_base(
            'cloud security threat detection incident response VPC GuardDuty'
        )

        print('Fetching GuardDuty findings...')
        findings = fetch_guardduty_findings()
        print(f'Found {len(findings)} GuardDuty findings')

        print('Fetching CloudTrail events...')
        events = fetch_cloudtrail_events()
        print(f'Found {len(events)} CloudTrail events')

        print('Fetching VPC details...')
        vpc_details = fetch_vpc_details()

        print('Analysing threats with Claude...')
        report = analyse_threats(findings, events, vpc_details, kb_context)
        print('Analysis complete')

        threat_level = 'LOW'
        if 'CRITICAL' in report.upper()[:200]:
            threat_level = 'CRITICAL'
        elif 'HIGH' in report.upper()[:200]:
            threat_level = 'HIGH'
        elif 'MEDIUM' in report.upper()[:200]:
            threat_level = 'MEDIUM'

        return jsonify({
            'status': 'success',
            'threat_level': threat_level,
            'findings_count': len(findings),
            'events_count': len(events),
            'findings': findings,
            'events': events[:10],
            'vpc': vpc_details,
            'report': report
        })

    except Exception as e:
        print(f'Ops scan error: {str(e)}')
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'PierreGuard Ops',
        'version': '1.0',
        'vpc': VPC_ID
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
