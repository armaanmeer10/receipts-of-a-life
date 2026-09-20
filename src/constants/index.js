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
