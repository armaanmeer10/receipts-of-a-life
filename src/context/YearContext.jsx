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

export function useYear() {
  return useContext(YearContext)
}
