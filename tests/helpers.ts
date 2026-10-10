import { fireEvent, screen, within } from '@testing-library/react'

export function selectDetailedReport() {
  fireEvent.click(within(screen.getByRole('group', { name: '阅读版本' })).getByRole('radio', { name: '详细版' }))
}
