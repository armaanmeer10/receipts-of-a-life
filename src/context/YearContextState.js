import { createContext } from 'react'
import { AVAILABLE_YEARS, DEFAULT_YEAR } from '../constants'

export const YearContext = createContext({
  selectedYear: DEFAULT_YEAR,
  setSelectedYear: () => {},
  availableYears: AVAILABLE_YEARS,
})
