def evaluate_answer(answer):

    score = 0
    feedback = []

    if len(answer) > 50:
        score += 4
    else:
        feedback.append("Your answer is too short. Try explaining in more detail.")

    if "project" in answer.lower():
        score += 2
    else:
        feedback.append("Mention relevant projects to strengthen your answer.")

    if "challenge" in answer.lower():
        score += 2
    else:
        feedback.append("Talk about challenges you faced and how you solved them.")

    if "result" in answer.lower() or "impact" in answer.lower():
        score += 2
    else:
        feedback.append("Mention measurable impact/results if possible.")

    return {
        "score": score,
        "feedback": feedback
    }