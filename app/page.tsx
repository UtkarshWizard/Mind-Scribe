import Header from './components/header'
import Hero from './components/hero'
import Features from './components/features'
import HowItWorks from './components/how-it-work'
import Testimonials from './components/testimonials'
import CallToAction from './components/call-to-action'
import Footer from './components/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}