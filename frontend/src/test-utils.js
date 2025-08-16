import { render } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import '@testing-library/jest-dom'

const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }