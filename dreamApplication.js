/**
 * ============================================================================
 * MODULE 1: ORGANIZATION & TIME MANAGEMENT
 * Project: Instrumented Trade Parser v2.5
 * ============================================================================
 */

// MODULE 2: CREATING AND USING OBJECTS (Configuration)
const tradeRules = {
  authorizedSender: "alerts@tradingview.com",
  validActions: ["BUY", "SELL"],
  riskPercent: 0.05 // 5% Stop Loss
};

/**
 * MODULE 3 & 4: LOGIC, STRINGS, AND GUARD CLAUSES
 */
function extractSignalData(rawEmail, index) {
  console.log(`\n--- [CHECKING EMAIL #${index + 1}] ---`);

  // GUARD: Basic validation
  if (!rawEmail || typeof rawEmail !== 'string') {
    console.warn(`[SKIP] Email #${index + 1} is empty or invalid format.`);
    return null;
  }

  // MODULE 4: STRINGING CHARACTERS TOGETHER
  const cleanBody = rawEmail.trim().toUpperCase();
  console.log(`[DATA] Normalized text: "${cleanBody}"`);
  
  // GUARD: Check for keyword
  if (!cleanBody.includes("SIGNAL:")) {
    console.log(`[REJECT] No "SIGNAL:" keyword found. Likely spam or notification.`);
    return null;
  }

  // MODULE 5: VALUES, DATA TYPES, AND OPERATIONS
  const words = cleanBody.split(" "); 
  // Expected format: "SIGNAL: [ACTION] [TICKER] @ [PRICE]"
  
  const action = words[1];
  const ticker = words[2];
  const rawPrice = words[4];

  // Type Casting String to Number
  const entryPrice = Number(rawPrice); 

  // Verify the conversion worked (Safety Check)
  if (isNaN(entryPrice)) {
    console.error(`[ERROR] Failed to parse price "${rawPrice}" for ${ticker}.`);
    return null;
  }

  // Math Operation: Calculating Stop Loss
  const stopLoss = entryPrice * (1 - tradeRules.riskPercent);

  console.log(`[SUCCESS] Signal Identified: ${action} ${ticker} at $${entryPrice} (SL:$${stopLoss})`);

  // MODULE 6: CREATING AND USING OBJECTS
  return {
    action: action,
    ticker: ticker,
    price: entryPrice,
    sl: stopLoss,
    timestamp: new Date().toLocaleTimeString()
  };
}

/**
 * MODULE 7: BUILDING ARRAYS
 */
const inbox = [
  "Signal: BUY BTC @ 60000",
  "Signal: SELL ETH @ 3000",
  "System Alert: Battery Low", // Should be filtered
  "Signal: BUY AAPL @ 150",
  "   " // Should be skipped by guards
];

console.log(`Starting parse for ${inbox.length} items...`);

// Transforming strings into objects
const processedResults = inbox.map((msg, i) => extractSignalData(msg, i));

/**
 * MODULE 8: USING ARRAYS (Final Cleanup)
 */
const validTrades = processedResults.filter(trade => {
  const isValid = trade !== null;
  if (!isValid) return false;
  
  // Extra Logic Check: Is the action supported by our config?
  return tradeRules.validActions.includes(trade.action);
});

console.log(`\n=========================================`);
console.log(`FINAL REPORT: Found ${validTrades.length} valid trade(s).`);
console.log(`=========================================`);

/**
 * MODULE 9: THE GROWTH MINDSET (Execution Simulation)
 */
validTrades.forEach(trade => {
  try {
    console.log(`[EXECUTION] ${trade.timestamp} | Placing ${trade.action} order for ${trade.ticker}...`);
    // This is where you'd call your brokerage API fetch() request
  } catch (err) {
    console.error(`[FRICTION] Execution error on ${trade.ticker}. Check API connection.`);
  }
});

