from pydantic import BaseModel

class AnswerRequest(BaseModel):
    answer: str
    session_id: str
    email: str
class InterviewEvaluationRequest(BaseModel):
    question: str
    answer: str