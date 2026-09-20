import { createContext, useContext, useState } from 'react'

const YearContext = createContext({
  selectedYear: 'ALL',
  setSelectedYear: () => {},
  availableYears: ['ALL'],
})

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

/**
 * React Context provider component that wraps the application and supplies
 * the active selected audit year and setter function to all child pages.
 * @param {Object} props - Component props containing children.
 * @returns {JSX.Element} Context provider component.
 */
export function YearProvider({ children }) {
  const [selectedYear, setSelectedYear] = useState('ALL')

  return (
    <YearContext.Provider
      value={{
        selectedYear,
        setSelectedYear,
        availableYears: AVAILABLE_YEARS,
      }}
    >
      {children}
    </YearContext.Provider>
  )
}

/**
 * Custom React hook to access the shared year selection state.
 * @returns {{ selectedYear: string|number, setSelectedYear: Function, availableYears: Array }} Year context value.
 */
export function useYear() {
  return useContext(YearContext)
}
