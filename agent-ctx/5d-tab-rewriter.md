# Task 5d - Tab Rewriter

## Files Modified
- `/home/z/my-project/src/components/dashboard/performance-dashboard.tsx` — completely rewritten
- `/home/z/my-project/src/components/dashboard/content-gap-tracker.tsx` — completely rewritten
- `/home/z/my-project/src/app/page.tsx` — removed data props for both tabs

## Approach
### Performance Dashboard
- Fetches `PerformanceRecord[]` from `/api/performance` via `useDataFetch`
- Pivots flat records by category → month-grouped objects per category
- 4 chart types: Area (organicTraffic), Stacked Area (rankings), Line (CTR), Stacked Bar (conversions)
- 8 KPI cards computed from latest vs previous month data
- 1 DataManager with category select field

### Content Gap Tracker
- 3 parallel fetches: `/api/content-gaps`, `/api/missing-services`, `/api/cluster-coverage`
- KPIs computed: totalGaps, criticalGaps (>=85), highImpact, avg cluster coverage, total volume
- 2 charts + 2 tables (same style as before)
- 3 DataManager buttons for each data type