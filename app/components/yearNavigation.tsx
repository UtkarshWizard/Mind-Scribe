import { Button } from "@/components/ui/button"

interface YearNavigationProps {
  years: number[]
  selectedYear: number
  onYearSelect: (year: number) => void
}

export function YearNavigation({ years, selectedYear, onYearSelect }: YearNavigationProps) {
  return (
    <div className="space-y-2">
      {years.map((year) => (
        <Button
          key={year}
          variant={year === selectedYear ? "default" : "ghost"}
          className={`w-full justify-start ${
            year === selectedYear
              ? "bg-pastel-blue text-gray-800 hover:bg-pastel-blue/90"
              : "text-gray-600 hover:bg-pastel-blue/20"
          }`}
          onClick={() => onYearSelect(year)}
        >
          {year}
        </Button>
      ))}
    </div>
  )
}

