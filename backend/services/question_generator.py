def generate_questions(skills, projects):

    questions = []

    # Project questions first (higher priority)
    for project in projects:
        questions.append(f"Explain the architecture of your project {project}.")
        questions.append(f"What challenges did you face while building {project}?")
        questions.append(f"How would you improve {project} in future?")

    # Skill questions after
    for skill in skills:
        questions.append(f"Explain your experience with {skill}.")
        questions.append(f"What challenges did you face while using {skill}?")

    return questions[:10]