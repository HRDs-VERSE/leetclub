import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Users, Trophy, Zap, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow bg-black">
        {/* Hero Section */}
        <section className="text-white py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in-up">
              Conquer Code, <span className="text-primary">Together</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              LeetClub: Where competitive programmers unite, collaborate, and dominate coding challenges across platforms.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-6 ">
                <Link href="/auth/signup">Start Coding Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 ">
                <Link href="/auth/login">Log In to Your Account</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <FeatureBadge text="Track multiple platforms" />
              <FeatureBadge text="Collaborate with peers" />
              <FeatureBadge text="Compete in groups" />
              <FeatureBadge text="Improve your skills" />
            </div>
          </div>
        </section>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-blue-700 to-transparent h-[1px] w-full" />

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Why LeetClub Stands Out</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place">
              <FeatureCard
                icon={<Code className="w-12 h-12 mb-4 text-primary" />}
                title="Unified Progress Tracking"
                description="Seamlessly monitor your performance across LeetCode, HackerRank, CodeForces, and more - all in one dashboard."
              />
              <FeatureCard
                icon={<Users className="w-12 h-12 mb-4 text-primary" />}
                title="Peer Collaboration"
                description="Under Development"
              />
              <FeatureCard
                icon={<Trophy className="w-12 h-12 mb-4 text-primary" />}
                title="Competitive Group and Colleges Ranks"
                description="Engage in exciting competitions with your college or coding group, and climb the leaderboards together."
              />
              {/* <FeatureCard
                icon={<Zap className="w-12 h-12 mb-4 text-primary" />}
                title="Skill Acceleration"
                description="Access curated challenges, expert tips, and personalized learning paths to rapidly enhance your coding prowess."
              /> */}
            </div>
          </div>
        </section>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-blue-700 to-transparent h-[1px] w-full" />

        {/* CTA Section */}
        <section className="text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Elevate Your Coding Game?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already leveraging LeetClub to become top-tier competitive programmers. Your journey to coding excellence starts here!
            </p>
            <Button asChild size="lg" variant="secondary" className="text-primary text-lg px-8 py-6 ">
              <Link href="/auth/signup">
                Launch Your Coding Career <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-white to-transparent h-[1px] w-full" />
      <footer className=" text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} LeetClub. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-black p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-neutral-400">{description}</p>
    </div>
  )
}

function FeatureBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center bg-black text-white px-4 py-2 rounded-full">
      <CheckCircle className="w-4 h-4 mr-2" />
      <span>{text}</span>
    </div>
  )
}

