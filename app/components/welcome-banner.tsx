"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Boxes } from "@/components/ui/background-boxes"
import { useSession } from "next-auth/react"

export function WelcomeBanner() {
  const session = useSession()
  const userName = session.data?.user.name
  const quote = "The only way to do great work is to love what you do." // This could be fetched from an API

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 overflow-hidden">
        <CardContent className="p-6 relative">
            <Boxes />
          <motion.h1
            className="text-3xl font-bold mb-2 text-white relative z-20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome back, {userName} !
          </motion.h1>
          <motion.p
            className="text-xl italic text-gray-200 relative z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            "{quote}"
          </motion.p>
          <motion.div
            className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-700 rounded-full opacity-50"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

