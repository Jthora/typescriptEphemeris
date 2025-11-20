export type TutorialSourceRef = `${string}.${'md' | 'markdown'}${string}`

export interface TutorialSource {
  id: string
  title: string
  sourceRef: TutorialSourceRef
  summary?: string
}

export interface TutorialMathSnippet {
  id: string
  title: string
  latex: string
  description: string
  sourceRef: TutorialSourceRef
}

export interface TutorialTextBlock {
  heading: string
  body: string
  sourceRef: TutorialSourceRef
}

export interface TutorialPage {
  id: string
  title: string
  summary: string
  textBlocks: TutorialTextBlock[]
  math?: TutorialMathSnippet[]
  references?: TutorialSource[]
  usageNotes?: string[]
}

export interface TutorialSection {
  id: string
  label: string
  summary: string
  pages: TutorialPage[]
}

export interface TutorialModule {
  id: string
  label: string
  description: string
  theme: 'core' | 'void' | 'order' | 'chaos' | 'alpha' | 'omega'
  sections: TutorialSection[]
}

export type TutorialContent = readonly TutorialModule[]
