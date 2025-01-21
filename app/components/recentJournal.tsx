import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

// This would typically be fetched from your backend
const mockEntries = [
  { id: 1, date: '2023-06-15', content: 'Today was a productive day. I managed to complete most of my tasks...', sentiment: 'Happy' },
  { id: 2, date: '2023-06-14', content: 'Feeling a bit stressed about the upcoming project deadline...', sentiment: 'Stressed' },
  { id: 3, date: '2023-06-13', content: 'Had a great conversation with an old friend today. It reminded me of...', sentiment: 'Reflective' },
]

export function RecentJournalEntries() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className=''>
        <CardTitle className='text-xl lg:text-3xl pb-8 flex justify-between gap-4'>
            Recent Journal Entries 
            <Button className='cursor-pointer' onClick={() => {router.push('/journal')}}>Show All Entries</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockEntries.map((entry) => (
            <li key={entry.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">{entry.date}</span>
                <span className="text-sm bg-muted px-2 py-1 rounded">{entry.sentiment}</span>
              </div>
              <p className="text-sm mb-2">{entry.content.substring(0, 100)}...</p>
              <Button variant="link" className="p-0 text-blue-700">View Details</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

