import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

type Tab = 'curl' | 'javascript' | 'python';
type HttpMethod = 'GET' | 'POST';
type StatusTone = 'success' | 'client' | 'server';

type EndpointDoc = {
  method: HttpMethod;
  path: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  successExampleFr: string;
  successExampleEn: string;
  errorExampleFr: string;
  errorExampleEn: string;
};

type StatusDoc = {
  code: number;
  tone: StatusTone;
  labelFr: string;
  labelEn: string;
  meaningFr: string;
  meaningEn: string;
};

const ENDPOINTS: EndpointDoc[] = [
  {
    method: 'GET',
    path: '/api/rates?base=USD',
    titleFr: 'Derniers taux',
    titleEn: 'Latest rates',
    descriptionFr: 'Récupère les taux les plus récents pour une devise de base.',
    descriptionEn: 'Fetches the latest rates for a base currency.',
    successExampleFr: `{
  "base": "USD",
  "timestamp": "2026-02-26T09:00:00.000Z",
  "rates": {
    "EUR": 0.92,
    "XOF": 603.5,
    "NGN": 1498.2
  }
}`,
    successExampleEn: `{
  "base": "USD",
  "timestamp": "2026-02-26T09:00:00.000Z",
  "rates": {
    "EUR": 0.92,
    "XOF": 603.5,
    "NGN": 1498.2
  }
}`,
    errorExampleFr: `{
  "statusCode": 400,
  "message": "Devise de base invalide",
  "error": "Bad Request"
}`,
    errorExampleEn: `{
  "statusCode": 400,
  "message": "Invalid base currency",
  "error": "Bad Request"
}`,
  },
  {
    method: 'POST',
    path: '/api/conversion/convert',
    titleFr: 'Conversion directe',
    titleEn: 'Direct conversion',
    descriptionFr: 'Convertit un montant entre deux devises avec le taux actuel.',
    descriptionEn: 'Converts an amount between two currencies using current rate.',
    successExampleFr: `{
  "from": "USD",
  "to": "EUR",
  "amount": 100,
  "rate": 0.92,
  "result": 92,
  "timestamp": "2026-02-26T09:01:00.000Z"
}`,
    successExampleEn: `{
  "from": "USD",
  "to": "EUR",
  "amount": 100,
  "rate": 0.92,
  "result": 92,
  "timestamp": "2026-02-26T09:01:00.000Z"
}`,
    errorExampleFr: `{
  "statusCode": 422,
  "message": "Le montant doit être supérieur à 0",
  "error": "Unprocessable Entity"
}`,
    errorExampleEn: `{
  "statusCode": 422,
  "message": "Amount must be greater than 0",
  "error": "Unprocessable Entity"
}`,
  },
  {
    method: 'GET',
    path: '/api/rates/currencies',
    titleFr: 'Devises supportées',
    titleEn: 'Supported currencies',
    descriptionFr: 'Retourne la liste des devises disponibles.',
    descriptionEn: 'Returns the list of available currencies.',
    successExampleFr: `{
  "currencies": ["USD", "EUR", "GBP", "XOF", "XAF", "NGN", "JPY"]
}`,
    successExampleEn: `{
  "currencies": ["USD", "EUR", "GBP", "XOF", "XAF", "NGN", "JPY"]
}`,
    errorExampleFr: `{
  "statusCode": 500,
  "message": "Impossible de charger la liste des devises",
  "error": "Internal Server Error"
}`,
    errorExampleEn: `{
  "statusCode": 500,
  "message": "Unable to load currencies list",
  "error": "Internal Server Error"
}`,
  },
  {
    method: 'GET',
    path: '/api/rates/historical?from=USD&to=EUR&days=30',
    titleFr: 'Historique',
    titleEn: 'Historical rates',
    descriptionFr: 'Retourne les taux historiques sur une période donnée.',
    descriptionEn: 'Returns historical rates over a selected period.',
    successExampleFr: `{
  "from": "USD",
  "to": "EUR",
  "days": 30,
  "series": [
    { "date": "2026-02-24", "rate": 0.919 },
    { "date": "2026-02-25", "rate": 0.921 }
  ]
}`,
    successExampleEn: `{
  "from": "USD",
  "to": "EUR",
  "days": 30,
  "series": [
    { "date": "2026-02-24", "rate": 0.919 },
    { "date": "2026-02-25", "rate": 0.921 }
  ]
}`,
    errorExampleFr: `{
  "statusCode": 400,
  "message": "Le paramètre days doit être entre 1 et 365",
  "error": "Bad Request"
}`,
    errorExampleEn: `{
  "statusCode": 400,
  "message": "Days must be between 1 and 365",
  "error": "Bad Request"
}`,
  },
];

const STATUS_CODES: StatusDoc[] = [
  { code: 200, tone: 'success', labelFr: 'Succès', labelEn: 'Success', meaningFr: 'Requête exécutée avec succès.', meaningEn: 'Request successfully processed.' },
  { code: 201, tone: 'success', labelFr: 'Créé', labelEn: 'Created', meaningFr: 'Ressource créée avec succès.', meaningEn: 'Resource successfully created.' },
  { code: 400, tone: 'client', labelFr: 'Requête invalide', labelEn: 'Bad request', meaningFr: 'Paramètres invalides ou incomplets.', meaningEn: 'Invalid or incomplete parameters.' },
  { code: 401, tone: 'client', labelFr: 'Non autorisé', labelEn: 'Unauthorized', meaningFr: 'Clé API manquante ou invalide.', meaningEn: 'Missing or invalid API key.' },
  { code: 403, tone: 'client', labelFr: 'Interdit', labelEn: 'Forbidden', meaningFr: 'Clé API inactive ou accès refusé.', meaningEn: 'Inactive API key or access denied.' },
  { code: 404, tone: 'client', labelFr: 'Introuvable', labelEn: 'Not found', meaningFr: 'Endpoint ou ressource introuvable.', meaningEn: 'Endpoint or resource not found.' },
  { code: 422, tone: 'client', labelFr: 'Entité invalide', labelEn: 'Unprocessable entity', meaningFr: 'Corps de requête valide syntaxiquement, mais données invalides.', meaningEn: 'Request body is syntactically valid, but data is invalid.' },
  { code: 429, tone: 'client', labelFr: 'Quota dépassé', labelEn: 'Rate limit exceeded', meaningFr: 'Trop de requêtes dans la fenêtre de quota.', meaningEn: 'Too many requests in the quota window.' },
  { code: 500, tone: 'server', labelFr: 'Erreur serveur', labelEn: 'Server error', meaningFr: 'Erreur interne du serveur.', meaningEn: 'Internal server error.' },
];

function toneClasses(tone: StatusTone) {
  if (tone === 'success') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (tone === 'client') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-rose-100 text-rose-700 border-rose-200';
}

function methodClass(method: HttpMethod) {
  return method === 'GET' ? 'text-green-400' : 'text-yellow-400';
}

export default function ApiDocsPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const [activeTab, setActiveTab] = useState<Tab>('javascript');

  const codeExamples: Record<Tab, string> = {
    curl: isFr
      ? `# Récupérer les taux
curl -X GET "https://api.xchange.com/api/rates?base=USD" \\
  -H "X-API-Key: votre_clé_api"

# Convertir un montant
curl -X POST "https://api.xchange.com/api/conversion/convert" \\
  -H "X-API-Key: votre_clé_api" \\
  -H "Content-Type: application/json" \\
  -d '{"from":"USD","to":"EUR","amount":100}'`
      : `# Get rates
curl -X GET "https://api.xchange.com/api/rates?base=USD" \\
  -H "X-API-Key: your_api_key"

# Convert amount
curl -X POST "https://api.xchange.com/api/conversion/convert" \\
  -H "X-API-Key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"from":"USD","to":"EUR","amount":100}'`,
    javascript: isFr
      ? `const API_KEY = 'votre_clé_api';
const BASE_URL = 'https://api.xchange.com/api';

const response = await fetch(\`\${BASE_URL}/rates?base=USD\`, {
  headers: { 'X-API-Key': API_KEY }
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message);
}

const data = await response.json();
console.log(data.rates);`
      : `const API_KEY = 'your_api_key';
const BASE_URL = 'https://api.xchange.com/api';

const response = await fetch(\`\${BASE_URL}/rates?base=USD\`, {
  headers: { 'X-API-Key': API_KEY }
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message);
}

const data = await response.json();
console.log(data.rates);`,
    python: isFr
      ? `import requests

API_KEY = "votre_clé_api"
BASE_URL = "https://api.xchange.com/api"
HEADERS = {"X-API-Key": API_KEY}

response = requests.get(f"{BASE_URL}/rates?base=USD", headers=HEADERS)
if response.status_code != 200:
    print(response.json())
else:
    print(response.json()["rates"])`
      : `import requests

API_KEY = "your_api_key"
BASE_URL = "https://api.xchange.com/api"
HEADERS = {"X-API-Key": API_KEY}

response = requests.get(f"{BASE_URL}/rates?base=USD", headers=HEADERS)
if response.status_code != 200:
    print(response.json())
else:
    print(response.json()["rates"])`,
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <Head>
        <title>{isFr ? 'Documentation API | XChange' : 'API Documentation | XChange'}</title>
        <meta name="description" content={isFr ? "Documentation complète de l'API XChange." : 'Complete XChange API documentation.'} />
      </Head>

      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold mb-3">{isFr ? 'Documentation API XChange' : 'XChange API Documentation'}</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            {isFr
              ? 'Documentation complète avec endpoints, exemples de succès, erreurs et codes HTTP colorés.'
              : 'Complete documentation with endpoints, success examples, errors and color-coded HTTP codes.'}
          </p>
        </div>

        <div className="card bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">{isFr ? 'Démarrage rapide' : 'Quick start'}</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
            <li>{isFr ? '1. Créez un compte' : '1. Create an account'}</li>
            <li>{isFr ? '2. Générez une clé API depuis le dashboard' : '2. Generate an API key from dashboard'}</li>
            <li>{isFr ? '3. Appelez les endpoints avec X-API-Key' : '3. Call endpoints with X-API-Key'}</li>
          </ol>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{isFr ? 'Authentification' : 'Authentication'}</h2>
          <p className="text-slate-600 mb-4">
            {isFr
              ? 'Ajoutez votre clé API dans le header X-API-Key pour chaque requête.'
              : 'Add your API key in X-API-Key header for every request.'}{' '}
            <Link href="/dashboard" className="text-blue-600 hover:underline">{isFr ? 'Ouvrir le dashboard' : 'Open dashboard'}</Link>
          </p>
          <pre className="bg-slate-900 text-blue-300 p-4 rounded-xl text-sm overflow-x-auto font-mono">GET /api/rates?base=USD{'\n'}X-API-Key: xc_live_...</pre>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{isFr ? 'Endpoints' : 'Endpoints'}</h2>
          <div className="space-y-6">
            {ENDPOINTS.map((endpoint) => (
              <div key={endpoint.path} className="card">
                <h3 className="text-lg font-bold mb-1">{isFr ? endpoint.titleFr : endpoint.titleEn}</h3>
                <p className="text-slate-600 mb-3">{isFr ? endpoint.descriptionFr : endpoint.descriptionEn}</p>
                <div className="bg-slate-900 rounded-xl p-3 overflow-x-auto mb-4">
                  <code className="text-sm">
                    <span className={`font-bold ${methodClass(endpoint.method)}`}>{endpoint.method}</span>
                    <span className="text-blue-300 ml-2">{endpoint.path}</span>
                  </code>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700 mb-2">{isFr ? 'Exemple de succès' : 'Success example'}</p>
                    <pre className="bg-emerald-50 border border-emerald-100 text-emerald-900 p-4 rounded-xl text-xs overflow-x-auto font-mono whitespace-pre-wrap break-words">
                      {isFr ? endpoint.successExampleFr : endpoint.successExampleEn}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-rose-700 mb-2">{isFr ? "Exemple d'erreur" : 'Error example'}</p>
                    <pre className="bg-rose-50 border border-rose-100 text-rose-900 p-4 rounded-xl text-xs overflow-x-auto font-mono whitespace-pre-wrap break-words">
                      {isFr ? endpoint.errorExampleFr : endpoint.errorExampleEn}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{isFr ? 'Exemples de code' : 'Code examples'}</h2>
          <div className="card">
            <div className="flex gap-2 mb-4">
              {(['curl', 'javascript', 'python'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {tab === 'curl' ? 'cURL' : tab === 'javascript' ? 'JavaScript' : 'Python'}
                </button>
              ))}
            </div>
            <pre className="bg-slate-900 text-blue-300 p-4 rounded-xl text-sm overflow-x-auto font-mono whitespace-pre-wrap break-words">{codeExamples[activeTab]}</pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{isFr ? 'Codes HTTP et signification' : 'HTTP status codes and meaning'}</h2>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 pr-4 text-slate-500 font-semibold">Code</th>
                  <th className="text-left py-3 pr-4 text-slate-500 font-semibold">{isFr ? 'Type' : 'Type'}</th>
                  <th className="text-left py-3 text-slate-500 font-semibold">{isFr ? 'Signification' : 'Meaning'}</th>
                </tr>
              </thead>
              <tbody>
                {STATUS_CODES.map((status) => (
                  <tr key={status.code} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-semibold text-slate-900">{status.code}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses(status.tone)}`}>
                        {isFr ? status.labelFr : status.labelEn}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700">{isFr ? status.meaningFr : status.meaningEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="text-center py-8">
          <p className="text-slate-500 mb-4">{isFr ? 'Prêt à commencer ?' : 'Ready to start?'}</p>
          <Link href="/dashboard" className="btn-primary inline-block">{isFr ? 'Générer ma clé API' : 'Generate my API key'} →</Link>
        </div>
      </div>
    </div>
  );
}
