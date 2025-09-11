import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const quizData = {
  'gad-7': {
    title: 'Anxiety Test (GAD-7)',
    questions: [
      { questionText: 'Feeling nervous, anxious, or on edge?' },
      { questionText: 'Not being able to stop or control worrying?' },
      { questionText: 'Worrying too much about different things?' },
      { questionText: 'Trouble relaxing?' },
      { questionText: 'Being so restless that it is hard to sit still?' },
      { questionText: 'Becoming easily annoyed or irritable?' },
      { questionText: 'Feeling afraid as if something awful might happen?' },
    ],
    interpretations: (score) => {
      if (score <= 4) return { level: 'Minimal Anxiety', text: 'Your results suggest minimal anxiety. Continue practicing self-care.' };
      if (score <= 9) return { level: 'Mild Anxiety', text: 'Your results suggest mild anxiety. The self-help resources may be beneficial.' };
      if (score <= 14) return { level: 'Moderate Anxiety', text: 'Your results suggest moderate anxiety. It might be helpful to connect with a counselor.' };
      return { level: 'Severe Anxiety', text: 'Your results suggest severe anxiety. We strongly recommend booking a session with a counselor.' };
    }
  },
  'phq-9': {
    title: 'Depression Test (PHQ-9)',
    questions: [
        { questionText: 'Little interest or pleasure in doing things?' },
        { questionText: 'Feeling down, depressed, or hopeless?' },
        { questionText: 'Trouble falling or staying asleep, or sleeping too much?' },
        { questionText: 'Feeling tired or having little energy?' },
        { questionText: 'Poor appetite or overeating?' },
        { questionText: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down?' },
        { questionText: 'Trouble concentrating on things, such as reading the newspaper or watching television?' },
        { questionText: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?' },
        { questionText: 'Thoughts that you would be better off dead, or of hurting yourself in some way?' },
    ],
    interpretations: (score) => {
      if (score <= 4) return { level: 'Minimal Depression', text: 'Your results suggest minimal signs of depression.' };
      if (score <= 9) return { level: 'Mild Depression', text: 'Your results suggest mild signs of depression. Self-help resources are a good start.' };
      if (score <= 14) return { level: 'Moderate Depression', text: 'Your results suggest moderate signs of depression. Please consider speaking with a counselor.' };
      return { level: 'Severe Depression', text: 'Your results suggest severe signs of depression. We strongly recommend you book a session with a counselor.' };
    }
  },
};

const answerOptions = [
  { answerText: 'Not at all', score: 0 },
  { answerText: 'Several days', score: 1 },
  { answerText: 'More than half the days', score: 2 },
  { answerText: 'Nearly every day', score: 3 },
];

function QuizPage() {
  const { testSlug } = useParams();
  const test = quizData[testSlug] || quizData['gad-7'];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswerClick = (score) => {
    setAnswers({ ...answers, [currentQuestion]: score });
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const totalScore = Object.values(answers).reduce((acc, score) => acc + score, 0);
  const result = test.interpretations(totalScore);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          {showResult ? (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 text-center">Your Result for {test.title}</h1>
              <div className="text-center my-6">
                <p className="text-lg text-gray-600">Your score is</p>
                <p className="text-6xl font-bold text-blue-600">{totalScore}</p>
                <p className={`text-xl font-bold mt-2 ${totalScore > 14 ? 'text-red-600' : 'text-gray-800'}`}>{result.level}</p>
              </div>
              <p className="text-center text-gray-700 mb-6">{result.text}</p>
              <div className="flex justify-center space-x-4">
                <Link to="/assessments" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                  Back to Assessments
                </Link>
                <Link to="/counseling" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                  Find a Counselor
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold text-blue-600">Taking the {test.title}</h1>
              <div className="mt-4 mb-4">
                <span className="text-xl font-bold">Question {currentQuestion + 1}</span>
                <span className="text-lg text-gray-500">/{test.questions.length}</span>
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-8">
                Over the last 2 weeks, how often have you been bothered by: <br />
                <span className="font-bold">"{test.questions[currentQuestion].questionText}"</span>
              </p>
              <div className="space-y-4">
                {answerOptions.map((option) => (
                  <button
                    key={option.score}
                    onClick={() => handleAnswerClick(option.score)}
                    className="w-full text-left bg-white p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition"
                  >
                    {option.answerText}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;