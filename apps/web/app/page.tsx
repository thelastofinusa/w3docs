import { Hero } from "./components/hero"
import { ProductPreview } from "./components/preview"
import { WhyW3xp } from "./components/why-w3xp"
import { FAQs } from "./components/faqs"
import { Footer } from "./components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <ProductPreview />
      <WhyW3xp />
      <FAQs />
      <Footer />
    </div>
  )
}
