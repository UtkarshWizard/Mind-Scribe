import Header from './components/header'
import Hero from './components/hero'
import { Redirect } from './components/Redirect'


export default function LandingPage() {
  return (
    <div >
      <Header />
      <Redirect />
      <Hero />
    </div>
  )
}