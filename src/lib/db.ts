import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const CREATE_TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS "MarketIntel" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"date" TEXT NOT NULL DEFAULT '',"sourcePlatform" TEXT NOT NULL DEFAULT '',"topicTheme" TEXT NOT NULL DEFAULT '',"signalType" TEXT NOT NULL DEFAULT '',"searchVolumeTrend" TEXT NOT NULL DEFAULT '',"sentiment" TEXT NOT NULL DEFAULT '',"geography" TEXT NOT NULL DEFAULT '',"audienceSegment" TEXT NOT NULL DEFAULT '',"keyInsight" TEXT NOT NULL DEFAULT '',"relevanceScore" INTEGER NOT NULL DEFAULT 0,"suggestedAction" TEXT NOT NULL DEFAULT '',"linkedModule" TEXT NOT NULL DEFAULT '',"owner" TEXT NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS "CompetitorIntel" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"competitor" TEXT NOT NULL DEFAULT '',"domain" TEXT NOT NULL DEFAULT '',"pageUrl" TEXT NOT NULL DEFAULT '',"contentType" TEXT NOT NULL DEFAULT '',"targetKeyword" TEXT NOT NULL DEFAULT '',"publishDate" TEXT NOT NULL DEFAULT '',"wordCount" INTEGER NOT NULL DEFAULT 0,"estDa" INTEGER NOT NULL DEFAULT 0,"referringDomains" INTEGER NOT NULL DEFAULT 0,"estTraffic" INTEGER NOT NULL DEFAULT 0,"contentGap" TEXT NOT NULL DEFAULT '',"priority" TEXT NOT NULL DEFAULT 'Medium',"confidenceNotes" TEXT NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS "KeywordIntel" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"keyword" TEXT NOT NULL DEFAULT '',"cluster" TEXT NOT NULL DEFAULT '',"volume" INTEGER NOT NULL DEFAULT 0,"kd" INTEGER NOT NULL DEFAULT 0,"cpc" REAL NOT NULL DEFAULT 0,"intent" TEXT NOT NULL DEFAULT 'Informational',"serpFeatures" TEXT NOT NULL DEFAULT '',"priorityScore" INTEGER NOT NULL DEFAULT 0,"targetPage" TEXT NOT NULL DEFAULT '',"currentRank" INTEGER NOT NULL DEFAULT 0,"status" TEXT NOT NULL DEFAULT 'Not Started',"dataSource" TEXT NOT NULL DEFAULT '',"lastRefreshed" TEXT NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS "SerpAnalysis" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"keyword" TEXT NOT NULL DEFAULT '',"rank" INTEGER NOT NULL DEFAULT 0,"rankingUrlDomain" TEXT NOT NULL DEFAULT '',"contentType" TEXT NOT NULL DEFAULT '',"wordCount" INTEGER NOT NULL DEFAULT 0,"estDa" INTEGER NOT NULL DEFAULT 0,"featuredSnippet" BOOLEAN NOT NULL DEFAULT 0,"missingSubtopics" TEXT NOT NULL DEFAULT '',"formatOpportunity" TEXT NOT NULL DEFAULT '',"ourRank" INTEGER NOT NULL DEFAULT 0,"action" TEXT NOT NULL DEFAULT '',"lastChecked" TEXT NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS "AiSearchAudit" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"query" TEXT NOT NULL DEFAULT '',"aiPlatform" TEXT NOT NULL DEFAULT '',"brandMentioned" BOOLEAN NOT NULL DEFAULT 0,"position" INTEGER NOT NULL DEFAULT 0,"citedUrl" TEXT NOT NULL DEFAULT '',"competitorMentioned" TEXT NOT NULL DEFAULT '',"sentiment" TEXT NOT NULL DEFAULT 'Neutral',"answerSummary" TEXT NOT NULL DEFAULT '',"gap" TEXT NOT NULL DEFAULT '',"fix" TEXT NOT NULL DEFAULT '',"owner" TEXT NOT NULL DEFAULT '',"lastChecked" TEXT NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS "ContentPipeline" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"title" TEXT NOT NULL DEFAULT '',"cluster" TEXT NOT NULL DEFAULT '',"targetKeyword" TEXT NOT NULL DEFAULT '',"contentType" TEXT NOT NULL DEFAULT '',"writer" TEXT NOT NULL DEFAULT '',"status" TEXT NOT NULL DEFAULT 'Idea',"priority" TEXT NOT NULL DEFAULT 'Medium',"duePublishDate" TEXT NOT NULL DEFAULT '',"wordCountTarget" INTEGER NOT NULL DEFAULT 0,"seoChecklist" TEXT NOT NULL DEFAULT '',"liveUrl" TEXT NOT NULL DEFAULT '',"notes" TEXT NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS "PerformanceDash" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"page" TEXT NOT NULL DEFAULT '',"keyword" TEXT NOT NULL DEFAULT '',"rank" INTEGER NOT NULL DEFAULT 0,"rankChange" INTEGER NOT NULL DEFAULT 0,"impressions" INTEGER NOT NULL DEFAULT 0,"clicks" INTEGER NOT NULL DEFAULT 0,"ctr" REAL NOT NULL DEFAULT 0,"timeOnPage" REAL NOT NULL DEFAULT 0,"leads" INTEGER NOT NULL DEFAULT 0,"conversions" INTEGER NOT NULL DEFAULT 0,"conversionRate" REAL NOT NULL DEFAULT 0,"trafficSource" TEXT NOT NULL DEFAULT '',"weekOf" TEXT NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS "ContentGapTracker" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"cluster" TEXT NOT NULL DEFAULT '',"missingSubtopic" TEXT NOT NULL DEFAULT '',"serviceLineSupported" BOOLEAN NOT NULL DEFAULT 0,"competitorCoverage" BOOLEAN NOT NULL DEFAULT 0,"demand" TEXT NOT NULL DEFAULT 'Medium',"priority" TEXT NOT NULL DEFAULT 'Medium',"suggestedType" TEXT NOT NULL DEFAULT '',"ownerTeam" TEXT NOT NULL DEFAULT '',"assigned" TEXT NOT NULL DEFAULT '',"status" TEXT NOT NULL DEFAULT 'Not Started',"targetQuarter" TEXT NOT NULL DEFAULT '',"notes" TEXT NOT NULL DEFAULT '')`,
];

let initPromise: Promise<void> | null = null;

/** Ensures all DB tables exist. Safe to call multiple times. */
export function ensureDb(client: PrismaClient): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        for (const sql of CREATE_TABLES_SQL) {
          await client.$executeRawUnsafe(sql);
        }
      } catch {
        // Tables likely already exist — safe to ignore
      }
    })();
  }
  return initPromise;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db