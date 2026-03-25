"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, LineChart, Lock, Sparkles } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5">
      <Icon className="text-orange-500 w-6 h-6" />
    </div>
    <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
    <p className="text-neutral-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

export default function Hero() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500/30 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-32 relative">
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span className="text-xs font-medium text-neutral-300 tracking-wide uppercase">
                Powered by Advanced AI
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-500"
            >
              Journaling, <br />
              <span className="font-serif text-white">Reimagined.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed"
            >
              Unlock deeper insights into your thoughts with our AI-powered
              sentiment analysis. Track your mood, understand your patterns, and
              grow every day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link href="/auth/signUp">
                <button className="px-8 py-4 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/20 flex items-center gap-2 group">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-8 py-4 rounded-full bg-transparent hover:bg-white/5 text-white font-medium transition-all border border-white/10 hover:border-white/20 flex items-center gap-2">
                View Demo
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 w-full max-w-[450px]"
          >
            <CardContainer className="inter-var" containerClassName="py-12 lg:py-0">
              <CardBody className="bg-white/5 relative group/card dark:hover:shadow-2xl dark:hover:shadow-orange-500/[0.1] dark:bg-neutral-900/50 dark:border-white/[0.1] border-black/[0.1] w-full h-auto rounded-2xl p-4 border backdrop-blur-sm transition-all">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-white mb-2"
                >
                  Mindful Insights
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-400 text-sm max-w-sm"
                >
                  Gently track your emotional landscape with subtle AI analysis.
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4 h-64 relative">
                  <Image
                    src="/images/journal-preview.png"
                    fill
                    className="object-cover rounded-2xl group-hover/card:shadow-2xl group-hover/card:shadow-orange-500/20 shadow-2xl transition-all duration-500"
                    alt="AI sentiment dashboard preview"
                    priority
                  />
                </CardItem>
              </CardBody>
            </CardContainer>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Why choose MindScribe?
            </h2>
            <p className="text-neutral-400">
              Everything you need to understand yourself better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="Sentiment Analysis"
              description="Our AI analyzes the tone of your entries to help you track your emotional journey over time."
              delay={0.1}
            />
            <FeatureCard
              icon={LineChart}
              title="Mood Tracking"
              description="Track your mood patterns and maintain the streak for a better mental health"
              delay={0.2}
            />
            <FeatureCard
              icon={Lock}
              title="Private & Secure"
              description="Your thoughts are yours alone. Share your day without any hesitation"
              delay={0.3}
            />
          </div>
        </section>

        {/* Big CTA */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 p-12 md:p-24 text-center"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV0d29yayUyMGdyYWRpZW50fGVufDF8fHx8MTc3MTY5MjA4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')] opacity-20 bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-xl md:text-5xl font-medium mb-6">
                Start your journey to better mental clarity.
              </h2>
              <p className="text-neutral-400 mb-10 text-sm md:text-lg">
                Join us on this journey to a better you and transform your life.
              </p>

              <Link href="/auth/signUp">
                <button className="px-10 py-5 rounded-full bg-white text-black font-medium text-lg transition-all hover:bg-neutral-200 hover:scale-105 active:scale-95 shadow-xl shadow-white/10 inline-flex items-center gap-2">
                  Get Started Now
                </button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-orange-500" />
            <span className="text-white font-medium">MindScribe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Made with ❤️ by</span>
            <Link
              href="https://utkarsh-five.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-orange-500 font-medium cursor-pointer transition-all duration-300 relative group"
            >
              Utkarsh
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
          <p>© {new Date().getFullYear()} MindScribe</p>
        </div>
      </footer>
    </div>
  );
}
