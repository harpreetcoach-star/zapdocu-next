const MAX_DAILY_FILES = 50;
const COUNT_KEY = 'zapdocu_daily_count';
const DATE_KEY = 'zapdocu_last_reset_date';

// Helper to get today's date string (YYYY-MM-DD)
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function checkAndTrackUsage(newFileCount, isProUser = false) {
  if (isProUser) return { allowed: true };

  const today = getTodayString();
  const savedDate = localStorage.getItem(DATE_KEY);
  let currentCount = 0;

  // If it's a brand new day, reset the counter to 0
  if (savedDate !== today) {
    localStorage.setItem(DATE_KEY, today);
    localStorage.setItem(COUNT_KEY, '0');
    currentCount = 0;
  } else {
    const savedCount = localStorage.getItem(COUNT_KEY);
    currentCount = savedCount ? parseInt(savedCount, 10) : 0;
  }

  const remainingAllowed = Math.max(0, MAX_DAILY_FILES - currentCount);
  const totalAttempted = currentCount + newFileCount;

  // Check if they exceed the daily limit
  if (currentCount >= MAX_DAILY_FILES || totalAttempted > MAX_DAILY_FILES) {
    return {
      allowed: false,
      remaining: remainingAllowed,
      message: `You've used your 15 free files for today. You have ${remainingAllowed} file(s) remaining.\n\nUpgrade to Pro for unlimited files right now!`
    };
  }

  // Otherwise, update storage with the new count for today
  localStorage.setItem(COUNT_KEY, totalAttempted.toString());
  return { allowed: true };
}

// Helper function to fetch remaining files safely for client & server
export function getRemainingUsage() {
  if (typeof window === 'undefined') {
    return { used: 0, remaining: MAX_DAILY_FILES };
  }

  const today = getTodayString();
  const savedDate = localStorage.getItem(DATE_KEY);
  
  // If a new day has started since their last visit, they have full quota
  if (savedDate !== today) {
    return { used: 0, remaining: MAX_DAILY_FILES };
  }

  const savedCount = localStorage.getItem(COUNT_KEY);
  const currentCount = savedCount ? parseInt(savedCount, 10) : 0;
  const remaining = Math.max(0, MAX_DAILY_FILES - currentCount);
  
  return { used: currentCount, remaining };
}