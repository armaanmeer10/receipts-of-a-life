import { useState } from 'react'
import PropTypes from 'prop-types'
import { YearContext } from './YearContextState'
import { AVAILABLE_YEARS, DEFAULT_YEAR } from '../constants'

/**
 * React Context provider component supplying active selected audit year to child components.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export function YearProvider({ children }) {
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR)

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

YearProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
