// src/dashBoard/DashBoard.jsx
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"
import { Sidebar } from "./components/layout/Sidebar"
import { Outlet, useLocation } from "react-router-dom"

export const DashboardLayout = () => {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50">
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait">
            <m.div
              key={location.pathname}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </main>
    </div>
  )
}