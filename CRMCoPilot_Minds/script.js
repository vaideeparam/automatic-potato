document.addEventListener('DOMContentLoaded', function() {
    // Authentication logic
    const loginOverlay = document.getElementById('login-overlay');
    const contentElement = document.getElementById('content');
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('login-button');
    const loginError = document.getElementById('login-error');
    
    // Correct password
    const CORRECT_PASSWORD = "param2024";
    
    // Always show login on page load - removed localStorage persistence
    setTimeout(function() {
        // Use a slight delay to ensure DOM is fully loaded
        loginOverlay.classList.remove('hidden');
        contentElement.classList.add('hidden');
        
        // Focus on password input for better UX
        passwordInput.focus();
    }, 100);
    
    // Handle login button click
    loginButton.addEventListener('click', function() {
        processLogin();
    });
    
    // Allow pressing Enter key to submit
    passwordInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            processLogin();
        }
    });
    
    // Centralized login processing function
    function processLogin() {
        const enteredPassword = passwordInput.value;
        
        if (enteredPassword === CORRECT_PASSWORD) {
            // Authentication successful
            loginOverlay.classList.add('hidden');
            
            // Small delay before showing content (helps with rendering)
            setTimeout(function() {
                contentElement.classList.remove('hidden');
            }, 50);
        } else {
            // Authentication failed
            loginError.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
    // Collection of mind detail data
    const mindDetails = {
        // Raw Data Collection Minds
        EmailCommunicationProcessor: {
            title: "EmailCommunicationProcessor",
            description: "Processes customer email communications and extracts structured data for relationship management.",
            inputSource: "Company Email Server (Gmail or Microsoft 365)",
            outputCollection: "customer_interactions",
            executionSchedule: "Initial load: All emails from past 6 months\nIncremental: Every 2 hours",
            operators: [
                {
                    name: "MCP Client",
                    description: "Connection: Email API with OAuth<br>Filters:<br>- customer-related emails (domain filter)<br>- last 24 hours (incremental collection)<br>- exclude internal distribution lists<br>Output: Raw email content, headers, metadata"
                },
                {
                    name: "LLMSummariser",
                    description: "Prompt: \"For each email thread between our company and {customer_company}, extract:<br>- Main topic of discussion<br>- Supply chain issues mentioned<br>- Product features discussed<br>- Action items and next steps<br>- Key decision-makers involved<br>- Timeline expectations<br>- Sentiment (positive/neutral/negative)<br>- Order/shipment references<br><br>Present this as structured data with clear sections. If the email is purely administrative (scheduling, etc.), label it as 'Administrative'.\""
                },
                {
                    name: "RAGEmbed",
                    description: "Collection: customer_interactions<br>Metadata to include:<br>- customer_id: \"{customer_id}\"<br>- communication_channel: \"email\"<br>- thread_id: \"{email_thread_id}\"<br>- participants: [list of email addresses]<br>- timestamp: \"{email_timestamp}\"<br>- sentiment_score: {calculated_sentiment}<br>- topic_classification: \"{extracted_topic}\"<br>- roles_allowed: [\"account_managers\", \"customer_success\", \"sales_team\"]"
                }
            ]
        },
        SlackThreadExtractor: {
            title: "SlackThreadExtractor",
            description: "Extracts customer-related discussions from Slack channels and processes them for insights.",
            inputSource: "Slack Workspace API",
            outputCollection: "internal_discussions",
            executionSchedule: "Initial load: Past 3 months of relevant threads\nIncremental: Every 4 hours",
            operators: [
                {
                    name: "MCP Client",
                    description: "Connection: Slack API with Bot token<br>Channels to monitor:<br>- #customer-support<br>- #logistics-issues<br>- #implementation-team<br>- #sales-discussions<br>- customer-specific channels<br>Filters:<br>- Threads with customer mentions<br>- Contains keywords: [shipment, order, delivery, integration, API, onboarding]<br>Output: Thread text, participants, timestamps, reactions"
                },
                {
                    name: "LLMSummariser",
                    description: "Prompt: \"Analyze this Slack conversation about customer {customer_name} and extract:<br>- Internal discussion about customer issues<br>- Supply chain problems mentioned<br>- Solution approaches discussed<br>- Action items assigned internally<br>- Timeline commitments<br>- Integration challenges<br>- Feature requests or limitations<br>- Customer sentiment indicators<br><br>Focus on extracting factual information that would be relevant for customer relationship management. Omit personal opinions about the customer that aren't relevant to their business needs.\""
                },
                {
                    name: "RAGEmbed",
                    description: "Collection: internal_discussions<br>Metadata to include:<br>- customer_id: \"{customer_id}\"<br>- communication_channel: \"slack\"<br>- thread_id: \"{slack_thread_id}\"<br>- channel: \"{channel_name}\"<br>- participants: [list of slack usernames]<br>- timestamp: \"{thread_timestamp}\"<br>- urgency_level: \"{extracted_urgency}\"<br>- topic_classification: \"{extracted_topic}\"<br>- roles_allowed: [\"account_managers\", \"implementation_team\", \"product_team\"]"
                }
            ]
        },
        ZoomTranscriptVectorizer: {
            title: "ZoomTranscriptVectorizer",
            description: "Processes Zoom meeting transcripts to extract customer needs, challenges, and action items.",
            inputSource: "Zoom Cloud Recordings API",
            outputCollection: "meeting_records",
            executionSchedule: "Initial load: Past 2 months of recordings\nIncremental: Twice daily",
            operators: [
                {
                    name: "MCP Client",
                    description: "Connection: Zoom API with OAuth<br>Filters:<br>- Meeting recordings with customers<br>- Audio transcripts available<br>- Past 48 hours (incremental)<br>Output: Meeting metadata, participants, transcript text"
                },
                {
                    name: "LLMSummariser",
                    description: "Prompt: \"Analyze this customer meeting transcript with {customer_company} and extract:<br>- Meeting purpose and agenda<br>- Key discussion points about supply chain functionality<br>- Challenges the customer is experiencing with:<br>  * Inventory management<br>  * Order tracking<br>  * Supplier coordination<br>  * Logistics visibility<br>  * Forecasting accuracy<br>- Feature requests or enhancement suggestions<br>- Implementation timeline discussions<br>- Technical questions raised<br>- Commitments made by either party<br>- Overall meeting sentiment<br>- Next steps agreed upon<br><br>Distinguish between different speakers and their roles when relevant.\""
                },
                {
                    name: "PandasAIDf",
                    description: "Extract structured data:<br>- Calculate meeting engagement metrics<br>- Tag topics based on keyword frequency<br>- Generate timeline of action items<br>- Classify meeting type (sales, support, review, training)<br>Output: Enriched meeting data frame"
                },
                {
                    name: "RAGEmbed",
                    description: "Collection: meeting_records<br>Metadata to include:<br>- customer_id: \"{customer_id}\"<br>- communication_channel: \"zoom\"<br>- meeting_id: \"{zoom_meeting_id}\"<br>- participants: [list with roles if available]<br>- timestamp: \"{meeting_start_time}\"<br>- duration_minutes: {meeting_duration}<br>- meeting_type: \"{classified_type}\"<br>- sentiment_score: {calculated_sentiment}<br>- key_topics: [extracted topics]<br>- roles_allowed: [\"account_managers\", \"sales_team\", \"implementation_team\", \"executives\"]"
                }
            ]
        },
        SupportTicketProcessor: {
            title: "SupportTicketProcessor",
            description: "Processes support tickets to extract customer issues, resolutions, and sentiment.",
            inputSource: "Zendesk/Intercom/Freshdesk API",
            outputCollection: "customer_interactions",
            executionSchedule: "Initial load: All tickets from past year\nIncremental: Every 30 minutes",
            operators: [
                {
                    name: "MCP Client",
                    description: "Connection: Support platform API<br>Filters:<br>- All tickets (new and updated)<br>- Contains custom fields for proper routing<br>Output: Ticket content, customer info, timestamps, priority"
                },
                {
                    name: "PandasAIDf",
                    description: "Data transformations:<br>- Standardize customer identifiers<br>- Normalize issue categories<br>- Calculate response times<br>- Track issue resolution path<br>- Identify repeat issues<br>Output: Structured support ticket data frame"
                },
                {
                    name: "RAGEmbed",
                    description: "Collection: customer_interactions<br>Metadata to include:<br>- customer_id: \"{customer_id}\"<br>- communication_channel: \"support_ticket\"<br>- ticket_id: \"{ticket_id}\"<br>- assignee: \"{support_agent}\"<br>- timestamp: \"{ticket_created_time}\"<br>- resolution_time_hours: {calculated_time_to_resolve}<br>- priority_level: \"{ticket_priority}\"<br>- issue_category: \"{classified_issue}\"<br>- product_area: \"{affected_feature}\"<br>- status: \"{current_status}\"<br>- roles_allowed: [\"support_team\", \"customer_success\", \"product_team\"]"
                }
            ]
        },
        QuoteProposalExtractor: {
            title: "QuoteProposalExtractor",
            description: "Extracts structured data from sales proposals and quotes for pipeline management.",
            inputSource: "Document Storage (Google Drive/Sharepoint)",
            outputCollection: "sales_activities",
            executionSchedule: "Initial load: All proposals from past 6 months\nIncremental: Daily",
            operators: [
                {
                    name: "MCP Client",
                    description: "Connection: Document storage API<br>Filters:<br>- Document types: [PDF, DOCX, PPTX]<br>- Folders: [\"Customer Proposals\", \"Sales Quotes\", \"Contracts\"]<br>- Modified in last 72 hours (incremental)<br>Output: Document content, metadata, creation date"
                },
                {
                    name: "LLMSummariser",
                    description: "Prompt: \"Extract key information from this supply chain software proposal/quote for {customer_company}:<br>- Proposed solution components<br>- Pricing structure and total contract value<br>- Modules included:<br>  * Inventory management<br>  * Order processing<br>  * Supplier management<br>  * Logistics optimization<br>  * Forecasting<br>  * Analytics<br>- Implementation timeline<br>- Integration requirements<br>- Customer-specific customizations<br>- Success metrics and KPIs<br>- Terms and conditions highlights<br>- Decision deadline<br><br>Present this as structured data that could be used for sales pipeline tracking.\""
                },
                {
                    name: "RAGEmbed",
                    description: "Collection: sales_activities<br>Metadata to include:<br>- customer_id: \"{customer_id}\"<br>- document_type: \"proposal\" or \"quote\"<br>- document_id: \"{file_id}\"<br>- created_by: \"{sales_rep}\"<br>- timestamp: \"{document_created_date}\"<br>- contract_value: {extracted_value}<br>- product_modules: [list of included modules]<br>- proposal_stage: \"{sales_stage}\"<br>- decision_date: \"{extracted_deadline}\"<br>- roles_allowed: [\"sales_team\", \"sales_operations\", \"executives\"]"
                }
            ]
        },
        SalesforceOpportunityIngestor: {
            title: "SalesforceOpportunityIngestor",
            description: "Extracts and processes sales opportunity data from Salesforce.",
            inputSource: "Salesforce API",
            outputCollection: "sales_activities",
            executionSchedule: "Initial load: All active opportunities\nIncremental: Every 6 hours",
            operators: [
                {
                    name: "MCP Client",
                    description: "Connection: Salesforce API with OAuth<br>Objects: Opportunity, OpportunityLineItem, OpportunityHistory<br>Output: Opportunity records with related data"
                },
                {
                    name: "PandasAIDf",
                    description: "Data transformations:<br>- Join related objects<br>- Calculate win probability adjustments<br>- Normalize product categories<br>- Track opportunity progression<br>Output: Structured opportunity data frame"
                },
                {
                    name: "RAGEmbed",
                    description: "Collection: sales_activities<br>Metadata to include:<br>- customer_id<br>- opportunity_id<br>- opportunity_name<br>- stage<br>- amount<br>- close_date<br>- probability<br>- created_date<br>- owner_id<br>- product_interest<br>- roles_allowed: [\"sales_team\", \"executives\"]"
                }
            ]
        },
        SalesforceAccountProfiler: {
            title: "SalesforceAccountProfiler",
            description: "Extracts and processes customer account information from Salesforce.",
            inputSource: "Salesforce API",
            outputCollection: "sales_activities",
            executionSchedule: "Initial load: All active accounts\nIncremental: Daily updates",
            operators: [
                {
                    name: "MCP Client",
                    description: "Connection: Salesforce API with OAuth<br>Objects: Account, Contact, AccountTeamMember<br>Output: Account records with related contacts and team information"
                },
                {
                    name: "PandasAIDf",
                    description: "Data transformations:<br>- Normalize company information<br>- Structure contact hierarchy<br>- Calculate account metrics (size, tenure, annual value)<br>- Extract industry-specific data<br>Output: Structured account data frame"
                },
                {
                    name: "RAGEmbed",
                    description: "Collection: sales_activities<br>Metadata to include:<br>- customer_id<br>- account_name<br>- industry<br>- annual_revenue<br>- number_of_employees<br>- locations<br>- account_tier<br>- customer_since<br>- account_owner<br>- roles_allowed: [\"sales_team\", \"customer_success\", \"executives\"]"
                }
            ]
        },
        TeamsCallAnalyzer: {
            title: "TeamsCallAnalyzer",
            description: "Extracts and analyzes customer insights from Microsoft Teams call recordings.",
            inputSource: "Microsoft Teams API",
            outputCollection: "meeting_records",
            executionSchedule: "Initial load: Past 2 months of call recordings\nIncremental: Daily",
            operators: [
                {
                    name: "MCP Client",
                    description: "Connection: Teams API with OAuth<br>Filters:<br>- Call recordings with customers<br>- Audio transcripts available<br>- Past 24 hours (incremental)<br>Output: Call metadata, participants, transcript text"
                },
                {
                    name: "LLMSummariser",
                    description: "Prompt: \"Analyze this customer call transcript with {customer_company} and extract:<br>- Call purpose<br>- Key discussion points<br>- Customer concerns or issues<br>- Product feature discussions<br>- Action items agreed upon<br>- Next steps<br>- Overall sentiment<br><br>Distinguish between different speakers and their roles when relevant.\""
                },
                {
                    name: "RAGEmbed",
                    description: "Collection: meeting_records<br>Metadata to include:<br>- customer_id: \"{customer_id}\"<br>- communication_channel: \"teams_call\"<br>- call_id: \"{teams_call_id}\"<br>- participants: [list with roles if available]<br>- timestamp: \"{call_start_time}\"<br>- duration_minutes: {call_duration}<br>- call_type: \"{classified_type}\"<br>- sentiment_score: {calculated_sentiment}<br>- key_topics: [extracted topics]<br>- roles_allowed: [\"account_managers\", \"sales_team\", \"support_team\"]"
                }
            ]
        },
        
        // AI-Processed Collection Minds
        CustomerProfileGenerator: {
            title: "CustomerProfileGenerator",
            description: "Generates comprehensive customer profiles by analyzing sales and interaction data.",
            inputSource: "sales_activities, customer_interactions",
            outputCollection: "customer_profiles",
            executionSchedule: "Full refresh: Monthly\nIncremental updates: Daily or on significant events",
            operators: [
                {
                    name: "RAGSummariser (sales_activities)",
                    description: "Query: Retrieve all vectors related to customer {customer_id} from sales_activities<br>Output: Summarized sales context about customer"
                },
                {
                    name: "RAGSummariser (customer_interactions)",
                    description: "Query: Retrieve all vectors related to customer {customer_id} from customer_interactions<br>Output: Summarized interaction context about customer"
                },
                {
                    name: "LLMSummariser",
                    description: "Input: Combined outputs from both RAGSummarisers<br>Task: \"Generate a comprehensive customer profile with sections:<br>- Company Overview<br>- Key Contacts (with roles and influence)<br>- Current Product Usage<br>- Pain Points & Challenges<br>- Growth Opportunities<br>- Relationship History<br>- Risk Factors\"<br>Format: Structured markdown with tables<br>Output: Comprehensive customer profile in markdown"
                },
                {
                    name: "RAGEmbed",
                    description: "Embed the comprehensive profile<br>Store in customer_profiles collection<br>Add metadata:<br>- generation_date<br>- source_documents_count<br>- confidence_score<br>- last_interaction_date"
                }
            ]
        },
        ChurnRiskCalculator: {
            title: "ChurnRiskCalculator",
            description: "Analyzes customer data to identify churn risk indicators and calculate overall risk scores.",
            inputSource: "customer_interactions, sales_activities",
            outputCollection: "risk_assessments",
            executionSchedule: "Weekly for all accounts\nDaily for high-risk accounts",
            operators: [
                {
                    name: "RAGSummariser (customer_interactions)",
                    description: "Query: Retrieve all vectors related to customer {customer_id} from last 90 days<br>Output: Summarized recent customer interactions"
                },
                {
                    name: "RAGSummariser (sales_activities)",
                    description: "Query: Retrieve all vectors related to customer {customer_id} contract and renewal information<br>Output: Summarized sales and contract information"
                },
                {
                    name: "LLMSummariser",
                    description: "Input: Combined outputs from both RAGSummarisers<br>Task: \"Identify risk factors for customer churn based on:<br>- Declining engagement patterns<br>- Negative sentiment trends<br>- Support escalations<br>- Contract renewal timing<br>- Competitive mentions<br>- Usage pattern changes\"<br>Format: Structured markdown with risk metrics table<br>Output: Churn risk assessment with scoring"
                },
                {
                    name: "PandasAIDf",
                    description: "Extract structured risk metrics from markdown<br>Calculate overall risk score<br>Categorize risk factors<br>Generate risk timeline"
                },
                {
                    name: "RAGEmbed",
                    description: "Embed the risk assessment<br>Store in risk_assessments collection<br>Add metadata:<br>- risk_score<br>- top_risk_factors<br>- recommended_actions<br>- time_to_renewal"
                }
            ]
        },
        CustomerJourneyMapper: {
            title: "CustomerJourneyMapper",
            description: "Maps the complete customer journey by analyzing all interactions chronologically.",
            inputSource: "All raw collections",
            outputCollection: "relationship_timelines",
            executionSchedule: "Monthly refresh with weekly updates",
            operators: [
                {
                    name: "Multiple RAGSummarisers",
                    description: "One per collection to retrieve all customer interactions<br>Output: Summarized interactions from each collection"
                },
                {
                    name: "LLMSummariser",
                    description: "Input: Combined outputs from all RAGSummarisers<br>Task: \"Create a chronological customer journey map showing:<br>- Initial engagement<br>- Sales process<br>- Implementation phases<br>- Support history<br>- Expansion discussions<br>- Key milestones and decisions\"<br>Output: Structured timeline with significant events"
                },
                {
                    name: "CreateDataset",
                    description: "Format timeline data into structured dataset<br>Generate timeline visualization data"
                },
                {
                    name: "RAGEmbed",
                    description: "Embed the journey map<br>Store in relationship_timelines collection<br>Add metadata about key milestones and relationship health"
                }
            ]
        },
        OpportunityAnalyzer: {
            title: "OpportunityAnalyzer",
            description: "Analyzes sales opportunities to calculate win probability and provide actionable insights.",
            inputSource: "sales_activities, meeting_records",
            outputCollection: "opportunity_insights",
            executionSchedule: "Weekly for all opportunities\nDaily for high-value opportunities",
            operators: [
                {
                    name: "RAGSummariser (sales_activities)",
                    description: "Query: Retrieve all vectors related to opportunity {opportunity_id}<br>Output: Summarized sales activity about the opportunity"
                },
                {
                    name: "RAGSummariser (meeting_records)",
                    description: "Query: Retrieve meeting records related to this opportunity<br>Output: Summarized meeting insights related to the opportunity"
                },
                {
                    name: "LLMSummariser",
                    description: "Input: Combined outputs from both RAGSummarisers<br>Task: \"Analyze this sales opportunity and provide insights on:<br>- Deal velocity (is it moving faster/slower than expected?)<br>- Stakeholder engagement<br>- Competitive positioning<br>- Potential blockers<br>- Suggested next actions<br>- Win probability factors\"<br>Output: Structured opportunity analysis"
                },
                {
                    name: "PandasAIDf",
                    description: "Calculate metrics:<br>- Adjusted win probability<br>- Deal velocity score<br>- Engagement index<br>- Competitive threat level<br>Output: Opportunity metrics dataframe"
                },
                {
                    name: "RAGEmbed",
                    description: "Embed the opportunity analysis<br>Store in opportunity_insights collection<br>Add metadata:<br>- opportunity_id<br>- win_probability<br>- deal_velocity<br>- recommended_actions<br>- blocker_count<br>- last_activity_date"
                }
            ]
        },
        SentimentTrendAnalyzer: {
            title: "SentimentTrendAnalyzer",
            description: "Tracks and analyzes customer sentiment trends over time across multiple channels.",
            inputSource: "customer_interactions",
            outputCollection: "sentiment_analysis",
            executionSchedule: "Weekly for all customers\nDaily for at-risk customers",
            operators: [
                {
                    name: "RAGSummariser",
                    description: "Query: Retrieve all customer interactions for {customer_id} from the last 90 days<br>Output: Summarized customer interactions with sentiment indicators"
                },
                {
                    name: "LLMSummariser",
                    description: "Task: \"Analyze sentiment trends for this customer over time. Consider:<br>- Overall sentiment trajectory (improving/declining)<br>- Channel-specific sentiment differences<br>- Key topics driving sentiment changes<br>- Individual stakeholder sentiment variations<br>- Correlation with product usage or support incidents\"<br>Output: Sentiment analysis with trend identification"
                },
                {
                    name: "PandasAIDf",
                    description: "Generate time series metrics:<br>- Weekly sentiment scores<br>- Channel-specific sentiment<br>- Topic-based sentiment<br>- Sentiment volatility<br>Output: Structured sentiment dataframe with visualization data"
                },
                {
                    name: "RAGEmbed",
                    description: "Embed the sentiment analysis<br>Store in sentiment_analysis collection<br>Add metadata:<br>- customer_id<br>- sentiment_trend<br>- current_sentiment<br>- volatility_score<br>- key_concerns<br>- sentiment_by_channel"
                }
            ]
        },
        UpsellOpportunityDetector: {
            title: "UpsellOpportunityDetector",
            description: "Identifies potential upsell and cross-sell opportunities based on customer profiles and activities.",
            inputSource: "customer_profiles, sales_activities",
            outputCollection: "opportunity_insights",
            executionSchedule: "Monthly for all customers",
            operators: [
                {
                    name: "RAGSummariser (customer_profiles)",
                    description: "Query: Retrieve the customer profile for {customer_id}<br>Output: Summarized customer profile information"
                },
                {
                    name: "RAGSummariser (sales_activities)",
                    description: "Query: Retrieve recent sales activities for {customer_id}<br>Output: Summarized recent sales activities"
                },
                {
                    name: "LLMSummariser",
                    description: "Input: Combined outputs from both RAGSummarisers<br>Task: \"Identify potential upsell opportunities for this customer based on:<br>- Current product usage<br>- Mentioned pain points<br>- Industry-specific needs<br>- Similar customer expansions<br>- Recent growth indicators<br>- Complementary product modules\"<br>Output: Structured upsell opportunity analysis"
                },
                {
                    name: "PandasAIDf",
                    description: "Calculate opportunity metrics:<br>- Opportunity value estimation<br>- Prioritization score<br>- Likelihood of success<br>- Time-to-close estimation<br>Output: Ranked upsell opportunities"
                },
                {
                    name: "RAGEmbed",
                    description: "Embed the upsell analysis<br>Store in opportunity_insights collection<br>Add metadata:<br>- customer_id<br>- opportunity_type: \"upsell\"<br>- product_modules<br>- estimated_value<br>- priority_score<br>- success_probability"
                }
            ]
        },
        QuarterlyBusinessReviewer: {
            title: "QuarterlyBusinessReviewer",
            description: "Automatically generates QBR materials based on customer data and insights.",
            inputSource: "customer_profiles, opportunity_insights",
            outputCollection: "opportunity_insights",
            executionSchedule: "Quarterly for all strategic accounts",
            operators: [
                {
                    name: "RAGSummariser (customer_profiles)",
                    description: "Query: Retrieve the customer profile for {customer_id}<br>Output: Summarized customer profile information"
                },
                {
                    name: "RAGSummariser (opportunity_insights)",
                    description: "Query: Retrieve opportunity insights for {customer_id}<br>Output: Summarized opportunity information"
                },
                {
                    name: "LLMSummariser",
                    description: "Input: Combined outputs from both RAGSummarisers<br>Task: \"Generate a Quarterly Business Review for this customer with sections:<br>- Executive Summary<br>- Account Overview<br>- Product Usage & Adoption<br>- Success Metrics<br>- Support Summary<br>- Strategic Initiatives<br>- Growth Opportunities<br>- Action Items\"<br>Output: Structured QBR document"
                },
                {
                    name: "CreateDataset",
                    description: "Format QBR data for presentation<br>Generate visualization data for metrics<br>Create executive dashboard components"
                },
                {
                    name: "RAGEmbed",
                    description: "Embed the QBR document<br>Store in opportunity_insights collection<br>Add metadata:<br>- customer_id<br>- document_type: \"qbr\"<br>- quarter<br>- fiscal_year<br>- account_health<br>- expansion_opportunity<br>- action_items_count"
                }
            ]
        },
        ExecutiveSummaryCreator: {
            title: "ExecutiveSummaryCreator",
            description: "Creates executive-level summaries of customer accounts for leadership reviews.",
            inputSource: "customer_profiles, risk_assessments",
            outputCollection: "customer_profiles",
            executionSchedule: "Monthly for all strategic accounts",
            operators: [
                {
                    name: "RAGSummariser (customer_profiles)",
                    description: "Query: Retrieve the customer profile for {customer_id}<br>Output: Summarized customer profile information"
                },
                {
                    name: "RAGSummariser (risk_assessments)",
                    description: "Query: Retrieve risk assessment for {customer_id}<br>Output: Summarized risk information"
                },
                {
                    name: "LLMSummariser",
                    description: "Input: Combined outputs from both RAGSummarisers<br>Task: \"Create an executive summary of this customer account with sections:<br>- Business Impact Overview<br>- Strategic Value<br>- Current Status<br>- Key Risks & Mitigations<br>- Expansion Potential<br>- Executive Relationship Map<br>- Strategic Recommendations\"<br>Output: Concise executive summary"
                },
                {
                    name: "RAGEmbed",
                    description: "Embed the executive summary<br>Store in customer_profiles collection<br>Add metadata:<br>- customer_id<br>- document_type: \"executive_summary\"<br>- strategic_tier<br>- account_value<br>- risk_level<br>- growth_potential<br>- executive_sponsor"
                }
            ]
        }
    };

    // Add click event to all mind cards
    const mindCards = document.querySelectorAll('.mind-card');
    const detailContainer = document.getElementById('mind-detail-container');
    const detailContent = document.getElementById('mind-detail-content');
    const closeButton = document.getElementById('close-detail');

    mindCards.forEach(card => {
        card.addEventListener('click', function() {
            const mindName = this.getAttribute('data-mind');
            const mind = mindDetails[mindName];
            
            if (mind) {
                // Generate the detail content
                let content = `
                    <h2>${mind.title}</h2>
                    <p>${mind.description}</p>
                    
                    <div class="mind-detail-meta">
                        <p><strong>Input Source:</strong> ${mind.inputSource}</p>
                        <p><strong>Output Collection:</strong> ${mind.outputCollection}</p>
                        <p><strong>Execution Schedule:</strong><br>${mind.executionSchedule}</p>
                    </div>
                    
                    <h3>Operators</h3>
                    <div class="mind-detail-operators">
                `;
                
                // Add each operator
                mind.operators.forEach(operator => {
                    content += `
                        <div class="operator-box">
                            <div class="operator-header">${operator.name}</div>
                            <div class="operator-description">${operator.description}</div>
                        </div>
                    `;
                });
                
                content += `</div>`;
                
                // Set the content and show the detail panel
                detailContent.innerHTML = content;
                detailContainer.classList.remove('hidden');
            }
        });
    });
    
    // Close detail panel when close button is clicked
    closeButton.addEventListener('click', function() {
        detailContainer.classList.add('hidden');
    });
    
    // Close detail panel when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === detailContainer) {
            detailContainer.classList.add('hidden');
        }
    });
    
    // SVG enhancements - Add arrowhead marker
    const svg = document.getElementById('mind-flow-diagram');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', '#666666');
    
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.insertBefore(defs, svg.firstChild);
    
    // Add arrowhead to all paths
    const paths = svg.querySelectorAll('path');
    paths.forEach(path => {
        path.setAttribute('marker-end', 'url(#arrowhead)');
    });
});
