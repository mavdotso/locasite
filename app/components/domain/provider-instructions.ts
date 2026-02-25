export interface DnsProvider {
  id: string;
  name: string;
  steps: string[];
}

export const dnsProviders: DnsProvider[] = [
  {
    id: "godaddy",
    name: "GoDaddy",
    steps: [
      "Log in to your GoDaddy account",
      "Go to My Products → find your domain → click DNS",
      "Click 'Add' under Records",
      "Select 'CNAME' as the Type",
      "In the 'Host' field, enter: {cnameHost}",
      "In the 'Points to' field, enter: {cnameValue}",
      "Set TTL to '1 Hour' and click Save",
      "Add another record: Type 'TXT', Host '{txtHost}', Value '{txtValue}'",
    ],
  },
  {
    id: "namecheap",
    name: "Namecheap",
    steps: [
      "Log in to your Namecheap account",
      "Go to Domain List → click Manage next to your domain",
      "Click the 'Advanced DNS' tab",
      "Click 'Add New Record'",
      "Select 'CNAME Record', Host: {cnameHost}, Value: {cnameValue}",
      "Add another: TXT Record, Host: {txtHost}, Value: {txtValue}",
      "Click the checkmark to save each record",
    ],
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    steps: [
      "Log in to your Cloudflare dashboard",
      "Select your domain",
      "Go to DNS → Records → Add Record",
      "Type: CNAME, Name: {cnameHost}, Target: {cnameValue}",
      "IMPORTANT: Set proxy status to 'DNS only' (gray cloud icon)",
      "Add another: Type: TXT, Name: {txtHost}, Content: {txtValue}",
    ],
  },
  {
    id: "google",
    name: "Google Domains / Squarespace",
    steps: [
      "Go to domains.google.com (now managed by Squarespace)",
      "Select your domain → DNS tab",
      "Under 'Custom records', click 'Manage custom records'",
      "Add: Type CNAME, Host {cnameHost}, Data {cnameValue}",
      "Add: Type TXT, Host {txtHost}, Data {txtValue}",
      "Click Save",
    ],
  },
];
