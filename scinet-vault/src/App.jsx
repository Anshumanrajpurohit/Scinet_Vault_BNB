import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Upload = lazy(() => import('./pages/Upload'))
const Explorer = lazy(() => import('./pages/Explorer'))
const Profile = lazy(() => import('./pages/Profile'))
const DaoVoting = lazy(() => import('./pages/DaoVoting'))

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Suspense fallback={<PageLoader />}> 
                    <Landing />
                  </Suspense>
                </PageWrapper>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PageWrapper>
                  <Suspense fallback={<PageLoader />}> 
                    <Dashboard />
                  </Suspense>
                </PageWrapper>
              }
            />
            <Route
              path="/upload"
              element={
                <PageWrapper>
                  <Suspense fallback={<PageLoader />}> 
                    <Upload />
                  </Suspense>
                </PageWrapper>
              }
            />
            <Route
              path="/explorer"
              element={
                <PageWrapper>
                  <Suspense fallback={<PageLoader />}> 
                    <Explorer />
                  </Suspense>
                </PageWrapper>
              }
            />
            <Route
              path="/profile"
              element={
                <PageWrapper>
                  <Suspense fallback={<PageLoader />}> 
                    <Profile />
                  </Suspense>
                </PageWrapper>
              }
            />
            <Route
              path="/dao"
              element={
                <PageWrapper>
                  <Suspense fallback={<PageLoader />}> 
                    <DaoVoting />
                  </Suspense>
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

function PageWrapper({ children }) {
  return (
    <motion.section
      className="px-4 md:px-8 lg:px-12 py-8 md:py-10"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-10 w-10 rounded-full gradient-primary animate-pulse" />
    </div>
  )
}
