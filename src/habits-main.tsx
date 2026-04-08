import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HabitApp } from './habits/components/HabitApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HabitApp />
  </StrictMode>,
)
