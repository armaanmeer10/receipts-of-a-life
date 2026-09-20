import { useContext } from 'react'
import { YearContext } from '../context/YearContextState'

/**
 * Custom React hook to access the shared year selection context.
 * @returns {{ selectedYear: string|number, setSelectedYear: Function, availableYears: Array }} Shared year context state.
 */
export function useYear() {
  return useContext(YearContext)
}
