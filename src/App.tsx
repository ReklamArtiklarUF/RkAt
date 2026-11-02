import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Programs from "./pages/Programs.tsx";
import Butik from "./pages/Butik.tsx";
import OmOss from "./pages/OmOss.tsx";

import ScrollToTop from "./components/ScrollToTop.tsx";
import Produkt from "./pages/Produkt.tsx";

import Instructors from "./pages/Instructors.tsx";
import Schedule from "./pages/Schedule.tsx";
import Stories from "./pages/Stories.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import Cart from "./pages/Cart.tsx";
import { CartProvider } from "./context/CartContext.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>

          <Route path="/" element={<Index />} />
          <Route path="/butik" element={<Butik />} />
          <Route path="/butik/:slug" element={<Produkt />} />
          <Route path="/om-oss" element={<OmOss />} />

          <Route path="/programs" element={<Programs />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/kundvagn" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
