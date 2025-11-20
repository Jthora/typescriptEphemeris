import { useState } from 'react'
import type { TutorialSource } from '../tutorial/types'

interface ReferenceListProps {
  references: TutorialSource[]
}

export default function ReferenceList({ references }: ReferenceListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (id: string, value: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = value
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopiedId(id)
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1800)
    } catch (error) {
      console.error('Failed to copy reference', error)
    }
  }

  return (
    <div className="tutorial-reference-callouts">
      <h3>Source References</h3>
      <ol>
        {references.map((ref) => (
          <li key={ref.id}>
            <div>
              <div className="reference-heading-row">
                <strong>{ref.title}</strong>
                <button type="button" onClick={() => handleCopy(ref.id, ref.sourceRef)}>
                  {copiedId === ref.id ? 'Copied' : 'Copy anchor'}
                </button>
              </div>
              {ref.summary && <p>{ref.summary}</p>}
              <small>{ref.sourceRef}</small>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
