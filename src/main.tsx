import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client = {queryClient}>
    <App />
     <ToastContainer 
      position="top-center" // Mobildə tam eni tutması üçün bu daha yaxşıdır
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
  
  // Mobildə kənarlardakı boşluqları silmək üçün:
  style={{ width: "100%" }} 
      
    />
  </QueryClientProvider>,
)
