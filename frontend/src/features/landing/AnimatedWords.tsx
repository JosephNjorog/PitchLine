interface AnimatedWordsProps {
  text: string
  startDelay?: number
  stagger?: number
  className?: string
}

/** Splits text into words and fades each one in on a stagger, for the hero's word-by-word reveal. */
export function AnimatedWords({ text, startDelay = 0, stagger = 130, className = '' }: AnimatedWordsProps) {
  const words = text.split(' ')

  return (
    <>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={`word-animate ${className}`}
          style={{
            animation: 'word-appear 0.8s ease-out forwards',
            animationDelay: `${startDelay + i * stagger}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </>
  )
}
