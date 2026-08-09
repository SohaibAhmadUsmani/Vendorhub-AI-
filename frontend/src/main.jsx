import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './redux/store'
import './index.css'
import App from './App.jsx'
import { NotificationProvider } from './contexts/NotificationContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
