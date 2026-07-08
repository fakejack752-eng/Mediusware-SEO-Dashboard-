import { NextResponse } from "next/server";

// ── Mock Data for Mediusware SEO Intelligence Dashboard ──

const marketTrends = [
  { month: "Jan", softwareDevelopment: 72, itConsulting: 58, digitalTransformation: 45, customSoftware: 38, nearshore: 28 },
  { month: "Feb", softwareDevelopment: 68, itConsulting: 62, digitalTransformation: 48, customSoftware: 42, nearshore: 31 },
  { month: "Mar", softwareDevelopment: 78, itConsulting: 65, digitalTransformation: 52, customSoftware: 45, nearshore: 35 },
  { month: "Apr", softwareDevelopment: 82, itConsulting: 61, digitalTransformation: 56, customSoftware: 48, nearshore: 33 },
  { month: "May", softwareDevelopment: 85, itConsulting: 70, digitalTransformation: 60, customSoftware: 52, nearshore: 40 },
  { month: "Jun", softwareDevelopment: 79, itConsulting: 73, digitalTransformation: 63, customSoftware: 55, nearshore: 42 },
  { month: "Jul", softwareDevelopment: 88, itConsulting: 68, digitalTransformation: 58, customSoftware: 50, nearshore: 38 },
  { month: "Aug", softwareDevelopment: 92, itConsulting: 75, digitalTransformation: 65, customSoftware: 58, nearshore: 45 },
  { month: "Sep", softwareDevelopment: 86, itConsulting: 78, digitalTransformation: 70, customSoftware: 62, nearshore: 48 },
  { month: "Oct", softwareDevelopment: 90, itConsulting: 80, digitalTransformation: 72, customSoftware: 65, nearshore: 52 },
  { month: "Nov", softwareDevelopment: 94, itConsulting: 82, digitalTransformation: 75, customSoftware: 68, nearshore: 55 },
  { month: "Dec", softwareDevelopment: 91, itConsulting: 85, digitalTransformation: 78, customSoftware: 70, nearshore: 58 },
];

const socialMentions = [
  { platform: "Reddit", mentions: 342, sentiment: 72, topSub: "r/webdev", change: 18 },
  { platform: "LinkedIn", mentions: 1205, sentiment: 85, topSub: "IT Services", change: 32 },
  { platform: "Twitter/X", mentions: 890, sentiment: 68, topSub: "TechStartup", change: 12 },
  { platform: "HackerNews", mentions: 156, sentiment: 78, topSub: "Show HN", change: -5 },
  { platform: "ProductHunt", mentions: 89, sentiment: 82, topSub: "SaaS", change: 45 },
  { platform: "G2/Capterra", mentions: 234, sentiment: 88, topSub: "Reviews", change: 22 },
];

const industryReports = [
  { title: "Global IT Services Market Report 2025", source: "Gartner", date: "2025-01-15", relevance: 95, summary: "IT services market projected to grow 8.2% CAGR through 2028. Custom software development segment leading growth." },
  { title: "Nearshore Development Trends", source: "Forrester", date: "2025-02-20", relevance: 88, summary: "Nearshore outsourcing demand increased 34% YoY. Bangladesh emerging as key destination." },
  { title: "Digital Transformation Adoption Rates", source: "McKinsey", date: "2025-03-10", relevance: 82, summary: "72% of enterprises accelerating digital transformation budgets. API integration services in high demand." },
  { title: "B2B SaaS SEO Benchmarks Q1 2025", source: "Semrush", date: "2025-03-25", relevance: 91, summary: "Average organic traffic growth for B2B SaaS: 15.3%. Top performers achieving 45%+ through content clusters." },
  { title: "AI-Powered Development Tools Market", source: "IDC", date: "2025-04-05", relevance: 78, summary: "AI-assisted development market reaches $4.2B. Companies investing in AI-powered service offerings." },
];

const competitors = [
  { name: "BrainStation-IT", domain: "brainstation-it.com", authority: 62, organicTraffic: 18500, backlinks: 12400, keywords: 2340, contentPieces: 156, monthlyGrowth: 4.2 },
  { name: "DataSoft", domain: "datasoft-bd.com", authority: 58, organicTraffic: 15200, backlinks: 9800, keywords: 1890, contentPieces: 132, monthlyGrowth: 3.8 },
  { name: "TherapServices", domain: "therapservices.net", authority: 55, organicTraffic: 12800, backlinks: 8200, keywords: 1560, contentPieces: 98, monthlyGrowth: 2.1 },
  { name: "Kaz Software", domain: "kaz.com.bd", authority: 51, organicTraffic: 9400, backlinks: 6500, keywords: 1120, contentPieces: 87, monthlyGrowth: 5.6 },
  { name: "Cefalo Bangladesh", domain: "cefalo.com", authority: 48, organicTraffic: 7800, backlinks: 5200, keywords: 890, contentPieces: 65, monthlyGrowth: 3.2 },
  { name: "Mediusware (You)", domain: "mediusware.com", authority: 45, organicTraffic: 6200, backlinks: 3800, keywords: 720, contentPieces: 52, monthlyGrowth: 8.4 },
];

const competitorBlogs = [
  { competitor: "BrainStation-IT", title: "Complete Guide to Custom ERP Development", publishedDate: "2025-03-15", shares: 342, backlinks: 28, wordCount: 4500, rankingKeywords: 18 },
  { competitor: "DataSoft", title: "Digital Transformation Roadmap for SMEs", publishedDate: "2025-03-10", shares: 256, backlinks: 22, wordCount: 3800, rankingKeywords: 15 },
  { competitor: "TherapServices", title: "Healthcare Software Development Best Practices", publishedDate: "2025-03-05", shares: 198, backlinks: 35, wordCount: 5200, rankingKeywords: 22 },
  { competitor: "Kaz Software", title: "Nearshore vs Offshore Development: 2025 Comparison", publishedDate: "2025-02-28", shares: 445, backlinks: 42, wordCount: 6000, rankingKeywords: 28 },
  { competitor: "Cefalo", title: "FinTech App Development: A Complete Guide", publishedDate: "2025-02-20", shares: 167, backlinks: 18, wordCount: 3200, rankingKeywords: 12 },
  { competitor: "BrainStation-IT", title: "React Native vs Flutter: Performance Benchmark", publishedDate: "2025-02-15", shares: 512, backlinks: 55, wordCount: 5500, rankingKeywords: 32 },
  { competitor: "DataSoft", title: "Cloud Migration Strategy for Enterprises", publishedDate: "2025-02-10", shares: 289, backlinks: 31, wordCount: 4200, rankingKeywords: 20 },
  { competitor: "Kaz Software", title: "API Development Best Practices 2025", publishedDate: "2025-02-05", shares: 378, backlinks: 39, wordCount: 4800, rankingKeywords: 25 },
];

const competitorKeywords = [
  { keyword: "custom software development", competitor: "BrainStation-IT", position: 3, volume: 8100, kd: 72 },
  { keyword: "software development company bangladesh", competitor: "DataSoft", position: 2, volume: 3200, kd: 45 },
  { keyword: "erp development services", competitor: "TherapServices", position: 4, volume: 4400, kd: 65 },
  { keyword: "nearshore development", competitor: "Kaz Software", position: 5, volume: 5600, kd: 58 },
  { keyword: "fintech app development", competitor: "Cefalo", position: 6, volume: 3800, kd: 62 },
  { keyword: "digital transformation consulting", competitor: "BrainStation-IT", position: 3, volume: 6200, kd: 70 },
  { keyword: "cloud migration services", competitor: "DataSoft", position: 5, volume: 4800, kd: 68 },
  { keyword: "healthcare software development", competitor: "TherapServices", position: 2, volume: 3900, kd: 55 },
  { keyword: "api integration services", competitor: "Kaz Software", position: 7, volume: 4200, kd: 60 },
  { keyword: "saas development company", competitor: "BrainStation-IT", position: 4, volume: 5100, kd: 64 },
  { keyword: "ecommerce development services", competitor: "DataSoft", position: 6, volume: 7200, kd: 71 },
  { keyword: "mobile app development bangladesh", competitor: "Kaz Software", position: 3, volume: 2800, kd: 42 },
];

const keywords = [
  { keyword: "custom software development", volume: 8100, kd: 72, cpc: 12.50, intent: "Commercial", currentRank: 28, bestRank: 15, priority: 95, trend: "up" },
  { keyword: "software development company", volume: 14800, kd: 85, cpc: 18.30, intent: "Commercial", currentRank: 42, bestRank: 22, priority: 92, trend: "up" },
  { keyword: "erp development services", volume: 4400, kd: 65, cpc: 15.20, intent: "Transactional", currentRank: 18, bestRank: 8, priority: 88, trend: "up" },
  { keyword: "nearshore software development", volume: 5600, kd: 58, cpc: 9.80, intent: "Commercial", currentRank: 35, bestRank: 20, priority: 85, trend: "stable" },
  { keyword: "digital transformation consulting", volume: 6200, kd: 70, cpc: 22.40, intent: "Commercial", currentRank: 45, bestRank: 30, priority: 82, trend: "up" },
  { keyword: "api integration services", volume: 4200, kd: 60, cpc: 11.60, intent: "Transactional", currentRank: 22, bestRank: 12, priority: 80, trend: "up" },
  { keyword: "fintech app development", volume: 3800, kd: 62, cpc: 16.80, intent: "Commercial", currentRank: 38, bestRank: 25, priority: 78, trend: "stable" },
  { keyword: "healthcare software solutions", volume: 3900, kd: 55, cpc: 19.20, intent: "Commercial", currentRank: 15, bestRank: 8, priority: 76, trend: "up" },
  { keyword: "cloud migration services", volume: 4800, kd: 68, cpc: 24.50, intent: "Transactional", currentRank: 52, bestRank: 35, priority: 74, trend: "down" },
  { keyword: "saas development company", volume: 5100, kd: 64, cpc: 14.30, intent: "Commercial", currentRank: 30, bestRank: 18, priority: 72, trend: "up" },
  { keyword: "ecommerce development services", volume: 7200, kd: 71, cpc: 13.80, intent: "Transactional", currentRank: 48, bestRank: 28, priority: 70, trend: "stable" },
  { keyword: "mobile app development company", volume: 12100, kd: 82, cpc: 10.90, intent: "Commercial", currentRank: 55, bestRank: 38, priority: 68, trend: "up" },
  { keyword: "web application development", volume: 9500, kd: 78, cpc: 15.60, intent: "Informational", currentRank: 32, bestRank: 15, priority: 65, trend: "up" },
  { keyword: "software outsourcing bangladesh", volume: 2200, kd: 38, cpc: 8.40, intent: "Commercial", currentRank: 8, bestRank: 3, priority: 90, trend: "up" },
  { keyword: "it consulting services", volume: 6800, kd: 75, cpc: 20.10, intent: "Commercial", currentRank: 40, bestRank: 22, priority: 67, trend: "stable" },
  { keyword: "react native development", volume: 14400, kd: 80, cpc: 8.20, intent: "Informational", currentRank: 60, bestRank: 42, priority: 55, trend: "down" },
  { keyword: "flutter app development", volume: 12100, kd: 76, cpc: 9.10, intent: "Informational", currentRank: 58, bestRank: 40, priority: 53, trend: "down" },
  { keyword: "devops consulting services", volume: 3100, kd: 52, cpc: 17.80, intent: "Transactional", currentRank: 25, bestRank: 10, priority: 75, trend: "up" },
  { keyword: "ui ux design services", volume: 8200, kd: 69, cpc: 7.50, intent: "Commercial", currentRank: 42, bestRank: 28, priority: 62, trend: "stable" },
  { keyword: "custom crm development", volume: 3600, kd: 48, cpc: 13.20, intent: "Transactional", currentRank: 12, bestRank: 5, priority: 87, trend: "up" },
  { keyword: "microsoft power platform development", volume: 1800, kd: 35, cpc: 21.50, intent: "Transactional", currentRank: 5, bestRank: 2, priority: 93, trend: "up" },
  { keyword: "power bi development services", volume: 2400, kd: 32, cpc: 18.90, intent: "Transactional", currentRank: 3, bestRank: 1, priority: 96, trend: "up" },
  { keyword: "azure development services", volume: 2900, kd: 55, cpc: 16.40, intent: "Commercial", currentRank: 18, bestRank: 8, priority: 81, trend: "up" },
  { keyword: "sharepoint development services", volume: 1600, kd: 28, cpc: 15.80, intent: "Transactional", currentRank: 4, bestRank: 1, priority: 94, trend: "up" },
  { keyword: ".net development company", volume: 4200, kd: 58, cpc: 11.20, intent: "Commercial", currentRank: 20, bestRank: 10, priority: 77, trend: "up" },
];

const serpResults = [
  { keyword: "custom software development", position: 1, url: "www.accelerance.com/guide", title: "Custom Software Development Guide 2025", type: "Listicle", wordCount: 8500, backlinks: 340, featured: true, peoplesAlso: true },
  { keyword: "custom software development", position: 2, url: "www.saasworthy.com/custom-sw", title: "How to Choose a Custom Software Dev Partner", type: "Comparison", wordCount: 6200, backlinks: 280, featured: false, peoplesAlso: true },
  { keyword: "custom software development", position: 3, url: "www.brainstation-it.com/services", title: "Custom Software Development Services", type: "Service Page", wordCount: 3200, backlinks: 195, featured: false, peoplesAlso: false },
  { keyword: "custom software development", position: 4, url: "www.toptal.com/software-dev", title: "Top Custom Software Developers", type: "Directory", wordCount: 5800, backlinks: 420, featured: true, peoplesAlso: true },
  { keyword: "custom software development", position: 5, url: "www.datasoft-bd.com/custom-dev", title: "Enterprise Software Development Solutions", type: "Service Page", wordCount: 2800, backlinks: 145, featured: false, peoplesAlso: false },
  { keyword: "erp development services", position: 1, url: "www.netguru.com/erp-dev", title: "ERP Development Services - Complete Guide", type: "Service Page", wordCount: 7200, backlinks: 310, featured: true, peoplesAlso: true },
  { keyword: "erp development services", position: 2, url: "www.therapservices.net/erp", title: "Custom ERP Development for Healthcare", type: "Service Page", wordCount: 4500, backlinks: 220, featured: false, peoplesAlso: true },
  { keyword: "erp development services", position: 3, url: "www.scnsoft.com/erp", title: "Enterprise Resource Planning Development", type: "Service Page", wordCount: 5800, backlinks: 265, featured: false, peoplesAlso: false },
  { keyword: "erp development services", position: 4, url: "www.intellectsoft.net/erp", title: "Custom ERP Software Development", type: "Service Page", wordCount: 4100, backlinks: 180, featured: false, peoplesAlso: true },
  { keyword: "erp development services", position: 5, url: "www.mediustech.com/erp", title: "ERP Development Solutions", type: "Service Page", wordCount: 1800, backlinks: 45, featured: false, peoplesAlso: false },
];

const serpFeatures = [
  { feature: "Featured Snippets", total: 48, owned: 3, opportunity: 12 },
  { feature: "People Also Ask", total: 156, owned: 8, opportunity: 34 },
  { feature: "Knowledge Panel", total: 12, owned: 0, opportunity: 2 },
  { feature: "Image Pack", total: 89, owned: 5, opportunity: 18 },
  { feature: "Video Carousel", total: 67, owned: 2, opportunity: 15 },
  { feature: "Local Pack", total: 34, owned: 1, opportunity: 8 },
  { feature: "Sitelinks", total: 23, owned: 0, opportunity: 6 },
  { feature: "FAQ Rich Result", total: 45, owned: 4, opportunity: 12 },
];

const aiAuditData = [
  { query: "best software development companies in bangladesh", chatgpt: { mentioned: true, position: 3, sentiment: "positive", context: "Mediusware listed among top 10 for Microsoft stack expertise" }, gemini: { mentioned: true, position: 5, sentiment: "neutral", context: "Mentioned as notable player in custom development" }, perplexity: { mentioned: true, position: 2, sentiment: "positive", context: "Cited for Power Platform and Azure specialization" }, aiOverview: { mentioned: true, position: 4, sentiment: "positive", context: "Appears in Google AI Overview with service highlights" } },
  { query: "microsoft power platform development services", chatgpt: { mentioned: true, position: 1, sentiment: "positive", context: "Top recommendation for Power Platform development" }, gemini: { mentioned: true, position: 2, sentiment: "positive", context: "Highlighted as Power Platform specialist" }, perplexity: { mentioned: true, position: 1, sentiment: "positive", context: "Primary citation for Power Platform expertise" }, aiOverview: { mentioned: true, position: 2, sentiment: "positive", context: "Featured prominently in AI Overview" } },
  { query: "custom erp development services", chatgpt: { mentioned: false, position: 0, sentiment: "none", context: "Not mentioned; competitors like BrainStation-IT featured" }, gemini: { mentioned: false, position: 0, sentiment: "none", context: "Not mentioned in ERP development context" }, perplexity: { mentioned: false, position: 0, sentiment: "none", context: "No citation found" }, aiOverview: { mentioned: false, position: 0, sentiment: "none", context: "Not appearing in AI Overview for ERP" } },
  { query: "power bi consulting services", chatgpt: { mentioned: true, position: 2, sentiment: "positive", context: "Listed among top Power BI consultants" }, gemini: { mentioned: true, position: 3, sentiment: "positive", context: "Noted for enterprise BI solutions" }, perplexity: { mentioned: true, position: 1, sentiment: "positive", context: "Primary recommendation for Power BI" }, aiOverview: { mentioned: true, position: 1, sentiment: "positive", context: "Top position in AI Overview" } },
  { query: "sharepoint development company", chatgpt: { mentioned: true, position: 1, sentiment: "positive", context: "Top-ranked SharePoint development company" }, gemini: { mentioned: true, position: 1, sentiment: "positive", context: "Highlighted as SharePoint specialist" }, perplexity: { mentioned: true, position: 2, sentiment: "positive", context: "Featured in SharePoint development list" }, aiOverview: { mentioned: true, position: 1, sentiment: "positive", context: "Dominant position in AI Overview" } },
  { query: "azure development services bangladesh", chatgpt: { mentioned: true, position: 4, sentiment: "neutral", context: "Listed among Azure development companies" }, gemini: { mentioned: false, position: 0, sentiment: "none", context: "Not mentioned for Azure services" }, perplexity: { mentioned: true, position: 3, sentiment: "positive", context: "Mentioned with Azure specialization details" }, aiOverview: { mentioned: false, position: 0, sentiment: "none", context: "Not appearing in AI Overview" } },
  { query: "custom crm development services", chatgpt: { mentioned: false, position: 0, sentiment: "none", context: "Not mentioned in CRM development context" }, gemini: { mentioned: false, position: 0, sentiment: "none", context: "Not mentioned" }, perplexity: { mentioned: true, position: 5, sentiment: "neutral", context: "Brief mention in CRM development list" }, aiOverview: { mentioned: false, position: 0, sentiment: "none", context: "Not appearing" } },
  { query: "nearshore software development", chatgpt: { mentioned: false, position: 0, sentiment: "none", context: "Not included in nearshore discussions" }, gemini: { mentioned: false, position: 0, sentiment: "none", context: "Not mentioned" }, perplexity: { mentioned: false, position: 0, sentiment: "none", context: "Not cited" }, aiOverview: { mentioned: false, position: 0, sentiment: "none", context: "Not appearing" } },
];

const aiSummaryStats = {
  totalQueries: 50,
  mentionedIn: 32,
  mentionRate: 64,
  top3Positions: 18,
  positiveSentiment: 24,
  neutralSentiment: 8,
  negativeSentiment: 0,
  chatgptMentionRate: 68,
  geminiMentionRate: 56,
  perplexityMentionRate: 72,
  aiOverviewMentionRate: 48,
  monthOverMonthChange: 12.5,
};

const contentPipeline = [
  { id: 1, topic: "Complete Guide to Power Platform Development", cluster: "Microsoft Stack", writer: "Sarah K.", status: "Published", priority: "High", publishDate: "2025-03-15", wordCount: 5200, targetKeywords: 8, rankingKeywords: 5, organicTraffic: 340 },
  { id: 2, topic: "SharePoint Development Best Practices 2025", cluster: "Microsoft Stack", writer: "Ahmed R.", status: "Published", priority: "High", publishDate: "2025-03-10", wordCount: 4800, targetKeywords: 6, rankingKeywords: 4, organicTraffic: 280 },
  { id: 3, topic: "Power BI Dashboard Development Guide", cluster: "Microsoft Stack", writer: "Sarah K.", status: "Published", priority: "High", publishDate: "2025-03-05", wordCount: 5500, targetKeywords: 10, rankingKeywords: 7, organicTraffic: 520 },
  { id: 4, topic: "Custom CRM Development: Everything You Need", cluster: "Enterprise Software", writer: "Mike T.", status: "In Review", priority: "High", publishDate: null, wordCount: 4500, targetKeywords: 7, rankingKeywords: 0, organicTraffic: 0 },
  { id: 5, topic: "Azure Cloud Migration Strategy for SMBs", cluster: "Cloud Services", writer: "Lisa M.", status: "In Progress", priority: "Medium", publishDate: null, wordCount: 2800, targetKeywords: 6, rankingKeywords: 0, organicTraffic: 0 },
  { id: 6, topic: "ERP Development Cost Guide 2025", cluster: "Enterprise Software", writer: "Mike T.", status: "In Progress", priority: "High", publishDate: null, wordCount: 1800, targetKeywords: 5, rankingKeywords: 0, organicTraffic: 0 },
  { id: 7, topic: "Nearshore Development vs Offshore: Complete Comparison", cluster: "Outsourcing", writer: "Ahmed R.", status: "Assigned", priority: "Medium", publishDate: null, wordCount: 0, targetKeywords: 8, rankingKeywords: 0, organicTraffic: 0 },
  { id: 8, topic: "Fintech App Development: A Step-by-Step Guide", cluster: "Industry Solutions", writer: "Sarah K.", status: "Assigned", priority: "Medium", publishDate: null, wordCount: 0, targetKeywords: 6, rankingKeywords: 0, organicTraffic: 0 },
  { id: 9, topic: "Healthcare Software Compliance Guide (HIPAA)", cluster: "Industry Solutions", writer: "Lisa M.", status: "Drafting", priority: "High", publishDate: null, wordCount: 1200, targetKeywords: 9, rankingKeywords: 0, organicTraffic: 0 },
  { id: 10, topic: "DevOps Consulting: CI/CD Pipeline Setup", cluster: "Cloud Services", writer: "Mike T.", status: "Approved", priority: "Low", publishDate: null, wordCount: 0, targetKeywords: 5, rankingKeywords: 0, organicTraffic: 0 },
  { id: 11, topic: "React vs Angular vs Vue: 2025 Framework Comparison", cluster: "Technology", writer: "Ahmed R.", status: "Approved", priority: "Low", publishDate: null, wordCount: 0, targetKeywords: 7, rankingKeywords: 0, organicTraffic: 0 },
  { id: 12, topic: "E-commerce Platform Development Guide", cluster: "Industry Solutions", writer: "Sarah K.", status: "Idea", priority: "Medium", publishDate: null, wordCount: 0, targetKeywords: 8, rankingKeywords: 0, organicTraffic: 0 },
];

const performanceData = {
  organicTraffic: [
    { month: "Jan", visitors: 3200, sessions: 4100, pageViews: 12400 },
    { month: "Feb", visitors: 3600, sessions: 4600, pageViews: 14200 },
    { month: "Mar", visitors: 4100, sessions: 5300, pageViews: 16800 },
    { month: "Apr", visitors: 4500, sessions: 5800, pageViews: 18500 },
    { month: "May", visitors: 4900, sessions: 6200, pageViews: 20100 },
    { month: "Jun", visitors: 5200, sessions: 6800, pageViews: 22400 },
    { month: "Jul", visitors: 5600, sessions: 7200, pageViews: 24200 },
    { month: "Aug", visitors: 5900, sessions: 7600, pageViews: 25800 },
    { month: "Sep", visitors: 6200, sessions: 8100, pageViews: 27500 },
    { month: "Oct", visitors: 6500, sessions: 8400, pageViews: 29100 },
    { month: "Nov", visitors: 6800, sessions: 8900, pageViews: 30800 },
    { month: "Dec", visitors: 7200, sessions: 9400, pageViews: 32500 },
  ],
  rankings: [
    { month: "Jan", top3: 12, top10: 35, top20: 68, top50: 145 },
    { month: "Feb", top3: 14, top10: 38, top20: 72, top50: 158 },
    { month: "Mar", top3: 16, top10: 42, top20: 78, top50: 172 },
    { month: "Apr", top3: 18, top10: 48, top20: 85, top50: 190 },
    { month: "May", top3: 20, top10: 52, top20: 92, top50: 205 },
    { month: "Jun", top3: 22, top10: 56, top20: 98, top50: 218 },
    { month: "Jul", top3: 24, top10: 60, top20: 105, top50: 230 },
    { month: "Aug", top3: 25, top10: 64, top20: 112, top50: 245 },
    { month: "Sep", top3: 27, top10: 68, top20: 118, top50: 258 },
    { month: "Oct", top3: 29, top10: 72, top20: 125, top50: 270 },
    { month: "Nov", top3: 31, top10: 76, top20: 130, top50: 282 },
    { month: "Dec", top3: 33, top10: 80, top20: 138, top50: 295 },
  ],
  ctr: [
    { month: "Jan", position1to3: 32.5, position4to10: 8.2, position11to20: 3.1, position21to50: 0.8 },
    { month: "Feb", position1to3: 33.1, position4to10: 8.5, position11to20: 3.3, position21to50: 0.9 },
    { month: "Mar", position1to3: 34.2, position4to10: 8.8, position11to20: 3.5, position21to50: 0.9 },
    { month: "Apr", position1to3: 35.0, position4to10: 9.1, position11to20: 3.6, position21to50: 1.0 },
    { month: "May", position1to3: 35.8, position4to10: 9.4, position11to20: 3.8, position21to50: 1.0 },
    { month: "Jun", position1to3: 36.2, position4to10: 9.6, position11to20: 3.9, position21to50: 1.1 },
    { month: "Jul", position1to3: 36.8, position4to10: 9.9, position11to20: 4.0, position21to50: 1.1 },
    { month: "Aug", position1to3: 37.2, position4to10: 10.1, position11to20: 4.1, position21to50: 1.2 },
    { month: "Sep", position1to3: 37.8, position4to10: 10.4, position11to20: 4.2, position21to50: 1.2 },
    { month: "Oct", position1to3: 38.5, position4to10: 10.7, position11to20: 4.3, position21to50: 1.3 },
    { month: "Nov", position1to3: 39.0, position4to10: 10.9, position11to20: 4.5, position21to50: 1.3 },
    { month: "Dec", position1to3: 39.5, position4to10: 11.2, position11to20: 4.6, position21to50: 1.4 },
  ],
  conversions: [
    { month: "Jan", leads: 28, formSubmissions: 42, demoRequests: 8, mqls: 18, sqls: 6 },
    { month: "Feb", leads: 32, formSubmissions: 48, demoRequests: 10, mqls: 22, sqls: 8 },
    { month: "Mar", leads: 38, formSubmissions: 55, demoRequests: 12, mqls: 25, sqls: 9 },
    { month: "Apr", leads: 42, formSubmissions: 62, demoRequests: 14, mqls: 28, sqls: 10 },
    { month: "May", leads: 48, formSubmissions: 70, demoRequests: 16, mqls: 32, sqls: 12 },
    { month: "Jun", leads: 52, formSubmissions: 76, demoRequests: 18, mqls: 35, sqls: 13 },
    { month: "Jul", leads: 56, formSubmissions: 82, demoRequests: 20, mqls: 38, sqls: 14 },
    { month: "Aug", leads: 60, formSubmissions: 88, demoRequests: 22, mqls: 41, sqls: 15 },
    { month: "Sep", leads: 65, formSubmissions: 95, demoRequests: 24, mqls: 44, sqls: 17 },
    { month: "Oct", leads: 70, formSubmissions: 102, demoRequests: 26, mqls: 48, sqls: 18 },
    { month: "Nov", leads: 74, formSubmissions: 108, demoRequests: 28, mqls: 51, sqls: 20 },
    { month: "Dec", leads: 80, formSubmissions: 116, demoRequests: 32, mqls: 55, sqls: 22 },
  ],
  kpis: {
    totalOrganicTraffic: 7200,
    trafficGrowth: 18.5,
    avgPosition: 24.3,
    positionChange: -5.2,
    totalKeywords: 720,
    keywordGrowth: 12.8,
    totalBacklinks: 3800,
    backlinkGrowth: 8.4,
    domainAuthority: 45,
    authorityChange: 3,
    totalLeads: 80,
    leadGrowth: 22.5,
    conversionRate: 1.11,
    conversionChange: 0.15,
    organicRevenue: 128000,
    revenueGrowth: 28.3,
  },
};

const contentGaps = [
  { cluster: "Microsoft Stack", topic: "Dynamics 365 Development", volume: 3200, kd: 42, competitorCoverage: 5, yourCoverage: 0, gapScore: 95, estimatedImpact: "High" },
  { cluster: "Microsoft Stack", topic: "Microsoft Teams App Development", volume: 2800, kd: 38, competitorCoverage: 4, yourCoverage: 0, gapScore: 92, estimatedImpact: "High" },
  { cluster: "Enterprise Software", topic: "Custom ERP Development", volume: 4400, kd: 65, competitorCoverage: 6, yourCoverage: 1, gapScore: 88, estimatedImpact: "High" },
  { cluster: "Cloud Services", topic: "AWS Development Services", volume: 5100, kd: 58, competitorCoverage: 5, yourCoverage: 0, gapScore: 85, estimatedImpact: "High" },
  { cluster: "Industry Solutions", topic: "Healthcare Software Development", volume: 3900, kd: 55, competitorCoverage: 4, yourCoverage: 0, gapScore: 82, estimatedImpact: "High" },
  { cluster: "Outsourcing", topic: "Nearshore Development Guide", volume: 5600, kd: 58, competitorCoverage: 3, yourCoverage: 0, gapScore: 80, estimatedImpact: "Medium" },
  { cluster: "Technology", topic: "AI/ML Development Services", volume: 8200, kd: 72, competitorCoverage: 5, yourCoverage: 0, gapScore: 78, estimatedImpact: "High" },
  { cluster: "Industry Solutions", topic: "FinTech App Development", volume: 3800, kd: 62, competitorCoverage: 4, yourCoverage: 0, gapScore: 76, estimatedImpact: "Medium" },
  { cluster: "Cloud Services", topic: "Google Cloud Platform Services", volume: 3600, kd: 52, competitorCoverage: 3, yourCoverage: 0, gapScore: 72, estimatedImpact: "Medium" },
  { cluster: "Enterprise Software", topic: "Inventory Management Software", volume: 4200, kd: 48, competitorCoverage: 4, yourCoverage: 1, gapScore: 70, estimatedImpact: "Medium" },
  { cluster: "Technology", topic: "Microservices Architecture Guide", volume: 4800, kd: 60, competitorCoverage: 6, yourCoverage: 0, gapScore: 68, estimatedImpact: "Medium" },
  { cluster: "Outsourcing", topic: "Staff Augmentation Services", volume: 2900, kd: 45, competitorCoverage: 3, yourCoverage: 0, gapScore: 65, estimatedImpact: "Medium" },
];

const missingServices = [
  { service: "Dynamics 365 Consulting", relatedKeywords: 12, searchVolume: 4500, competitorPages: 8, status: "No Page", priority: "Critical" },
  { service: "Microsoft Teams Solutions", relatedKeywords: 8, searchVolume: 3200, competitorPages: 6, status: "No Page", priority: "Critical" },
  { service: "AWS Cloud Services", relatedKeywords: 15, searchVolume: 6800, competitorPages: 10, status: "No Page", priority: "Critical" },
  { service: "AI/ML Development", relatedKeywords: 22, searchVolume: 9200, competitorPages: 12, status: "No Page", priority: "High" },
  { service: "Blockchain Development", relatedKeywords: 10, searchVolume: 2800, competitorPages: 7, status: "No Page", priority: "Medium" },
  { service: "IoT Solutions", relatedKeywords: 9, searchVolume: 2400, competitorPages: 5, status: "No Page", priority: "Medium" },
  { service: "GCP Development", relatedKeywords: 11, searchVolume: 3600, competitorPages: 6, status: "No Page", priority: "Medium" },
  { service: "QA/Testing Services", relatedKeywords: 14, searchVolume: 5200, competitorPages: 8, status: "Outdated", priority: "High" },
  { service: "UI/UX Design Services", relatedKeywords: 18, searchVolume: 8200, competitorPages: 9, status: "Thin Content", priority: "High" },
  { service: "DevOps Consulting", relatedKeywords: 13, searchVolume: 4800, competitorPages: 7, status: "Thin Content", priority: "High" },
];

const clusterCoverage = [
  { cluster: "Microsoft Stack", totalTopics: 24, covered: 14, inProgress: 3, missing: 7, coveragePct: 58 },
  { cluster: "Enterprise Software", totalTopics: 18, covered: 8, inProgress: 2, missing: 8, coveragePct: 44 },
  { cluster: "Cloud Services", totalTopics: 15, covered: 6, inProgress: 2, missing: 7, coveragePct: 40 },
  { cluster: "Industry Solutions", totalTopics: 20, covered: 7, inProgress: 2, missing: 11, coveragePct: 35 },
  { cluster: "Technology", totalTopics: 16, covered: 5, inProgress: 1, missing: 10, coveragePct: 31 },
  { cluster: "Outsourcing", totalTopics: 12, covered: 4, inProgress: 1, missing: 7, coveragePct: 33 },
];

export async function GET() {
  return NextResponse.json({
    marketIntelligence: {
      trends: marketTrends,
      socialMentions,
      industryReports,
      kpis: {
        trendDirection: "Bullish",
        marketGrowth: 12.5,
        topicVelocity: 340,
        shareOfVoice: 8.2,
      },
    },
    competitorIntelligence: {
      competitors,
      blogs: competitorBlogs,
      keywords: competitorKeywords,
      backlinkComparison: [
        { name: "BrainStation-IT", backlinks: 12400, referringDomains: 2800 },
        { name: "DataSoft", backlinks: 9800, referringDomains: 2200 },
        { name: "TherapServices", backlinks: 8200, referringDomains: 1800 },
        { name: "Kaz Software", backlinks: 6500, referringDomains: 1500 },
        { name: "Cefalo", backlinks: 5200, referringDomains: 1200 },
        { name: "Mediusware (You)", backlinks: 3800, referringDomains: 850 },
      ],
    },
    keywordIntelligence: {
      keywords,
      summary: {
        total: 25,
        highPriority: 8,
        opportunity: 6,
        ranking: 11,
        notRanking: 14,
        avgKd: 59,
        avgVolume: 5960,
      },
    },
    serpAnalysis: {
      results: serpResults,
      features: serpFeatures,
      contentGapSummary: {
        avgWordCountTop3: 6833,
        avgWordCountMediusware: 1800,
        avgBacklinksTop3: 278,
        avgBacklinksMediusware: 45,
        contentGap: "4,233 words average deficit",
      },
    },
    aiSearchAudit: {
      queries: aiAuditData,
      summary: aiSummaryStats,
      weeklyTrend: [
        { week: "W1", chatgpt: 58, gemini: 45, perplexity: 62, overview: 38 },
        { week: "W2", chatgpt: 60, gemini: 48, perplexity: 65, overview: 42 },
        { week: "W3", chatgpt: 62, gemini: 50, perplexity: 68, overview: 44 },
        { week: "W4", chatgpt: 65, gemini: 52, perplexity: 70, overview: 46 },
        { week: "W5", chatgpt: 66, gemini: 54, perplexity: 71, overview: 47 },
        { week: "W6", chatgpt: 68, gemini: 56, perplexity: 72, overview: 48 },
      ],
    },
    contentPipeline: {
      items: contentPipeline,
      summary: {
        published: 3,
        inReview: 1,
        inProgress: 2,
        assigned: 2,
        drafting: 1,
        approved: 2,
        idea: 1,
        totalTrafficGenerated: 1140,
        avgWordsPublished: 5167,
      },
    },
    performance: performanceData,
    contentGaps: {
      gaps: contentGaps,
      missingServices,
      clusterCoverage,
      summary: {
        totalGaps: 12,
        criticalGaps: 3,
        highImpact: 6,
        clusterCoverage: 40,
        estimatedTrafficOpportunity: 45000,
      },
    },
    lastUpdated: new Date().toISOString(),
  });
}