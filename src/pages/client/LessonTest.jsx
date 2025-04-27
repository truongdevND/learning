import React, { useState, useEffect } from "react";
import {
  Card,
  Radio,
  Button,
  Progress,
  message,
  Space,
  Typography,
  Spin,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import testService from "../../services/testService";

const { Title, Text } = Typography;

const LessonTest = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestQuestions();
    
    const storedAnswers = localStorage.getItem(`test_answers_${testId}`);
    
    if (storedAnswers) {
      try {
        setSelectedAnswers(JSON.parse(storedAnswers));
      } catch (e) {
        console.error("Error parsing stored answers", e);
      }
    }
  }, [testId]);

  useEffect(() => {
    if (startTime && endTime && !testCompleted) {
      const timer = setInterval(() => {
        const now = new Date();
        const end = new Date(endTime);
        const remainingSeconds = Math.max(0, Math.floor((end - now) / 1000));
        
        setTimeLeft(remainingSeconds);
        
        if (remainingSeconds <= 0) {
          clearInterval(timer);
          handleSubmit();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startTime, endTime, testCompleted]);

  useEffect(() => {
    if (Object.keys(selectedAnswers).length > 0) {
      localStorage.setItem(`test_answers_${testId}`, JSON.stringify(selectedAnswers));
    }
  }, [selectedAnswers, testId]);

  const fetchTestQuestions = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));

      const param = {
        id: testId,
        user_id: user.user_id
      };
      
      const response = await testService.getTest(param);
      
      if (response.data) {
        setStartTime(response.data.start_time);
        setEndTime(response.data.end_time);
        setAllQuestions(response.data.questions_response.questions || []);
        setTotalQuestions(response.data.questions_response.total_elements || 0);
      }
      
    } catch (error) {
      message.error("Failed to load test questions");
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });
  };

  const calculateScore = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      let correctAnswers = 0;
      
      allQuestions.forEach((question) => {
        const selectedAnswer = selectedAnswers[question.id];
        const correctAnswer = question.answers.find((answer) => answer.correct);
        if (selectedAnswer === correctAnswer?.id) {
          correctAnswers++;
        }
      });
      
      const score = (correctAnswers / allQuestions.length) * 100;
      
      const param = {
        id: testId,
        user_id: user.user_id,
        score: score
      };
      
      await testService.submitTest(param);
      return score;
    } catch (error) {
      message.error("Failed to calculate score");
      console.error("Error submitting test:", error);
      return 0;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const finalScore = await calculateScore();
      setScore(finalScore);
      setTestCompleted(true);
      
      localStorage.removeItem(`test_answers_${testId}`);
    } catch (error) {
      message.error("Failed to submit test");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#52c41a";
    if (score >= 60) return "#faad14";
    return "#f5222d";
  };

  const getTimerColor = () => {
    if (timeLeft > 600) return "text-green-500";
    if (timeLeft > 300) return "text-yellow-500";
    return "text-red-500";
  };

  const answerStyle = (answerId) => {
    const isSelected = selectedAnswers[currentQuestionData?.id] === answerId;
    return {
      borderRadius: "8px",
      border: isSelected ? "2px solid #1890ff" : "1px solid #d9d9d9",
      padding: "16px",
      marginBottom: "16px",
      transition: "all 0.3s ease",
      backgroundColor: isSelected ? "#e6f7ff" : "white",
      boxShadow: isSelected ? "0 0 8px rgba(24, 144, 255, 0.3)" : "none",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    };
  };

  const handleNextQuestion = () => {
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const jumpToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center  ">
       
            <Spin size="large" />
          
        
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="min-h-screen">
        <div className="w-full">
          <div className="text-center p-10">
            <div className="mb-4 bg-yellow-50 inline-flex rounded-full p-4">
              <TrophyOutlined className="text-6xl text-yellow-500" />
            </div>
            <Title level={2} className="mb-8 font-bold">
              Test Completed!
            </Title>

            <Progress
              type="circle"
              percent={score}
              format={(percent) => `${percent.toFixed(1)}%`}
              size={220}
              strokeColor={getScoreColor(score)}
              strokeWidth={10}
              className="my-10"
            />

            <div className="mb-10">
              <Text className="text-xl block mb-3">
                You scored{" "}
                <span
                  className="font-bold"
                  style={{ color: getScoreColor(score) }}
                >
                  {score.toFixed(1)}%
                </span>
              </Text>
              <Text className="text-gray-600 text-lg">
                {score >= 80
                  ? "Excellent work! Keep up the great effort!"
                  : score >= 60
                  ? "Good effort! With a bit more practice, you'll master this topic."
                  : "Keep practicing! You'll improve with more study."}
              </Text>
            </div>

            <Space size="large" className="mt-4">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate(-1)}
                icon={<ArrowLeftOutlined />}
                className="px-8 h-12 rounded-lg text-base"
              >
                Back to Lesson
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/courses")}
                className="px-8 h-12 rounded-lg text-base"
              >
                All Courses
              </Button>
            </Space>
          </div>
        </div>
      </div>
    );
  }

  if (!allQuestions || allQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <Card className="w-full max-w-2xl shadow-lg rounded-xl overflow-hidden">
          <div className="text-center p-12">
            <Title level={3} className="mt-6">
              No test questions available
            </Title>
            <Text className="text-gray-500">
              Please try again later or contact support
            </Text>
            <Button
              type="primary"
              className="mt-6"
              onClick={() => navigate(-1)}
            >
              Back to Lesson
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestionData = allQuestions[currentQuestion];
  const globalQuestionNumber = currentQuestion + 1;
  const isLastQuestion = globalQuestionNumber === totalQuestions;
  const isFirstQuestion = globalQuestionNumber === 1;

  if (loading && allQuestions.length > 0) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <Title level={3} className="m-0 font-bold">
            Quiz Assessment
          </Title>
          <div
            className={`flex items-center ${getTimerColor()} p-2 bg-white rounded-lg shadow-sm`}
          >
            <ClockCircleOutlined className="mr-2 text-lg" />
            <Text strong className="text-lg">
              {timeLeft !== null ? formatTime(timeLeft) : "loading..."}
            </Text>
          </div>
        </div>
        
        <div className="flex justify-center items-center p-24">
          <Spin size="large" />
          <Text className="ml-4">Loading questions...</Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-[50px]">
        <div className="flex justify-between items-center p-6 border-b">
          <Title level={3} className="m-0 font-bold">
            Quiz Assessment
          </Title>
          <div
            className={`flex items-center ${getTimerColor()} p-2 bg-white rounded-lg shadow-sm`}
          >
            <ClockCircleOutlined className="mr-2 text-lg" />
            <Text strong className="text-lg">
              {timeLeft !== null ? formatTime(timeLeft) : "loading..."}
            </Text>
          </div>
        </div>

        <div className="px-8  py-6">
          <div className="flex justify-between items-center mb-5">
            <Text className="text-gray-600 font-medium">
              Question {globalQuestionNumber} of {totalQuestions}
            </Text>
            <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
              <CheckCircleOutlined className="mr-2 text-green-500" />
              <Text strong>
                {Object.keys(selectedAnswers).length} of {totalQuestions} answered
              </Text>
            </div>
          </div>

          <Progress
            percent={(globalQuestionNumber / totalQuestions) * 100}
            showInfo={false}
            strokeColor="#4263eb"
            trailColor="#e9ecef"
            strokeWidth={8}
            className="mb-8"
          />

          {currentQuestionData ? (
            <>
              <Title level={4} className="mb-8 mt-8 font-medium">
                {globalQuestionNumber}. {currentQuestionData.question}
              </Title>

              <Radio.Group
                onChange={(e) =>
                  handleAnswerSelect(currentQuestionData.id, e.target.value)
                }
                value={selectedAnswers[currentQuestionData.id]}
                className="w-full"
              >
                <div className="space-y-4 w-full">
                  {currentQuestionData.answers.map((answer) => (
                    <div
                      key={answer.id}
                      style={answerStyle(answer.id)}
                      onClick={() =>
                        handleAnswerSelect(currentQuestionData.id, answer.id)
                      }
                      className="answer-option hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
                    >
                      <Radio value={answer.id} className="w-full">
                        <Text className="text-base ml-2">{answer.answer_text}</Text>
                      </Radio>

                      {selectedAnswers[currentQuestionData?.id] === answer.id && (
                        <div className="absolute top-0 right-0 bg-blue-500 w-6 h-6 flex items-center justify-center rounded-bl-lg">
                          <CheckCircleOutlined className="text-white text-sm" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Radio.Group>
            </>
          ) : (
            <div className="flex justify-center items-center py-12">
              <Spin />
              <Text className="ml-2">Loading question...</Text>
            </div>
          )}
        </div>

        <div className="flex justify-between p-6  border-t">
          <Button
            disabled={isFirstQuestion}
            onClick={handlePreviousQuestion}
            icon={<ArrowLeftOutlined />}
            size="large"
            className={`w-36 h-12 rounded-lg ${
              isFirstQuestion ? "opacity-50" : "hover:bg-gray-200"
            }`}
          >
            Previous
          </Button>
          {isLastQuestion ? (
            <Button
              type="primary"
              onClick={handleSubmit}
              icon={<CheckCircleOutlined />}
              size="large"
              className="w-36 h-12 rounded-lg bg-green-600 hover:bg-green-700 border-0"
            >
              Submit Test
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleNextQuestion}
              size="large"
              className="w-36 h-12 rounded-lg"
            >
              Next <ArrowRightOutlined />
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center p-4">
          <div className="flex flex-wrap gap-2 max-w-4xl justify-center mb-4">
            {Array.from({ length: totalQuestions }, (_, i) => {
              const isCurrentQuestionIndex = currentQuestion === i;
              const isAnswered = selectedAnswers[allQuestions[i]?.id];

              return (
                <div
                  key={i}
                  onClick={() => jumpToQuestion(i)}
                  className={`
                    h-8 w-8 flex items-center justify-center rounded cursor-pointer
                    transition-all duration-300 text-sm font-medium
                    ${
                      isCurrentQuestionIndex
                        ? "bg-blue-500 text-white border-2 border-blue-600"
                        : isAnswered
                        ? "bg-green-100 text-green-800 border border-green-500"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }
                  `}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonTest;