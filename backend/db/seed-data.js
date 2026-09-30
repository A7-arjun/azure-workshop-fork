// Seed content for QuizLab. Questions are graded server-side;
// `correct_index` never leaves the API until an attempt is submitted.
export const seedData = [
  {
    slug: 'azure-fundamentals',
    title: 'Azure Fundamentals',
    description:
      'Core Azure services, regions and the building blocks you will meet in every cloud deployment.',
    category: 'Cloud',
    difficulty: 'beginner',
    estimated_minutes: 6,
    questions: [
      {
        prompt: 'What kind of service is Azure App Service?',
        options: [
          'A virtual machine image gallery',
          'A platform-as-a-service offering for hosting web apps and REST APIs',
          'A managed relational database',
          'A content delivery network',
        ],
        correct_index: 1,
        explanation:
          'App Service is PaaS: you deploy code or containers and Azure manages the underlying VMs, patching and scaling.',
      },
      {
        prompt: 'Which Azure service provides a fully managed relational database based on SQL Server?',
        options: ['Azure Blob Storage', 'Azure Functions', 'Azure SQL Database', 'Azure Virtual Network'],
        correct_index: 2,
        explanation:
          'Azure SQL Database is the managed Database-as-a-Service tier of the SQL Server engine, with backups, patching and tuning handled for you.',
      },
      {
        prompt: 'In Azure terminology, what is a region?',
        options: [
          'A single datacenter building',
          'A set of datacenters deployed within a latency-defined perimeter and connected by a regional low-latency network',
          'An availability zone',
          'A subscription boundary',
        ],
        correct_index: 1,
        explanation:
          'A region is a group of datacenters close enough to each other for low-latency networking; each datacenter is an availability zone.',
      },
      {
        prompt: 'You need to run containers without managing any servers or orchestrator upgrades. Which service fits best?',
        options: ['Azure Virtual Machines', 'Azure Kubernetes Service (AKS)', 'Azure Container Apps', 'Azure Batch'],
        correct_index: 2,
        explanation:
          'Azure Container Apps is a serverless container platform built on Kubernetes and KEDA — you ship containers, Azure runs them and scales to zero.',
      },
      {
        prompt: 'On the Azure Functions Consumption plan, how are you billed?',
        options: [
          'A fixed monthly fee per function app',
          'Per second of virtual machine uptime, whether functions run or not',
          'Only for the time your code actually executes and the resources it consumes',
          'Only for the first million executions, then nothing',
        ],
        correct_index: 2,
        explanation:
          'The Consumption plan scales to zero and bills per execution and GB-seconds of run time — nothing when no events arrive.',
      },
      {
        prompt: 'What is an Azure resource group?',
        options: [
          'A physical rack of servers in a datacenter',
          'A logical container that groups related resources for shared lifecycle management and permissions',
          'A network security rule collection',
          'A billing invoice line item',
        ],
        correct_index: 1,
        explanation:
          'Resources groups let you deploy, update and delete related resources together and apply role-based access control at group level.',
      },
      {
        prompt: 'Which of these is infrastructure-as-code for Azure, natively supported by the platform?',
        options: ['Azure Portal', 'Bicep', 'Azure Storage Explorer', 'Visual Studio Code'],
        correct_index: 1,
        explanation:
          'Bicep is a domain-specific language that compiles to ARM templates; Terraform is also supported but is third-party.',
      },
      {
        prompt: 'What distinguishes Azure Front Door from Application Gateway?',
        options: [
          'Front Door only handles TCP traffic',
          'Front Door operates at global scale across regions, while Application Gateway is regional (within a VNet)',
          'Application Gateway is serverless, Front Door is not',
          'They are identical products with different names',
        ],
        correct_index: 1,
        explanation:
          'Front Door is a global entry point with anycast across regions; Application Gateway provides L7 load balancing inside a single virtual network.',
      },
    ],
  },
  {
    slug: 'cloud-core-concepts',
    title: 'Cloud Core Concepts',
    description:
      'The vocabulary every cloud conversation assumes: elasticity, shared responsibility, scaling and spending models.',
    category: 'Cloud',
    difficulty: 'beginner',
    estimated_minutes: 5,
    questions: [
      {
        prompt: 'Moving to cloud typically shifts IT spending from which model to which?',
        options: [
          'From operational expenditure to capital expenditure',
          'From capital expenditure to operational expenditure',
          'From fixed cost to no cost',
          'From opex to licensing',
        ],
        correct_index: 1,
        explanation:
          'Instead of buying hardware up front (CapEx), you pay for capacity as you consume it (OpEx), which aligns cost with usage.',
      },
      {
        prompt: 'What does elasticity mean in a cloud context?',
        options: [
          'The ability to negotiate flexible contracts',
          'Automatically adding or removing capacity as demand changes',
          'Stretching a storage volume without downtime',
          'Support for multiple programming languages',
        ],
        correct_index: 1,
        explanation:
          'Elasticity is automatic scale-out and scale-in — you add instances under load and release them when demand drops.',
      },
      {
        prompt: 'On a PaaS offering such as App Service, who applies operating-system security patches?',
        options: ['Your team', 'The cloud provider', 'The auditor', 'Nobody — PaaS is immutable'],
        correct_index: 1,
        explanation:
          'The shared responsibility model shifts OS and platform maintenance to the provider in PaaS; you remain responsible for your app and data.',
      },
      {
        prompt: 'What is an availability zone?',
        options: [
          'A geographic area containing several regions',
          'One or more datacenters in a region with independent power, cooling and networking',
          'A reserved block of IP addresses',
          'A firewall policy scope',
        ],
        correct_index: 1,
        explanation:
          'Zones are physically separate datacenter groups within a region; spreading workloads across zones survives a zone-level failure.',
      },
      {
        prompt: 'Under the shared responsibility model, the customer is ALWAYS responsible for…',
        options: [
          'Physical datacenter security',
          'Hypervisor patching',
          'Data and access management',
          'Host hardware failure',
        ],
        correct_index: 2,
        explanation:
          'Regardless of IaaS, PaaS or SaaS, classifying and protecting your data plus controlling who can reach it never leaves the customer.',
      },
      {
        prompt: 'Horizontal scaling means…',
        options: [
          'Adding more CPU/RAM to existing machines',
          'Adding more machine instances to the pool',
          'Moving to a bigger region',
          'Extending a maintenance window',
        ],
        correct_index: 1,
        explanation:
          'Horizontal (scale out/in) changes the instance count; vertical (scale up/down) changes the size of a single instance.',
      },
    ],
  },
  {
    slug: 'web-dev-essentials',
    title: 'Web Development Essentials',
    description:
      'HTTP semantics, browsers and how the pieces of a three-tier web application actually fit together.',
    category: 'Engineering',
    difficulty: 'intermediate',
    estimated_minutes: 5,
    questions: [
      {
        prompt: 'What does an HTTP 404 status code communicate?',
        options: [
          'The server crashed',
          'The requested resource could not be found',
          'Authentication is required',
          'The request was malformed',
        ],
        correct_index: 1,
        explanation:
          '4xx codes are client-side errors; 404 specifically means the origin has no representation for the target resource.',
      },
      {
        prompt: 'Which HTTP method is NOT idempotent by specification?',
        options: ['GET', 'PUT', 'DELETE', 'POST'],
        correct_index: 3,
        explanation:
          'Repeating a POST can create additional resources or side effects; GET, PUT and DELETE promise the same result when replayed.',
      },
      {
        prompt: 'What does CORS govern?',
        options: [
          'Which certificates a server accepts',
          'Which origins a browser may request cross-site resources from',
          'How cookies are encrypted',
          'DNS resolution order',
        ],
        correct_index: 1,
        explanation:
          'Cross-Origin Resource Sharing is an enforcement point in the browser: servers must opt in via response headers for cross-origin reads.',
      },
      {
        prompt: 'The three tiers of a classic three-tier architecture are…',
        options: [
          'HTML, CSS and JavaScript',
          'Presentation, application logic and data management',
          'Development, staging and production',
          'Client, CDN and cache',
        ],
        correct_index: 1,
        explanation:
          'In this project: the React app is the presentation tier, the Express API is the application tier, PostgreSQL is the data tier.',
      },
      {
        prompt: 'During development, what does the Vite dev proxy in this project do?',
        options: [
          'Caches API responses for offline use',
          'Forwards /api requests to the backend port so the browser stays same-origin',
          'Transpiles SQL queries',
          'Mocks the database',
        ],
        correct_index: 1,
        explanation:
          'The proxy forwards /api/* from the dev server (5173) to the API (4000), avoiding CORS in development without touching production behaviour.',
      },
      {
        prompt: 'What defines a single-page application (SPA)?',
        options: [
          'It can only have one screen',
          'The browser loads one HTML document and JavaScript updates the DOM without full page reloads',
          'It must be written in React',
          'It has no server component',
        ],
        correct_index: 1,
        explanation:
          'SPAs fetch data via APIs and render client-side; routing is handled in JavaScript rather than by requesting new documents.',
      },
      {
        prompt: 'Which of these is NOT a REST architectural constraint?',
        options: ['Statelessness', 'Uniform interface', 'Client-server separation', 'Mandatory XML message format'],
        correct_index: 3,
        explanation:
          'REST is style-agnostic about payloads — JSON is the norm today. XML being mandatory was a SOAP convention, not a REST constraint.',
      },
    ],
  },
  {
    slug: 'databases-and-sql',
    title: 'Databases & SQL',
    description:
      'Joins, indexes, JSONB and the Postgres features this application leans on every single request.',
    category: 'Data',
    difficulty: 'intermediate',
    estimated_minutes: 5,
    questions: [
      {
        prompt: 'Which statement adds a column to an existing table?',
        options: [
          'MODIFY TABLE employees ADD COLUMN …',
          'ALTER TABLE employees ADD COLUMN …',
          'UPDATE TABLE employees SET COLUMN …',
          'CREATE COLUMN ON employees …',
        ],
        correct_index: 1,
        explanation:
          'ALTER TABLE is the DDL statement for changing structure — adding columns, constraints or indexes on live tables.',
      },
      {
        prompt: 'Which JOIN returns unmatched rows from BOTH tables?',
        options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
        correct_index: 2,
        explanation:
          'FULL OUTER JOIN keeps every row from both sides, padding with NULLs where no match exists on the join condition.',
      },
      {
        prompt: 'What is the main trade-off of adding a database index?',
        options: [
          'Faster writes, slower reads',
          'Faster reads at the cost of extra storage and slower writes',
          'Stronger consistency guarantees',
          'Automatic query caching',
        ],
        correct_index: 1,
        explanation:
          'Indexes accelerate lookups but every INSERT/UPDATE must also maintain them — this app indexes quiz_id because reads dominate.',
      },
      {
        prompt: 'In PostgreSQL, what advantage does JSONB have over the JSON column type?',
        options: [
          'It preserves original text formatting exactly',
          'It is stored in a decomposed binary format that supports indexing and containment operators',
          'It validates against a JSON schema automatically',
          'It compresses better on disk',
        ],
        correct_index: 1,
        explanation:
          'JSONB parses once into a binary form, enabling GIN indexes and operators like @> — this app stores question options as JSONB.',
      },
      {
        prompt: 'Which clause filters rows AFTER grouping and aggregation?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
        correct_index: 1,
        explanation:
          'WHERE filters rows before aggregation; HAVING filters the grouped result — e.g. HAVING COUNT(*) > 5.',
      },
      {
        prompt: 'What is connection pooling?',
        options: [
          'Storing query results in memory',
          'Reusing a set of open database connections instead of opening a new one per request',
          'Splitting a database across servers',
          'Bundling multiple queries into one transaction',
        ],
        correct_index: 1,
        explanation:
          'Opening a connection is expensive (auth, TLS, fork). A pool keeps warm connections ready — the pg Pool in this API defaults to 10.',
      },
    ],
  },
]
