import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Datalar 5 dəqiqə "təzə" qalsın (təkrar sorğu atmasın)
      gcTime: 1000 * 60 * 10, // Keşdə 10 dəqiqə saxla
      refetchOnWindowFocus: false, // Pəncərəyə qayıdanda təzədən yükləmə (Trafikə qənaət)
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
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
);
