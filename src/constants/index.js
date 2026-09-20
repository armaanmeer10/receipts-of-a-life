/**
 * Application constants, magic numbers, theme settings, and preset configurations.
 */

export const AVAILABLE_YEARS = [
  'ALL',
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
  2019,
  2020,
  2021,
  2022,
  2023,
  2024,
]

export const DEFAULT_YEAR = 'ALL'
export const START_YEAR = 2013
export const END_YEAR = 2024
export const PEAK_YEAR = 2017

export const COUNT_UP_DURATION_MS = 900
export const TIMELINE_INTERVAL_MS = 1500
export const BEEP_FREQUENCY_HZ = 880
export const BEEP_DURATION_SEC = 0.05

export const RECEIPT_ZIGZAG_TEETH = 22
export const RECEIPT_ZIGZAG_DEPTH = 8
export const BARCODE_GRADIENT =
  'repeating-linear-gradient(90deg,#111 0 2px,transparent 2px 4px,#111 4px 5px,transparent 5px 8px,#111 8px 11px,transparent 11px 12px)'

export const DONUT_COLORS = [
  '#ffe500',
  '#ff4d8d',
  '#00f5a0',
  '#b8f500',
  '#00d2ff',
  '#ff9900',
]

export const PRESET_CHIPS = [
  { label: 'The Beatles (13.6k plays)', query: 'The Beatles' },
  { label: 'Subscriptions & Media', query: 'subscription' },
  { label: 'Investments & FDs', query: 'Investment' },
  { label: 'Salary & Income', query: 'salary' },
  { label: 'Travel & Bike Transit', query: 'Travel' },
  { label: 'Notes & Anomalies', query: 'silence' },
]

/**
 * Metadata and neo-brutalist styling for all 15 event data types (kinds) present in events.json.
 */
export const EVENT_KINDS = {
  first_play: {
    id: 'first_play',
    label: 'FIRST PLAY',
    category: 'music',
    color: 'bg-sun text-ink border-ink',
    desc: 'First track logged in archive',
  },
  discovery: {
    id: 'discovery',
    label: 'DISCOVERY',
    category: 'music',
    color: 'bg-mint text-ink border-ink',
    desc: 'New artist or track first heard',
  },
  silence: {
    id: 'silence',
    label: 'SILENCE / GAP',
    category: 'notes',
    color: 'bg-paper text-ink border-ink/80',
    desc: 'Extended listening hiatus or data gap',
  },
  salary_first: {
    id: 'salary_first',
    label: 'FIRST SALARY',
    category: 'financial',
    color: 'bg-hot text-ink border-ink',
    desc: 'First professional paycheque credited',
  },
  investment: {
    id: 'investment',
    label: 'INVESTMENT',
    category: 'financial',
    color: 'bg-sun text-ink border-ink',
    desc: 'SIP, mutual fund, or capital allocation',
  },
  double_day: {
    id: 'double_day',
    label: 'DOUBLE DAY',
    category: 'milestone',
    color: 'bg-volt text-white border-ink',
    desc: 'Music listening and bank expense on same day',
  },
  big_move: {
    id: 'big_move',
    label: 'BIG MOVE',
    category: 'financial',
    color: 'bg-[#ff9900] text-ink border-ink',
    desc: 'Significant capital transfer or asset purchase',
  },
  big_day: {
    id: 'big_day',
    label: 'BIG SPEND DAY',
    category: 'financial',
    color: 'bg-[#ff4d8d] text-ink border-ink',
    desc: 'High expenditure day in bank ledger',
  },
  subscription: {
    id: 'subscription',
    label: 'SUBSCRIPTION',
    category: 'subscription',
    color: 'bg-mint text-ink border-ink',
    desc: 'Recurring digital service or media payment',
  },
  binge: {
    id: 'binge',
    label: 'BINGE LISTEN',
    category: 'music',
    color: 'bg-hot text-ink border-ink',
    desc: 'Intense single-artist repeat session',
  },
  surge: {
    id: 'surge',
    label: 'SURGE',
    category: 'music',
    color: 'bg-sun text-ink border-ink',
    desc: 'Sudden spike in listening volume',
  },
  peak_month: {
    id: 'peak_month',
    label: 'PEAK MONTH',
    category: 'music',
    color: 'bg-volt text-white border-ink',
    desc: 'All-time monthly scrobble record',
  },
  maturity: {
    id: 'maturity',
    label: 'MATURITY / REDEEM',
    category: 'financial',
    color: 'bg-[#00d2ff] text-ink border-ink',
    desc: 'Fixed deposit or mutual fund redemption',
  },
  last_receipt: {
    id: 'last_receipt',
    label: 'LAST RECEIPT',
    category: 'financial',
    color: 'bg-paper text-ink border-ink',
    desc: 'Final recorded bank ledger receipt',
  },
  peak_day: {
    id: 'peak_day',
    label: 'PEAK DAY',
    category: 'music',
    color: 'bg-[#b8f500] text-ink border-ink',
    desc: 'Single day listening volume high',
  },
}

export const ALL_KINDS_LIST = Object.keys(EVENT_KINDS)

export const YEAR_SUBTITLES = {
  ALL: 'FULL ARCHIVE AUDIT (2013-2024)',
  2013: 'LATE-NIGHT BEGINNINGS / FIRST SIGNAL',
  2014: 'THE SILENT SPINDLE / ARCHIVE GAP',
  2015: 'INCOME OPENS / FIRST SALARY & INVESTMENT',
  2016: 'BEATLES DISCOVERY & SUBSCRIPTION STACK',
  2017: 'THE YEAR OF EVERYTHING / CAREER & CODE PIVOT',
  2018: 'PEAK VOLUME & INVESTMENT MATURITY',
  2019: 'SURGE & BEATLES MONO-LOOPS',
  2020: 'LOCKDOWN BINGES & AMBIENT LOOPS',
  2021: 'QUIET ARCHIVE / FADE OUT',
  2022: 'JUANES BINGE & SPARSE RECEIPTS',
  2023: 'EHRLING LOOPS & AMBIENT DAYS',
  2024: 'THE FINAL SPINS / ARCHIVE CLOSE',
}

export const CHAPTERS = [
  {
    id: 'ch1',
    label: 'LATE-NIGHT BEGINNINGS',
    dateRange: 'JUL 2013 – AUG 2014',
    years: [2013, 2014],
    color: 'bg-hot',
    textColor: 'text-ink',
    tag: 'FIRST SIGNAL',
    desc: 'The archive wakes up. A single play at 02:44 AM starts eleven years of data.',
  },
  {
    id: 'ch2',
    label: 'THE WINTER PIVOT',
    dateRange: 'JAN 2015 – DEC 2016',
    years: [2015, 2016],
    color: 'bg-sun',
    textColor: 'text-ink',
    tag: 'INCOME BEGINS',
    desc: 'First salary. First investments. First subscriptions. The ledger opens.',
  },
  {
    id: 'ch3',
    label: 'THE YEAR OF EVERYTHING',
    dateRange: 'JAN 2017 – DEC 2017',
    years: [2017],
    color: 'bg-volt',
    textColor: 'text-white',
    tag: 'PEAK CHAOS',
    desc: 'Peak listening month. ₹2 lakh in fixed deposits. The Beatles every single day.',
  },
  {
    id: 'ch4',
    label: 'PEAK VOLUME & AMBIENCE',
    dateRange: 'JAN 2018 – DEC 2020',
    years: [2018, 2019, 2020],
    color: 'bg-mint',
    textColor: 'text-ink',
    tag: 'MAX SIGNAL',
    desc: 'The ledger closes. The music keeps going. 5,176 plays in a single month.',
  },
  {
    id: 'ch5',
    label: 'THE QUIET YEARS',
    dateRange: 'JAN 2021 – DEC 2024',
    years: [2021, 2022, 2023, 2024],
    color: 'bg-paper',
    textColor: 'text-ink',
    tag: 'FADE OUT',
    desc: 'Fewer receipts. Bigger gaps. The archive winds down quietly.',
  },
]
