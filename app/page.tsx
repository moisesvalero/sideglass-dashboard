import { TimeWeatherWidget } from "@/components/dashboard/time-weather-widget"
import { CalendarWidget } from "@/components/dashboard/calendar-widget"
import { MotivationWidget } from "@/components/dashboard/motivation-widget"
import { HardwareMonitor } from "@/components/dashboard/hardware-monitor"
import { AIDock } from "@/components/dashboard/ai-dock"

export default function Dashboard() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Deep dark gradient background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(30, 30, 80, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(50, 20, 80, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(20, 30, 60, 0.3) 0%, transparent 70%),
            linear-gradient(180deg, 
              rgb(8, 8, 18) 0%, 
              rgb(12, 10, 25) 25%, 
              rgb(10, 8, 22) 50%, 
              rgb(8, 6, 18) 75%, 
              rgb(6, 6, 14) 100%
            )
          `,
        }}
      />

      {/* Subtle ambient light effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      {/* Vertical bento grid layout */}
      <div className="flex flex-col h-screen p-4 gap-4 max-w-md mx-auto pb-28">
        {/* Time & Weather Widget */}
        <TimeWeatherWidget />

        {/* Calendar Widget */}
        <CalendarWidget />

        {/* Motivation Banner */}
        <MotivationWidget />

        {/* Hardware Monitor */}
        <div className="flex-1">
          <HardwareMonitor />
        </div>
      </div>

      {/* Floating AI Dock */}
      <AIDock />
    </main>
  )
}
