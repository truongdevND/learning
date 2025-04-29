// QuestionModel.js

// Đáp án cho câu hỏi
export class QuestionAnswer {
  /**
   * @param {string} answer - Nội dung đáp án
   * @param {boolean} isCollect - Đáp án này có phải đúng không
   */
  constructor(answer = '', isCollect = false) {
    this.answer = answer;
    this.isCollect = isCollect;
  }
}

// Chi tiết một câu hỏi
export class QuestionDetail {
  /**
   * @param {string} question - Nội dung câu hỏi
   * @param {string} img - Đường dẫn ảnh minh họa (nếu có)
   * @param {QuestionAnswer[]} questionAnswers - Danh sách đáp án
   */
  constructor(question = '', img = '', questionAnswers = [new QuestionAnswer()]) {
    this.question = question;
    this.img = img;
    this.questionAnswers = questionAnswers;
  }
}

// Payload gửi lên API khi tạo/sửa câu hỏi
export class QuestionPayload {
  /**
   * @param {QuestionDetail[]} questionDetails - Danh sách câu hỏi
   */
  constructor(questionDetails = [new QuestionDetail()]) {
    this.questionDetails = questionDetails;
  }
} 