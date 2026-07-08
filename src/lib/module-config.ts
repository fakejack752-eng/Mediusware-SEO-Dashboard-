export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "boolean" | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  width?: string;
  showInTable?: boolean;
  tableWidth?: string;
}

export interface ModuleConfig {
  id: string;
  label: string;
  icon: string;
  description: string;
  apiEndpoint: string;
  fields: FieldConfig[];
}

export const modules: ModuleConfig[] = [
  {
    id: "market-intel",
    label: "Market Intelligence",
    icon: "TrendingUp",
    description: "Track market signals, trends, and audience insights across platforms",
    apiEndpoint: "/api/market-intel",
    fields: [
      { key: "date", label: "Date", type: "date", required: true, showInTable: true, tableWidth: "w-28" },
      { key: "sourcePlatform", label: "Source Platform", type: "select", required: true, options: ["Google Trends", "Reddit", "LinkedIn", "Twitter/X", "HackerNews", "ProductHunt", "G2/Capterra", "Forrester", "Gartner", "McKinsey", "IDC", "Semrush", "Ahrefs", "Manual"], showInTable: true, tableWidth: "w-32" },
      { key: "topicTheme", label: "Topic/Theme", type: "text", required: true, placeholder: "e.g. AI-driven testing", showInTable: true, tableWidth: "w-40" },
      { key: "signalType", label: "Signal Type", type: "select", options: ["Trend", "Mention", "Report", "News", "Product", "Competitor Move", "Regulation", "Technology"], showInTable: true, tableWidth: "w-28" },
      { key: "searchVolumeTrend", label: "Search Volume Trend", type: "select", options: ["Rising", "Falling", "Stable", "Spike", "Declining"], showInTable: true, tableWidth: "w-28" },
      { key: "sentiment", label: "Sentiment", type: "select", options: ["Positive", "Negative", "Neutral", "Mixed"], showInTable: true, tableWidth: "w-24" },
      { key: "geography", label: "Geography", type: "text", placeholder: "e.g. US, Global" },
      { key: "audienceSegment", label: "Audience Segment", type: "text", placeholder: "e.g. CTOs, QA Leads" },
      { key: "keyInsight", label: "Key Insight", type: "textarea", placeholder: "Main takeaway from this signal..." },
      { key: "relevanceScore", label: "Relevance Score", type: "number", placeholder: "0-100", showInTable: true, tableWidth: "w-24" },
      { key: "suggestedAction", label: "Suggested Action", type: "text", placeholder: "e.g. Create comparison page" },
      { key: "linkedModule", label: "Linked Module", type: "select", options: ["Market Intel", "Competitor Intel", "Keyword Intel", "SERP Analysis", "AI Search Audit", "Content Pipeline", "Performance", "Content Gap"] },
      { key: "owner", label: "Owner", type: "text", placeholder: "e.g. John Doe" },
    ],
  },
  {
    id: "competitor-intel",
    label: "Competitor Intelligence",
    icon: "Users",
    description: "Monitor competitor content, authority, and content gaps",
    apiEndpoint: "/api/competitor-intel",
    fields: [
      { key: "competitor", label: "Competitor", type: "text", required: true, showInTable: true, tableWidth: "w-32" },
      { key: "domain", label: "Domain", type: "text", placeholder: "e.g. competitor.com", showInTable: true, tableWidth: "w-36" },
      { key: "pageUrl", label: "Page URL", type: "text", placeholder: "https://..." },
      { key: "contentType", label: "Content Type", type: "select", options: ["Blog", "Product Page", "Landing Page", "Documentation", "Case Study", "Comparison", "Guide", "Listicle", "Directory", "Service Page", "Video", "Infographic", "Whitepaper", "Webinar"], showInTable: true, tableWidth: "w-28" },
      { key: "targetKeyword", label: "Target Keyword", type: "text", placeholder: "e.g. qa automation tools", showInTable: true, tableWidth: "w-40" },
      { key: "publishDate", label: "Publish Date", type: "date", showInTable: true, tableWidth: "w-28" },
      { key: "wordCount", label: "Word Count", type: "number", showInTable: true, tableWidth: "w-24" },
      { key: "estDa", label: "Est. DA", type: "number", showInTable: true, tableWidth: "w-20" },
      { key: "referringDomains", label: "Referring Domains", type: "number" },
      { key: "estTraffic", label: "Est. Traffic", type: "number", showInTable: true, tableWidth: "w-28" },
      { key: "contentGap", label: "Content Gap", type: "text", placeholder: "e.g. No comparison page" },
      { key: "priority", label: "Priority", type: "select", options: ["Critical", "High", "Medium", "Low"], showInTable: true, tableWidth: "w-24" },
      { key: "confidenceNotes", label: "Confidence Notes", type: "textarea", placeholder: "Additional context..." },
    ],
  },
  {
    id: "keyword-intel",
    label: "Keyword Intelligence",
    icon: "Search",
    description: "Research keywords, clusters, difficulty, and ranking opportunities",
    apiEndpoint: "/api/keyword-intel",
    fields: [
      { key: "keyword", label: "Keyword", type: "text", required: true, showInTable: true, tableWidth: "w-44" },
      { key: "cluster", label: "Cluster", type: "text", placeholder: "e.g. QA Automation", showInTable: true, tableWidth: "w-32" },
      { key: "volume", label: "Volume", type: "number", showInTable: true, tableWidth: "w-24" },
      { key: "kd", label: "KD", type: "number", showInTable: true, tableWidth: "w-20" },
      { key: "cpc", label: "CPC", type: "number", showInTable: true, tableWidth: "w-20" },
      { key: "intent", label: "Intent", type: "select", options: ["Commercial", "Informational", "Transactional", "Navigational"], showInTable: true, tableWidth: "w-28" },
      { key: "serpFeatures", label: "SERP Features", type: "text", placeholder: "e.g. Featured Snippet, PAA" },
      { key: "priorityScore", label: "Priority Score", type: "number", placeholder: "0-100", showInTable: true, tableWidth: "w-28" },
      { key: "targetPage", label: "Target Page", type: "text", placeholder: "e.g. /blog/qa-tools" },
      { key: "currentRank", label: "Current Rank", type: "number", showInTable: true, tableWidth: "w-24" },
      { key: "status", label: "Status", type: "select", options: ["Not Started", "In Progress", "Ranking", "Top 10", "Top 3", "Declining", "Improving"], showInTable: true, tableWidth: "w-28" },
      { key: "dataSource", label: "Data Source", type: "select", options: ["Ahrefs", "Semrush", "Google Search Console", "Manual", "Moz", "SE Ranking"] },
      { key: "lastRefreshed", label: "Last Refreshed", type: "date" },
    ],
  },
  {
    id: "serp-analysis",
    label: "SERP Analysis",
    icon: "Eye",
    description: "Analyze search engine results pages for ranking opportunities",
    apiEndpoint: "/api/serp-analysis",
    fields: [
      { key: "keyword", label: "Keyword", type: "text", required: true, showInTable: true, tableWidth: "w-40" },
      { key: "rank", label: "Rank", type: "number", showInTable: true, tableWidth: "w-20" },
      { key: "rankingUrlDomain", label: "Ranking URL/Domain", type: "text", placeholder: "e.g. example.com/page", showInTable: true, tableWidth: "w-44" },
      { key: "contentType", label: "Content Type", type: "select", options: ["Blog", "Product Page", "Landing Page", "Documentation", "Case Study", "Comparison", "Guide", "Listicle", "Directory", "Service Page", "Forum", "Video"], showInTable: true, tableWidth: "w-28" },
      { key: "wordCount", label: "Word Count", type: "number", showInTable: true, tableWidth: "w-24" },
      { key: "estDa", label: "Est. DA", type: "number", showInTable: true, tableWidth: "w-20" },
      { key: "featuredSnippet", label: "Featured Snippet", type: "boolean", showInTable: true, tableWidth: "w-28" },
      { key: "missingSubtopics", label: "Missing Subtopics", type: "text", placeholder: "e.g. pricing, integrations" },
      { key: "formatOpportunity", label: "Format Opportunity", type: "select", options: ["Video", "Infographic", "FAQ", "How-To", "Listicle", "Comparison", "Interactive", "None"], showInTable: true, tableWidth: "w-28" },
      { key: "ourRank", label: "Our Rank", type: "number", showInTable: true, tableWidth: "w-24" },
      { key: "action", label: "Action", type: "select", options: ["Create Content", "Update Content", "Optimize Existing", "Build Backlinks", "Add Schema", "Add FAQ", "No Action", "Monitor"], showInTable: true, tableWidth: "w-32" },
      { key: "lastChecked", label: "Last Checked", type: "date", showInTable: true, tableWidth: "w-28" },
    ],
  },
  {
    id: "ai-audit",
    label: "AI Search Audit",
    icon: "Brain",
    description: "Track brand visibility and mentions across AI platforms",
    apiEndpoint: "/api/ai-audit",
    fields: [
      { key: "query", label: "Query", type: "text", required: true, showInTable: true, tableWidth: "w-44" },
      { key: "aiPlatform", label: "AI Platform", type: "select", required: true, options: ["ChatGPT", "Gemini", "Perplexity", "AI Overview", "Claude", "Copilot"], showInTable: true, tableWidth: "w-28" },
      { key: "brandMentioned", label: "Brand Mentioned", type: "boolean", showInTable: true, tableWidth: "w-32" },
      { key: "position", label: "Position", type: "number", showInTable: true, tableWidth: "w-24" },
      { key: "citedUrl", label: "Cited URL", type: "text", placeholder: "https://..." },
      { key: "competitorMentioned", label: "Competitor Mentioned", type: "text", placeholder: "e.g. Competitor A, B" },
      { key: "sentiment", label: "Sentiment", type: "select", options: ["Positive", "Neutral", "Negative", "Mixed", "Not Mentioned"], showInTable: true, tableWidth: "w-28" },
      { key: "answerSummary", label: "Answer Summary", type: "textarea", placeholder: "What the AI responded..." },
      { key: "gap", label: "Gap", type: "text", placeholder: "What's missing from the AI response" },
      { key: "fix", label: "Fix", type: "text", placeholder: "Recommended action to fix the gap" },
      { key: "owner", label: "Owner", type: "text", placeholder: "e.g. John Doe" },
      { key: "lastChecked", label: "Last Checked", type: "date", showInTable: true, tableWidth: "w-28" },
    ],
  },
  {
    id: "content-pipeline",
    label: "Content Pipeline",
    icon: "FileText",
    description: "Manage content creation workflow from idea to publication",
    apiEndpoint: "/api/content-pipeline",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, showInTable: true, tableWidth: "w-44" },
      { key: "cluster", label: "Cluster", type: "text", placeholder: "e.g. QA Automation", showInTable: true, tableWidth: "w-28" },
      { key: "targetKeyword", label: "Target Keyword", type: "text", placeholder: "e.g. best qa tools" },
      { key: "contentType", label: "Content Type", type: "select", options: ["Blog Post", "Guide", "Case Study", "Comparison", "Landing Page", "Product Page", "Documentation", "Whitepaper", "Infographic", "Video", "Webinar", "Newsletter", "Social Post"], showInTable: true, tableWidth: "w-28" },
      { key: "writer", label: "Writer", type: "text", placeholder: "e.g. Jane Smith", showInTable: true, tableWidth: "w-28" },
      { key: "status", label: "Status", type: "select", options: ["Idea", "Assigned", "In Progress", "In Review", "Approved", "Published", "Paused", "Cancelled"], showInTable: true, tableWidth: "w-28" },
      { key: "priority", label: "Priority", type: "select", options: ["Critical", "High", "Medium", "Low"], showInTable: true, tableWidth: "w-24" },
      { key: "duePublishDate", label: "Due/Publish Date", type: "date", showInTable: true, tableWidth: "w-28" },
      { key: "wordCountTarget", label: "Word Count Target", type: "number", showInTable: true, tableWidth: "w-28" },
      { key: "seoChecklist", label: "SEO Checklist", type: "text", placeholder: "e.g. H1, meta, internal links" },
      { key: "liveUrl", label: "Live URL", type: "text", placeholder: "https://..." },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Additional notes..." },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    icon: "BarChart3",
    description: "Track page rankings, clicks, impressions, and conversions",
    apiEndpoint: "/api/performance",
    fields: [
      { key: "page", label: "Page", type: "text", required: true, showInTable: true, tableWidth: "w-40" },
      { key: "keyword", label: "Keyword", type: "text", placeholder: "e.g. qa automation", showInTable: true, tableWidth: "w-36" },
      { key: "rank", label: "Rank", type: "number", showInTable: true, tableWidth: "w-20" },
      { key: "rankChange", label: "Rank Change", type: "number", showInTable: true, tableWidth: "w-28" },
      { key: "impressions", label: "Impressions", type: "number", showInTable: true, tableWidth: "w-28" },
      { key: "clicks", label: "Clicks", type: "number", showInTable: true, tableWidth: "w-24" },
      { key: "ctr", label: "CTR", type: "number", showInTable: true, tableWidth: "w-20" },
      { key: "timeOnPage", label: "Time on Page", type: "number" },
      { key: "leads", label: "Leads", type: "number", showInTable: true, tableWidth: "w-20" },
      { key: "conversions", label: "Conversions", type: "number", showInTable: true, tableWidth: "w-28" },
      { key: "conversionRate", label: "Conversion Rate", type: "number" },
      { key: "trafficSource", label: "Traffic Source", type: "select", options: ["Organic", "Paid", "Direct", "Social", "Referral", "Email"], showInTable: true, tableWidth: "w-24" },
      { key: "weekOf", label: "Week Of", type: "date", required: true, showInTable: true, tableWidth: "w-28" },
    ],
  },
  {
    id: "content-gap",
    label: "Content Gap Tracker",
    icon: "Target",
    description: "Identify and track missing content opportunities vs competitors",
    apiEndpoint: "/api/content-gap",
    fields: [
      { key: "cluster", label: "Cluster", type: "text", required: true, showInTable: true, tableWidth: "w-32" },
      { key: "missingSubtopic", label: "Missing Subtopic", type: "text", required: true, showInTable: true, tableWidth: "w-44" },
      { key: "serviceLineSupported", label: "Service Line Supported", type: "boolean", showInTable: true, tableWidth: "w-36" },
      { key: "competitorCoverage", label: "Competitor Coverage", type: "boolean", showInTable: true, tableWidth: "w-36" },
      { key: "demand", label: "Demand", type: "select", options: ["Very High", "High", "Medium", "Low", "Very Low"], showInTable: true, tableWidth: "w-24" },
      { key: "priority", label: "Priority", type: "select", options: ["Critical", "High", "Medium", "Low"], showInTable: true, tableWidth: "w-24" },
      { key: "suggestedType", label: "Suggested Type", type: "select", options: ["Blog Post", "Guide", "Case Study", "Comparison", "Landing Page", "FAQ", "Video", "Infographic", "Whitepaper"], showInTable: true, tableWidth: "w-28" },
      { key: "ownerTeam", label: "Owner/Team", type: "text", placeholder: "e.g. Content Team" },
      { key: "assigned", label: "Assigned", type: "text", placeholder: "e.g. Jane Smith" },
      { key: "status", label: "Status", type: "select", options: ["Not Started", "Assigned", "In Progress", "Published", "On Hold", "Cancelled"], showInTable: true, tableWidth: "w-28" },
      { key: "targetQuarter", label: "Target Quarter", type: "select", options: ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026"], showInTable: true, tableWidth: "w-24" },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Additional notes..." },
    ],
  },
];

export function getModuleConfig(id: string): ModuleConfig | undefined {
  return modules.find((m) => m.id === id);
}