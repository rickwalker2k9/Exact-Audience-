import { refreshBreezeDailyLeadList } from "../server/breezeDailyLeadList";

try {
  const result = await refreshBreezeDailyLeadList();
  console.info("[Breeze daily lead list] completed", {
    listDate: result.listDate.toISOString(),
    releaseCount: result.releaseCount,
    importedRecordCount: result.importedRecordCount,
    visibleSlotsRefreshed: result.visibleSlotsRefreshed,
  });
  process.exit(0);
} catch (error) {
  console.error("[Breeze daily lead list] failed", error instanceof Error ? { message: error.message, stack: error.stack } : error);
  process.exit(1);
}
