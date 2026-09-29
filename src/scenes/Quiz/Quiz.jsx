import { useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import Button from '../../components/Button/Button.jsx'
import quizQuestions from '../../data/quiz.json'
import './Quiz.scss'

const getResultMessage = (percentage) => {
  if (percentage === 100) {
    return 'Ну всё. Кажется, ты действительно помнишь нашу историю не хуже меня ♥'
  }

  if (percentage >= 80) {
    return 'Очень даже неплохо. Похоже, наши маленькие моменты ты всё-таки запоминаешь ♥'
  }

  if (percentage >= 50) {
    return 'Есть небольшие пробелы в памяти. Придётся создать ещё больше воспоминаний ♥'
  }

  return 'Кажется, нам срочно нужно создавать новые воспоминания. Очень много новых воспоминаний ♥'
}

function QuizIntro({ onStart, onBack }) {
  return (
    <div className="quiz-panel quiz-panel--intro">
      <button className="quiz-back" type="button" onClick={onBack}>← Назад</button>
      <div className="quiz-panel__content">
        <p className="eyebrow">Небольшой тест</p>
        <h1 id="quiz-title">Хорошо ли ты помнишь нас?</h1>
        <p className="scene__lead">Посмотрим, сколько наших маленьких моментов осталось у тебя в памяти.</p>
        <div className="scene__action is-visible">
          <Button onClick={onStart}>Начать</Button>
        </div>
      </div>
    </div>
  )
}

function QuizMedia({ media, question }) {
  const supportedMedia = media?.filter((item) => item.type === 'image' && item.src)

  if (!supportedMedia?.length) return null

  return (
    <div className="quiz-media" aria-label="Фото к этому моменту">
      {supportedMedia.map((item) => (
        <figure className="quiz-media__item" key={item.src}>
          <div className="quiz-media__frame">
            <img
              src={item.src}
              alt={item.alt || `Фото к вопросу: ${question.question}`}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.closest('.quiz-media__item')?.classList.add('is-broken')
              }}
            />
            <span className="quiz-media__fallback" role="img" aria-label="Фото недоступно">Фото не загрузилось</span>
          </div>
          {item.caption && <figcaption>{item.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

function QuizQuestion({ question, questionIndex, total, selectedAnswer, answered, onAnswer, onNext }) {
  const selectedOption = question.options.find((option) => option.id === selectedAnswer)
  const correctOption = question.options.find((option) => option.id === question.correctAnswer)
  const isCorrect = selectedAnswer === question.correctAnswer

  return (
    <div className="quiz-panel quiz-panel--question">
      <div className="quiz-question__topline">
        <span>Вопрос {questionIndex + 1} из {total}</span>
      </div>

      <div className="quiz-progress" role="progressbar" aria-valuemin="0" aria-valuemax={total} aria-valuenow={questionIndex + 1} aria-label={`Пройдено вопросов: ${questionIndex + 1} из ${total}`}>
        <span style={{ width: `${((questionIndex + 1) / total) * 100}%` }} />
      </div>

      <div className="quiz-question__body">
        <p className="eyebrow">Наш маленький момент</p>
        <h2 id="quiz-title">{question.question}</h2>
        <div className="quiz-options" role="group" aria-label="Варианты ответа">
          {question.options.map((option, optionIndex) => {
            const isSelected = selectedAnswer === option.id
            const isCorrectOption = option.id === question.correctAnswer
            const optionState = answered
              ? isCorrectOption
                ? 'is-correct'
                : isSelected
                  ? 'is-incorrect'
                  : ''
              : ''

            return (
              <button
                key={option.id}
                className={`quiz-option ${optionState} ${isSelected ? 'is-selected' : ''}`}
                type="button"
                onClick={() => onAnswer(option.id)}
                disabled={answered}
                aria-pressed={isSelected}
              >
                <span className="quiz-option__letter" aria-hidden="true">{String.fromCharCode(65 + optionIndex)}</span>
                <span>{option.text}</span>
                {answered && isCorrectOption && <span className="quiz-option__mark" aria-label="Правильный ответ">✓</span>}
                {answered && isSelected && !isCorrectOption && <span className="quiz-option__mark" aria-label="Неправильный ответ">×</span>}
              </button>
            )
          })}
        </div>
      </div>

      {answered && (
        <section className={`quiz-feedback ${isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect'}`} aria-live="polite">
          <p className="quiz-feedback__label">{isCorrect ? 'Правильно ♥' : 'Почти ♥'}</p>
          <h3>{isCorrect ? 'Ты помнишь!' : `Правильный ответ: ${correctOption?.text}`}</h3>
          <p>{question.explanation}</p>
          <QuizMedia media={question.media} question={question} />
          <p className="quiz-feedback__chosen">Твой ответ: {selectedOption?.text}</p>
          <Button variant="secondary" onClick={onNext}>
            {questionIndex === total - 1 ? 'Узнать результат →' : 'Следующий вопрос →'}
          </Button>
        </section>
      )}
    </div>
  )
}

function QuizResult({ correct, incorrect, total, onRestart, onContinue }) {
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100)

  return (
    <div className="quiz-panel quiz-panel--result">
      <div className="quiz-result__content">
        <p className="eyebrow">Ну что...</p>
        <h1>Вот что получилось</h1>

        <div className="quiz-score" style={{ '--score': `${percentage}%` }} aria-label={`Результат: ${percentage}%`}>
          <div className="quiz-score__inner">
            <strong>{percentage}%</strong>
            <span>наша история</span>
          </div>
        </div>

        <div className="quiz-result__stats">
          <p><span>Правильных ответов</span><strong>{correct}</strong></p>
          <p><span>Неправильных ответов</span><strong>{incorrect}</strong></p>
        </div>

        <p className="quiz-result__message">{getResultMessage(percentage)}</p>

        <div className="quiz-result__actions">
          <Button onClick={onContinue}>Продолжить</Button>
          <Button variant="text" onClick={onRestart}>Пройти ещё раз</Button>
        </div>
      </div>
    </div>
  )
}

function QuizScene({ onBack, onContinue }) {
  const [view, setView] = useState('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const questions = useMemo(() => quizQuestions.filter((question) => question.options?.length > 0), [])

  const resetQuiz = () => {
    setView('intro')
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setCorrect(0)
    setIncorrect(0)
  }

  const handleAnswer = (answerId) => {
    if (selectedAnswer || view !== 'quiz') return

    const question = questions[questionIndex]
    const isCorrect = answerId === question.correctAnswer
    setSelectedAnswer(answerId)

    if (isCorrect) {
      setCorrect((score) => score + 1)
      if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        confetti({
          particleCount: 42,
          spread: 48,
          startVelocity: 24,
          scalar: 0.75,
          gravity: 1.1,
          origin: { y: 0.68 },
          colors: ['#c58b9b', '#ede9e3', '#8e6a80'],
        })
      }
    } else {
      setIncorrect((score) => score + 1)
    }
  }

  const handleNext = () => {
    if (!selectedAnswer) return

    if (questionIndex === questions.length - 1) {
      setView('result')
      return
    }

    setQuestionIndex((index) => index + 1)
    setSelectedAnswer(null)
  }

  if (questions.length === 0) {
    return (
      <section className="scene scene--quiz" aria-labelledby="quiz-title">
        <div className="quiz-panel quiz-panel--empty">
          <p className="eyebrow">Небольшой тест</p>
          <h1 id="quiz-title">Вопросы ещё готовятся</h1>
          <p className="scene__lead">Добавь хотя бы один вопрос в quiz.json, чтобы начать.</p>
          <Button variant="text" onClick={onBack}>← Назад</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="scene scene--quiz" aria-labelledby="quiz-title">
      {view === 'intro' && <QuizIntro onStart={() => setView('quiz')} onBack={onBack} />}
      {view === 'quiz' && (
        <QuizQuestion
          question={questions[questionIndex]}
          questionIndex={questionIndex}
          total={questions.length}
          selectedAnswer={selectedAnswer}
          answered={Boolean(selectedAnswer)}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}
      {view === 'result' && (
        <QuizResult
          correct={correct}
          incorrect={incorrect}
          total={questions.length}
          onRestart={resetQuiz}
          onContinue={onContinue}
        />
      )}
    </section>
  )
}

export default QuizScene
