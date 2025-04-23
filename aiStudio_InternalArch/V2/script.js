document.addEventListener('DOMContentLoaded', function() {
    // Password protection
    const passwordOverlay = document.getElementById('password-overlay');
    const mainContent = document.getElementById('main-content');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');
    const correctPassword = 'param2024'; // Plain text password for simplicity

    // Password verification
    passwordSubmit.addEventListener('click', function() {
        const enteredPassword = passwordInput.value;

        if (enteredPassword === correctPassword) {
            passwordOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            initializeArchitecture();
        } else {
            passwordError.textContent = 'Incorrect password. Please try again.';
            passwordInput.value = '';
        }
    });

    // Allow Enter key to submit password
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            passwordSubmit.click();
        }
    });

    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to current button and corresponding pane
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');

            // Initialize diagram for this tab if not already done
            if (tabId === 'overview' && !overviewInitialized) {
                initializeOverviewDiagram();
                overviewInitialized = true;
            } else if (tabId === 'embedding' && !embeddingInitialized) {
                initializeEmbeddingDiagram();
                embeddingInitialized = true;
            } else if (tabId === 'minds' && !mindsInitialized) {
                initializeMindssDiagram();
                mindsInitialized = true;
            } else if (tabId === 'mcp' && !mcpInitialized) {
                initializeMcpDiagram();
                mcpInitialized = true;
            }
        });
    });

    // Print button functionality
    const printBtn = document.getElementById('print-btn');
    printBtn.addEventListener('click', function() {
        preparePrintVersion();
        window.print();
    });

    // Track which diagrams have been initialized
    let overviewInitialized = false;
    let embeddingInitialized = false;
    let mindsInitialized = false;
    let mcpInitialized = false;

    // Initialize architecture diagrams
    function initializeArchitecture() {
        // Start with overview diagram
        initializeOverviewDiagram();
        overviewInitialized = true;
    }

    // ============================
    // SYSTEM OVERVIEW COMPONENTS
    // ============================
    const overviewComponents = [
            {
                id: 'ui-backend',
                title: 'UI/Backend VM',
                x: 390, y: 100, width: 180, height: 70,
                layer: 1,
                description: `<p>The main UI/Backend VM serves as the central hub for all user interactions and system coordination:</p>
                    <ul>
                        <li>Handles web interface rendering and user authentication</li>
                        <li>Processes API requests from clients</li>
                        <li>Coordinates job distribution across the system</li>
                        <li>Manages user sessions and permissions</li>
                    </ul>
                    <p>This component is horizontally scalable and implements load balancing to handle increasing user demand.</p>`,
                connections: ['storage', 'embedding', 'execution'],
                bgClass: 'component-bg'
            },
            {
                id: 'storage',
                title: 'Storage VM',
                x: 118, y: 220, width: 180, height: 70,
                layer: 2,
                description: `<p>The Storage VM houses multiple database engines optimized for different data types:</p>
                    <ul>
                        <li><strong>MongoDB</strong>: Document storage for flexible schemas and metadata</li>
                        <li><strong>QdrantDB</strong>: Vector database for semantic search and embeddings</li>
                        <li><strong>PostgreSQL</strong>: Relational database for structured data and user management</li>
                    </ul>
                    <p>All data is securely stored with encryption at rest and fine-grained access controls.</p>`,
                connections: ['embedding'],
                bgClass: 'component-bg',
                additionalText: {
                    text: "mongodb grafanadb postgresql",
                    x: 90, y: 55, fontSize: 11
                }
            },
            {
                id: 'embedding',
                title: 'Embedding Cluster',
                x: 390, y: 220, width: 180, height: 70,
                layer: 2,
                description: `<p>The Embedding Cluster handles all document processing and vector embedding generation:</p>
                    <ul>
                        <li><strong>Local Embedding</strong>: PaddleOCR and DocLing for on-premise document processing</li>
                        <li><strong>Cloud Embedding</strong>: Integration with LlamaParse for advanced parsing</li>
                        <li><strong>Job Queue</strong>: Scalable processing with threshold management</li>
                    </ul>
                    <p>Communications with the main backend occur via Kafka for reliable and scalable message handling.</p>`,
                connections: ['scheduler'],
                bgClass: 'component-bg',
                additionalText: {
                    text: "pdfreader docling llamaparse",
                    x: 90, y: 55, fontSize: 11
                }
            },
            {
                id: 'execution',
                title: 'Mind Execution Cluster',
                x: 662, y: 220, width: 180, height: 70,
                layer: 2,
                description: `<p>The Mind Execution Cluster runs the Quantum Minds workflows:</p>
                    <ul>
                        <li>Executes operator chains with resource allocation</li>
                        <li>Manages parallel execution of mind components</li>
                        <li>Implements threshold management for job control</li>
                        <li>Logs detailed execution information</li>
                    </ul>
                    <p>This cluster can dynamically scale based on workload demands and communicates with other components via Kafka.</p>`,
                connections: ['inference'],
                bgClass: 'component-bg'
            },
            {
                id: 'scheduler',
                title: 'MindSchedular VM',
                x: 390, y: 360, width: 180, height: 70,
                layer: 3,
                description: `<p>The MindSchedular VM enables automated execution of minds:</p>
                    <ul>
                        <li>Provides cron-like scheduling for periodic mind execution</li>
                        <li>Manages MCP (Model Connect Protocol) data streams</li>
                        <li>Handles HTTP API trigger requests</li>
                        <li>Controls AI ETL job execution</li>
                    </ul>
                    <p>This component ensures reliable background processing and integration capabilities with external systems.</p>`,
                connections: ['inference'],
                bgClass: 'component-bg'
            },
            {
                id: 'inference',
                title: 'Inference Engine',
                x: 662, y: 360, width: 180, height: 70,
                layer: 3,
                description: `<p>The Inference Engine connects to various LLM providers for model execution:</p>
                    <ul>
                        <li>Integrates with Fireworks, Vertex AI, AWS Bedrock, Groq, and Cerebras</li>
                        <li>Implements intelligent routing based on model availability and cost</li>
                        <li>Manages API keys and usage quotas</li>
                        <li>Provides fallback mechanisms for reliability</li>
                    </ul>
                    <p>This component abstracts away the complexities of working with multiple LLM providers, offering a unified interface for the system.</p>`,
                connections: ['execution'],
                bgClass: 'component-bg'
            },
            {
                id: 'lightningrag',
                title: 'L:zap:RAG',
                x: 118, y: 360, width: 180, height: 70,
                layer: 3,
                description: `<p>Lightning RAG (L:zap:RAG) is an advanced Retrieval Augmented Generation platform:</p>
                    <ul>
                        <li>Processes unstructured data (PDF, documents) and structured data (SQL, Excel)</li>
                        <li>Provides three embedding types: PaddleOCR, Llama Parse, and Docling</li>
                        <li>Enables intelligent conversations with data through a chat interface</li>
                        <li>Supports sharing and collaboration features</li>
                    </ul>
                    <p>L:zap:RAG forms the knowledge foundation of the AI/Studio system, transforming raw data into queryable information.</p>`,
                connections: ['storage', 'scheduler'],
                bgClass: 'component-bg'
            },
            {
                id: 'platform-layer',
                title: 'Platform',
                x: 80, y: 480, width: 740, height: 110,
                layer: 4,
                isGroup: true,
                description: `<p>The platform services layer provides the core AI capabilities of the system:</p>`,
                connections: [],
                bgClass: 'platform-box'
            },
            {
                id: 'quantumminds',
                title: 'Quantum Minds',
                x: 118, y: 500, width: 180, height: 70,
                layer: 4,
                parentGroup: 'platform-layer',
                description: `<p>Quantum Minds is a low-code agentic AI platform:</p>
                    <ul>
                        <li>Enables creation of AI workflows through visual interface</li>
                        <li>Provides operators across various categories (SQL, Table, Document, etc.)</li>
                        <li>Supports multiple model integrations (Fireworks, Groq, OpenAI, etc.)</li>
                        <li>Includes AI-assisted mind creation</li>
                    </ul>
                    <p>This component allows users to create sophisticated AI agents without extensive coding knowledge.</p>`,
                connections: ['lightningrag'],
                bgClass: 'component-bg'
            },
            {
                id: 'mcp',
                title: 'MCP Streams',
                x: 390, y: 500, width: 180, height: 70,
                layer: 4,
                parentGroup: 'platform-layer',
                description: `<p>Model Connect Protocol (MCP) Streams provide data integration capabilities:</p>
                    <ul>
                        <li>Enables data streaming from external sources</li>
                        <li>Supports ETL (Extract, Transform, Load) operations</li>
                        <li>Integrates with the MindSchedular for automated processing</li>
                        <li>Provides real-time data synchronization</li>
                    </ul>
                    <p>MCP Streams ensure that AI/Studio can work with constantly updating data sources.</p>`,
                connections: ['scheduler', 'quantumminds'],
                bgClass: 'component-bg'
            },
            {
                id: 'operators',
                title: 'Agentic Operators',
                x: 662, y: 500, width: 180, height: 70,
                layer: 4,
                parentGroup: 'platform-layer',
                description: `<p>Agentic Operators are the building blocks of the Quantum Minds system:</p>
                    <ul>
                        <li>Implemented as modular Python classes</li>
                        <li>Support for private operators linked to customer Git repositories</li>
                        <li>Built with langchain and llama_index for advanced capabilities</li>
                        <li>Dynamically loaded based on user permissions</li>
                    </ul>
                    <p>The operator architecture allows for extensive customization and extension of the platform's capabilities.</p>`,
                connections: ['inference'],
                bgClass: 'component-bg'
            }
        ];






    // ============================
    // EMBEDDING CLUSTER COMPONENTS
    // ============================
    const embeddingComponents = [
        {
            id: 'emb-main',
            title: 'Embedding Cluster',
            x: 600, y: 100, width: 200, height: 80,
            layer: 1,
            description: `<p>The Embedding Cluster is a scalable system for processing documents and generating vector embeddings.</p>
                <p>Key features:</p>
                <ul>
                    <li>Distributed processing architecture</li>
                    <li>Multiple embedding technologies</li>
                    <li>Kafka-based communication</li>
                    <li>Job queue with threshold management</li>
                </ul>`,
            connections: ['emb-kafka', 'emb-jobqueue'],
            bgClass: 'component-bg'
        },
        {
            id: 'emb-kafka',
            title: 'Kafka Queue',
            x: 400, y: 250, width: 180, height: 70,
            layer: 2,
            description: `<p>The Kafka messaging system enables reliable, scalable communication between components:</p>
                <ul>
                    <li>Decouples processing systems</li>
                    <li>Provides message persistence</li>
                    <li>Enables parallel processing</li>
                    <li>Handles backpressure</li>
                </ul>`,
            connections: ['emb-storage'],
            bgClass: 'component-bg'
        },
        {
            id: 'emb-jobqueue',
            title: 'Job Queue Manager',
            x: 800, y: 250, width: 180, height: 70,
            layer: 2,
            description: `<p>The Job Queue Manager controls processing load and resource allocation:</p>
                <ul>
                    <li>Threshold-based processing limits</li>
                    <li>Priority queue implementation</li>
                    <li>Resource monitoring</li>
                    <li>Automatic scaling triggers</li>
                </ul>`,
            connections: ['emb-processors'],
            bgClass: 'component-bg'
        },
        {
            id: 'emb-storage',
            title: 'Embedding Storage',
            x: 400, y: 400, width: 180, height: 70,
            layer: 3,
            description: `<p>The Embedding Storage systems persist vector embeddings and metadata:</p>
                <ul>
                    <li>Qdrant vector database for semantic search</li>
                    <li>MongoDB for metadata and document management</li>
                    <li>Distributed storage architecture</li>
                    <li>Vector index optimization</li>
                </ul>`,
            connections: [],
            bgClass: 'component-bg'
        },
        {
            id: 'emb-processors',
            title: 'Embedding Processors',
            x: 800, y: 400, width: 180, height: 70,
            layer: 3,
            isGroup: true,
            description: `<p>Multiple embedding technologies are available to process different document types.</p>`,
            connections: ['emb-storage'],
            bgClass: 'component-bg'
        },
        {
            id: 'emb-paddleocr',
            title: 'PaddleOCR',
            x: 650, y: 550, width: 120, height: 60,
            layer: 4,
            parentGroup: 'emb-processors',
            description: `<p>PaddleOCR provides high-accuracy document processing:</p>
                <ul>
                    <li>Optical Character Recognition (OCR)</li>
                    <li>Layout analysis</li>
                    <li>Table detection and extraction</li>
                    <li>Optimized for mixed-content documents</li>
                </ul>
                <p>PaddleOCR is the default processing engine for standard documents.</p>`,
            connections: [],
            bgClass: 'embedding-type'
        },
        {
            id: 'emb-docling',
            title: 'DocLing',
            x: 800, y: 550, width: 120, height: 60,
            layer: 4,
            parentGroup: 'emb-processors',
            description: `<p>DocLing offers secure, on-premise document processing:</p>
                <ul>
                    <li>Complete local processing</li>
                    <li>Sensitive data protection</li>
                    <li>Regulatory compliance support</li>
                    <li>Custom extraction rules</li>
                </ul>
                <p>DocLing is ideal for confidential or regulated information that must not leave your infrastructure.</p>`,
            connections: [],
            bgClass: 'embedding-type'
        },
        {
            id: 'emb-llamaparse',
            title: 'LlamaParse',
            x: 950, y: 550, width: 120, height: 60,
            layer: 4,
            parentGroup: 'emb-processors',
            description: `<p>LlamaParse is a cloud-based solution for complex document structures:</p>
                <ul>
                    <li>Advanced layout understanding</li>
                    <li>Superior table extraction</li>
                    <li>Form field recognition</li>
                    <li>Multi-column processing</li>
                </ul>
                <p>LlamaParse excels at handling sophisticated document structures but requires internet connectivity.</p>`,
            connections: [],
            bgClass: 'embedding-type'
        },
        {
            id: 'emb-process',
            title: 'Document Processing Pipeline',
            x: 600, y: 700, width: 280, height: 70,
            layer: 5,
            description: `<p>The Document Processing Pipeline manages the workflow from raw documents to searchable embeddings:</p>
                <ul>
                    <li>Document ingestion and validation</li>
                    <li>Content extraction and normalization</li>
                    <li>Chunking and segmentation</li>
                    <li>Vector embedding generation</li>
                    <li>Index optimization and storage</li>
                </ul>
                <p>This pipeline ensures consistent, high-quality processing across all document types.</p>`,
            connections: ['emb-processors'],
            bgClass: 'embedding-process'
        }
    ];

    // ============================
    // QUANTUM MINDS COMPONENTS
    // ============================
    const mindsComponents = [
        {
            id: 'minds-main',
            title: 'Quantum Minds',
            x: 600, y: 100, width: 200, height: 80,
            layer: 1,
            description: `<p>Quantum Minds is a low-code agentic AI platform that enables building intelligent AI workflows.</p>
                <p>Key capabilities:</p>
                <ul>
                    <li>Visual mind builder interface</li>
                    <li>AI-assisted mind creation</li>
                    <li>Multiple operator categories</li>
                    <li>Integration with various AI models</li>
                </ul>`,
            connections: ['minds-core'],
            bgClass: 'component-bg'
        },
        {
            id: 'minds-core',
            title: 'Core Services',
            x: 600, y: 250, width: 600, height: 120,
            layer: 2,
            isGroup: true,
            description: `<p>The core services of Quantum Minds platform.</p>`,
            connections: [],
            bgClass: 'component-bg'
        },
        {
            id: 'minds-builder',
            title: 'Visual Mind Builder',
            x: 400, y: 270, width: 180, height: 70,
            layer: 2,
            parentGroup: 'minds-core',
            description: `<p>The Visual Mind Builder provides an intuitive interface for creating AI workflows:</p>
                <ul>
                    <li>Drag-and-drop operator placement</li>
                    <li>Connection mapping between operators</li>
                    <li>Property configuration panels</li>
                    <li>Real-time validation and feedback</li>
                    <li>Template library access</li>
                </ul>`,
            connections: [],
            bgClass: 'component-bg'
        },
        {
            id: 'minds-operators',
            title: 'Operator Library',
            x: 620, y: 270, width: 180, height: 70,
            layer: 2,
            parentGroup: 'minds-core',
            description: `<p>The Operator Library contains specialized AI components organized by function:</p>
                <ul>
                    <li>SQL operators for database interactions</li>
                    <li>Table operators for data manipulation</li>
                    <li>Document operators for unstructured content</li>
                    <li>LLM operators for language model integration</li>
                    <li>And many more specialized categories</li>
                </ul>
                <p>Each operator has versioned implementations with different capabilities.</p>`,
            connections: [],
            bgClass: 'component-bg'
        },
        {
            id: 'minds-execution',
            title: 'Mind Execution Engine',
            x: 840, y: 270, width: 180, height: 70,
            layer: 2,
            parentGroup: 'minds-core',
            description: `<p>The Mind Execution Engine runs the AI workflows:</p>
                <ul>
                    <li>Resource allocation and management</li>
                    <li>Parallel operation execution</li>
                    <li>Error handling and recovery</li>
                    <li>Execution monitoring and logging</li>
                    <li>Result aggregation and presentation</li>
                </ul>`,
            connections: [],
            bgClass: 'component-bg'
        },
        {
            id: 'minds-features',
            title: 'Platform Features',
            x: 300, y: 450, width: 800, height: 120,
            layer: 3,
            isGroup: true,
            description: `<p>Advanced features of the Quantum Minds platform.</p>`,
            connections: ['minds-core'],
            bgClass: 'component-bg'
        },
        {
            id: 'minds-categories',
            title: 'Operator Categories',
            x: 320, y: 470, width: 180, height: 70,
            layer: 3,
            parentGroup: 'minds-features',
            description: `<p>Operators are organized into functional categories:</p>
                <ul>
                    <li>SQL, Table, Document, MongoDB categories for data access</li>
                    <li>LLM, Code, Flow categories for processing logic</li>
                    <li>Media, Excel, API categories for specialized formats</li>
                    <li>Vector, Finance, ML categories for advanced operations</li>
                </ul>
                <p>This organization helps users quickly find the right operator for their needs.</p>`,
            connections: [],
            bgClass: 'operator-category'
        },
        {
            id: 'minds-custom',
            title: 'Custom Operators',
            x: 520, y: 470, width: 180, height: 70,
            layer: 3,
            parentGroup: 'minds-features',
            description: `<p>The Custom Operator system allows extending platform capabilities:</p>
                <ul>
                    <li>Git repository integration for private operators</li>
                    <li>Python class-based operator implementation</li>
                    <li>Dynamic loading based on permissions</li>
                    <li>Version control and dependency management</li>
                </ul>
                <p>This extensibility enables customers to build domain-specific operators.</p>`,
            connections: [],
            bgClass: 'operator-category'
        },
        {
            id: 'minds-scheduler',
            title: 'Mind Scheduler',
            x: 720, y: 470, width: 180, height: 70,
            layer: 3,
            parentGroup: 'minds-features',
            description: `<p>The Mind Scheduler enables automated execution:</p>
                <ul>
                    <li>Cron-style scheduling configuration</li>
                    <li>Trigger-based execution</li>
                    <li>API-driven invocation</li>
                    <li>Execution history and monitoring</li>
                </ul>
                <p>This allows minds to run automatically on schedules or in response to events.</p>`,
            connections: [],
            bgClass: 'mind-process'
        },
        {
            id: 'minds-lrag',
            title: 'L⚡RAG Integration',
            x: 920, y: 470, width: 180, height: 70,
            layer: 3,
            parentGroup: 'minds-features',
            description: `<p>Quantum Minds integrates with Lightning RAG for knowledge access:</p>
                <ul>
                    <li>Collection query operators</li>
                    <li>Document retrieval capabilities</li>
                    <li>Embedding generation within workflows</li>
                    <li>Context augmentation for AI models</li>
                </ul>
                <p>This integration enables workflows to leverage organizational knowledge.</p>`,
            connections: [],
            bgClass: 'mind-process'
        },
        {
            id: 'minds-helpers',
            title: 'User Assistance',
            x: 400, y: 650, width: 400, height: 100,
            layer: 4,
            isGroup: true,
            description: `<p>Features to help users create and manage minds more effectively.</p>`,
            connections: ['minds-features'],
            bgClass: 'component-bg'
        },
        {
            id: 'minds-ai-assistant',
            title: 'BI DI Assistant',
            x: 420, y: 665, width: 180, height: 70,
            layer: 4,
            parentGroup: 'minds-helpers',
            description: `<p>The Business Intelligence Design Intelligence (BI DI) assistant helps create minds:</p>
                <ul>
                    <li>Natural language mind specification</li>
                    <li>Automatic operator selection</li>
                    <li>Connection generation</li>
                    <li>Parameter configuration</li>
                    <li>Feasibility analysis</li>
                </ul>
                <p>This AI assistant dramatically simplifies mind creation for non-technical users.</p>`,
            connections: [],
            bgClass: 'mind-process'
        },
        {
            id: 'minds-templates',
            title: 'Mind Templates',
            x: 620, y: 665, width: 180, height: 70,
            layer: 4,
            parentGroup: 'minds-helpers',
            description: `<p>Pre-built mind templates accelerate development:</p>
                <ul>
                    <li>Industry-specific templates</li>
                    <li>Common use case implementations</li>
                    <li>Customizable starting points</li>
                    <li>Best practice examples</li>
                </ul>
                <p>Templates enable users to get started quickly with proven workflows.</p>`,
            connections: [],
            bgClass: 'mind-process'
        }
    ];

    // ============================
    // MCP STREAMS COMPONENTS
    // ============================
    const mcpComponents = [
        {
            id: 'mcp-main',
            title: 'MCP Streams',
            x: 600, y: 100, width: 200, height: 80,
            layer: 1,
            description: `<p>Model Connect Protocol (MCP) Streams enable data integration with external sources.</p>
                <p>Key capabilities:</p>
                <ul>
                    <li>Standardized connection protocol</li>
                    <li>Multiple source integrations</li>
                    <li>Data transformation pipeline</li>
                    <li>Scheduled data synchronization</li>
                </ul>`,
            connections: ['mcp-core'],
            bgClass: 'component-bg'
        },
        {
            id: 'mcp-core',
            title: 'Core Services',
            x: 400, y: 250, width: 400, height: 120,
            layer: 2,
            isGroup: true,
            description: `<p>The core services of the MCP Streams platform.</p>`,
            connections: [],
            bgClass: 'component-bg'
        },
        {
            id: 'mcp-connector',
            title: 'Connection Manager',
            x: 420, y: 270, width: 180, height: 70,
            layer: 2,
            parentGroup: 'mcp-core',
            description: `<p>The Connection Manager handles external system authentication and access:</p>
                <ul>
                    <li>API key and credential management</li>
                    <li>Connection pooling and reuse</li>
                    <li>Connection health monitoring</li>
                    <li>Error handling and retry logic</li>
                </ul>`,
            connections: [],
            bgClass: 'component-bg'
        },
        {
            id: 'mcp-transform',
            title: 'Data Transformation',
            x: 620, y: 270, width: 180, height: 70,
            layer: 2,
            parentGroup: 'mcp-core',
            description: `<p>The Data Transformation pipeline processes incoming data:</p>
                <ul>
                    <li>Schema mapping and normalization</li>
                    <li>Data cleaning and validation</li>
                    <li>Format conversion</li>
                    <li>Enrichment with additional context</li>
                    <li>Structured data preparation</li>
                </ul>`,
            connections: [],
            bgClass: 'component-bg'
        },
        {
            id: 'mcp-sources',
            title: 'External Sources',
            x: 250, y: 450, width: 700, height: 120,
            layer: 3,
            isGroup: true,
            description: `<p>External data sources that can be connected to MCP Streams.</p>`,
            connections: ['mcp-core'],
            bgClass: 'component-bg'
        },
        {
            id: 'mcp-saas',
            title: 'SaaS Integrations',
            x: 270, y: 470, width: 180, height: 70,
            layer: 3,
            parentGroup: 'mcp-sources',
            description: `<p>MCP supports a variety of SaaS platforms:</p>
                <ul>
                    <li>Salesforce for CRM data</li>
                    <li>HubSpot for marketing automation</li>
                    <li>Slack for team communications</li>
                    <li>Zendesk for customer support</li>
                    <li>Notion for knowledge management</li>
                </ul>`,
            connections: [],
            bgClass: 'mcp-connector'
        },
        {
            id: 'mcp-productivity',
            title: 'Productivity Tools',
            x: 470, y: 470, width: 180, height: 70,
            layer: 3,
            parentGroup: 'mcp-sources',
            description: `<p>Integration with common productivity tools:</p>
                <ul>
                    <li>Google Workspace (Gmail, Sheets, Docs)</li>
                    <li>Microsoft 365 (Outlook, Teams, Excel)</li>
                    <li>Zoom for meeting data</li>
                    <li>Dropbox and Google Drive for file storage</li>
                </ul>`,
            connections: [],
            bgClass: 'mcp-connector'
        },
        {
            id: 'mcp-databases',
            title: 'Databases & Storage',
            x: 670, y: 470, width: 180, height: 70,
            layer: 3,
            parentGroup: 'mcp-sources',
            description: `<p>Connections to various data storage systems:</p>
                <ul>
                    <li>SQL databases (PostgreSQL, MySQL, SQL Server)</li>
                    <li>NoSQL databases (MongoDB, DynamoDB)</li>
                    <li>Cloud storage (S3, Azure Blob Storage)</li>
                    <li>GraphQL endpoints</li>
                </ul>`,
            connections: [],
            bgClass: 'mcp-connector'
        },
        {
            id: 'mcp-features',
            title: 'Platform Features',
            x: 400, y: 600, width: 400, height: 120,
            layer: 4,
            isGroup: true,
            description: `<p>Advanced features of the MCP Streams platform.</p>`,
            connections: ['mcp-sources'],
            bgClass: 'component-bg'
        },
        {
            id: 'mcp-scheduling',
            title: 'Stream Scheduler',
            x: 420, y: 620, width: 180, height: 70,
            layer: 4,
            parentGroup: 'mcp-features',
            description: `<p>The Stream Scheduler manages automated data retrieval:</p>
                <ul>
                    <li>Time-based scheduling</li>
                    <li>Event-driven triggers</li>
                    <li>Dependency chain execution</li>
                    <li>Conflict resolution</li>
                </ul>`,
            connections: [],
            bgClass: 'component-bg'
        },
        {
            id: 'mcp-etl',
            title: 'AI ETL Pipeline',
            x: 620, y: 620, width: 180, height: 70,
            layer: 4,
            parentGroup: 'mcp-features',
            description: `<p>The AI-enhanced ETL (Extract, Transform, Load) pipeline:</p>
                <ul>
                    <li>Intelligent schema mapping</li>
                    <li>Anomaly detection during processing</li>
                    <li>Automated data cleaning</li>
                    <li>Semantic data categorization</li>
                    <li>Contextual enrichment</li>
                </ul>
                <p>This AI-driven approach improves data quality and reduces manual configuration.</p>`,
            connections: [],
            bgClass: 'mcp-process'
        }
    ];

    // ============================
    // INITIALIZE DIAGRAMS
    // ============================

    // Initialize Overview Diagram
    function initializeOverviewDiagram() {
        const svg = document.getElementById('overview-svg');
        createDiagram(svg, overviewComponents, 'overview');
    }

    // Initialize Embedding Diagram
    function initializeEmbeddingDiagram() {
        const svg = document.getElementById('embedding-svg');
        createDiagram(svg, embeddingComponents, 'embedding');
    }

    // Initialize Minds Diagram
    function initializeMindssDiagram() {
        const svg = document.getElementById('minds-svg');
        createDiagram(svg, mindsComponents, 'minds');
    }

    // Initialize MCP Diagram
    function initializeMcpDiagram() {
        const svg = document.getElementById('mcp-svg');
        createDiagram(svg, mcpComponents, 'mcp');
    }

    // Generic function to create a diagram
    function createDiagram(svg, components, prefix) {
        // Clear existing content
        svg.innerHTML = '';

        // Add defs for markers
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <marker id="arrowhead" markerWidth="10" markerHeight="7"
            refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#2563EB" />
            </marker>
        `;
        svg.appendChild(defs);

        // Create a container for connections that will go BEHIND the components
        const connectionsContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        connectionsContainer.setAttribute('class', 'connections-container');
        svg.appendChild(connectionsContainer);

        // Create a container for components that will go ON TOP of connections
        const componentsContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        componentsContainer.setAttribute('class', 'components-container');
        svg.appendChild(componentsContainer);

        // First create group components in the components container
        components.filter(c => c.isGroup).forEach(component => {
            createGroupComponent(componentsContainer, component, prefix);
        });

        // Then create regular components in the components container
        components.filter(c => !c.isGroup).forEach(component => {
            createComponent(componentsContainer, component, prefix);
        });

        // Then create connections in the connections container
        createLayeredConnections(connectionsContainer, components);

        // Add click handlers
        document.querySelectorAll(`.${prefix}-component`).forEach(componentElement => {
            componentElement.addEventListener('click', function() {
                const componentId = this.getAttribute('id');
                showComponentDetails(componentId, components, prefix);
            });

            // Add mouseover for tooltip
            componentElement.addEventListener('mouseover', function(e) {
                const title = this.querySelector('text').textContent;
                showTooltip(e, title);
            });

            // Remove tooltip on mouseout
            componentElement.addEventListener('mouseout', function() {
                hideTooltip();
            });
        });
    }

    // Create a group component (background container for related components)
    function createGroupComponent(container, component, prefix) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', component.id);
        group.setAttribute('class', `component ${prefix}-component`);
        group.setAttribute('data-title', component.title);

        // Create background rectangle with lower opacity
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', component.x);
        rect.setAttribute('y', component.y);
        rect.setAttribute('width', component.width);
        rect.setAttribute('height', component.height);
        rect.setAttribute('rx', '10');
        rect.setAttribute('ry', '10');
        rect.setAttribute('class', 'group-bg');
        rect.setAttribute('fill', '#e2e8f0');
        rect.setAttribute('stroke', '#94a3b8');
        rect.setAttribute('stroke-width', '1');
        rect.setAttribute('opacity', '0.6');

        // Create title text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', component.x + 15);
        text.setAttribute('y', component.y + 25);
        text.setAttribute('class', 'group-text');
        text.setAttribute('fill', '#475569');
        text.setAttribute('font-family', 'Readex Pro');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', '500');
        text.textContent = component.title;

        // Add to group
        group.appendChild(rect);
        group.appendChild(text);

        container.appendChild(group);
    }

    // Create a component on the SVG
    function createComponent(container, component, prefix) {
        // Skip if this is a group title
        if (component.isGroup) return;

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', component.id);
        group.setAttribute('class', `component ${prefix}-component`);
        group.setAttribute('data-title', component.title);

        // Create background rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', component.x);
        rect.setAttribute('y', component.y);
        rect.setAttribute('width', component.width);
        rect.setAttribute('height', component.height);
        rect.setAttribute('rx', '10');
        rect.setAttribute('ry', '10');
        rect.setAttribute('class', component.bgClass || 'component-bg');

        // Create title text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', component.x + component.width / 2);
        text.setAttribute('y', component.y + component.height / 2);
        text.setAttribute('class', 'component-text');
        text.textContent = component.title;

        // Add to group
        group.appendChild(rect);
        group.appendChild(text);

        // Add sub-components if any
        if (component.subComponents && component.subComponents.length > 0) {
            const subComponentWidth = component.width * 0.8 / component.subComponents.length;
            const subComponentHeight = 24;
            const startX = component.x + component.width * 0.1;
            const startY = component.y + component.height - subComponentHeight - 10;

            component.subComponents.forEach((subComp, index) => {
                const subRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                subRect.setAttribute('x', startX + index * subComponentWidth);
                subRect.setAttribute('y', startY);
                subRect.setAttribute('width', subComponentWidth * 0.9);
                subRect.setAttribute('height', subComponentHeight);
                subRect.setAttribute('class', 'sub-component-bg');

                const subText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                subText.setAttribute('x', startX + index * subComponentWidth + (subComponentWidth * 0.9) / 2);
                subText.setAttribute('y', startY + subComponentHeight / 2);
                subText.setAttribute('class', 'sub-component-text');
                subText.textContent = subComp;

                group.appendChild(subRect);
                group.appendChild(subText);
            });
        }

        container.appendChild(group);
    }

    // Create orthogonal connections between components based on layers
    function createLayeredConnections(container, components) {
        components.forEach(component => {
            if (component.connections && component.connections.length > 0) {
                component.connections.forEach(targetId => {
                    const target = components.find(c => c.id === targetId);
                    if (target) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');

                        // Calculate start and end points
                        let startX, startY, endX, endY;

                        // Calculate appropriate connection points based on relative positions
                        if (component.layer < target.layer) {
                            // Connecting to a lower layer (downward)
                            startX = component.x + component.width / 2;
                            startY = component.y + component.height;
                            endX = target.x + target.width / 2;
                            endY = target.y;
                        } else if (component.layer > target.layer) {
                            // Connecting to a higher layer (upward)
                            startX = component.x + component.width / 2;
                            startY = component.y;
                            endX = target.x + target.width / 2;
                            endY = target.y + target.height;
                        } else if (component.x < target.x) {
                            // Same layer, target is to the right
                            startX = component.x + component.width;
                            startY = component.y + component.height / 2;
                            endX = target.x;
                            endY = target.y + target.height / 2;
                        } else {
                            // Same layer, target is to the left
                            startX = component.x;
                            startY = component.y + component.height / 2;
                            endX = target.x + target.width;
                            endY = target.y + target.height / 2;
                        }

                        // Create a path with orthogonal lines
                        let path;

                        if (component.layer !== target.layer) {
                            // Different layers - use a simple midpoint
                            const midY = (startY + endY) / 2;
                            path = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
                        } else {
                            // Same layer - use direct line
                            path = `M ${startX} ${startY} L ${endX} ${endY}`;
                        }

                        line.setAttribute('d', path);
                        line.setAttribute('class', 'data-flow');
                        line.setAttribute('fill', 'none');

                        container.appendChild(line);
                    }
                });
            }
        });
    }

    // Show component details
    function showComponentDetails(componentId, components, prefix) {
        const component = components.find(c => c.id === componentId);
        if (component) {
            const detailsTitle = document.getElementById(`${prefix}-details-title`);
            const detailsContent = document.getElementById(`${prefix}-details-content`);

            detailsTitle.textContent = component.title;
            detailsContent.innerHTML = component.description;

            // Highlight the selected component
            document.querySelectorAll(`.${prefix}-component rect`).forEach(elem => {
                elem.classList.remove('highlight');
            });

            const selectedRect = document.querySelector(`#${componentId} rect`);
            if (selectedRect) {
                selectedRect.classList.add('highlight');
            }
        }
    }

    // Tooltip functionality
    let tooltip = null;

    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }

    function showTooltip(event, text) {
        if (!tooltip) {
            createTooltip();
        }

        tooltip.textContent = text;
        tooltip.style.left = `${event.pageX + 15}px`;
        tooltip.style.top = `${event.pageY - 30}px`;
        tooltip.style.opacity = '1';
    }

    function hideTooltip() {
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }

    // Prepare print version
    function preparePrintVersion() {
        // Create SVG copies for print
        if (overviewInitialized) {
            const overviewSvgCopy = document.getElementById('overview-svg').cloneNode(true);
            document.querySelector('.print-overview-diagram').innerHTML = '';
            document.querySelector('.print-overview-diagram').appendChild(overviewSvgCopy);
        }

        if (embeddingInitialized) {
            const embeddingSvgCopy = document.getElementById('embedding-svg').cloneNode(true);
            document.querySelector('.print-embedding-diagram').innerHTML = '';
            document.querySelector('.print-embedding-diagram').appendChild(embeddingSvgCopy);
        }

        if (mindsInitialized) {
            const mindsSvgCopy = document.getElementById('minds-svg').cloneNode(true);
            document.querySelector('.print-minds-diagram').innerHTML = '';
            document.querySelector('.print-minds-diagram').appendChild(mindsSvgCopy);
        }

        if (mcpInitialized) {
            const mcpSvgCopy = document.getElementById('mcp-svg').cloneNode(true);
            document.querySelector('.print-mcp-diagram').innerHTML = '';
            document.querySelector('.print-mcp-diagram').appendChild(mcpSvgCopy);
        }

        // Populate component details for print
        const printComponentsDiv = document.getElementById('print-components');
        printComponentsDiv.innerHTML = '';

        overviewComponents.forEach(component => {
            if (!component.isGroup) {
                const componentDiv = document.createElement('div');
                componentDiv.className = 'print-component';
                componentDiv.innerHTML = `
                    <h3>${component.title}</h3>
                    ${component.description}
                `;
                printComponentsDiv.appendChild(componentDiv);
            }
        });

        // Add embedding details
        document.getElementById('print-embedding-content').innerHTML = `
            <p>The Embedding Cluster is responsible for processing documents and generating vector embeddings that power the retrieval capabilities of the system.</p>
            <p>It supports three main embedding technologies:</p>
            <ul>
                <li><strong>PaddleOCR</strong>: Optimized for general documents with mixed content</li>
                <li><strong>Llama Parse</strong>: Cloud-based solution for complex document structures</li>
                <li><strong>Docling</strong>: On-premise secure processing for sensitive information</li>
            </ul>
            <p>The cluster implements job queue management to control processing load and communicates with other components via Kafka messaging.</p>
        `;

        // Add minds details
        document.getElementById('print-minds-content').innerHTML = `
            <p>Quantum Minds is a low-code agentic AI platform that enables users to build sophisticated AI workflows through a visual interface.</p>
            <p>Key components include:</p>
            <ul>
                <li><strong>Visual Mind Builder</strong>: Drag-and-drop interface for creating minds</li>
                <li><strong>Operator Library</strong>: Pre-built AI components across multiple categories</li>
                <li><strong>Mind Execution Engine</strong>: Runs the workflows with resource management</li>
                <li><strong>BI DI Assistant</strong>: AI-assisted mind creation from natural language descriptions</li>
            </ul>
            <p>The platform supports extensibility through custom operators linked to customer Git repositories.</p>
        `;

        // Add MCP details
        document.getElementById('print-mcp-content').innerHTML = `
            <p>Model Connect Protocol (MCP) Streams provide data integration capabilities for external sources.</p>
            <p>The system includes:</p>
            <ul>
                <li><strong>Connection Manager</strong>: Handles authentication and access to external systems</li>
                <li><strong>Data Transformation</strong>: Processes incoming data for use within the platform</li>
                <li><strong>Stream Scheduler</strong>: Manages automated data retrieval and synchronization</li>
                <li><strong>AI ETL Pipeline</strong>: Enhances data processing with AI capabilities</li>
            </ul>
            <p>MCP Streams integrate with the MindSchedular for automated execution and with Quantum Minds for AI-powered data processing.</p>
        `;
    }
});
