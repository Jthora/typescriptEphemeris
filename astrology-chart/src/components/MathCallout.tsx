import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export interface MathCalloutProps {
  title: string
  latex: string
  description: string
  source: string
}

export default function MathCallout({ title, latex, description, source }: MathCalloutProps) {
  const rendered = useMemo(() => {
    try {
      return katex.renderToString(latex, { throwOnError: false })
    } catch (error) {
      console.error('KaTeX render error', error)
      return latex
    }
  }, [latex])

  return (
    <article className="tutorial-math-card">
      <header>
        <strong>{title}</strong>
        <small>{source}</small>
      </header>
      <div className="tutorial-math-code" dangerouslySetInnerHTML={{ __html: rendered }} />
      <p>{description}</p>
    </article>
  )
}
