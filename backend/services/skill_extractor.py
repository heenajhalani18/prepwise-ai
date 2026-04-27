def extract_skills(text):
    
    skills_db = [
        "Python",
        "Java",
        "C++",
        "React",
        "Node.js",
        "FastAPI",
        "MongoDB",
        "SQL",
        "Machine Learning",
        "Docker",
        "JavaScript",
        "HTML",
        "CSS",
        "OpenCV",
        "NLP"
    ]

    found_skills = []

    for skill in skills_db:
        if skill.lower() in text.lower():
            found_skills.append(skill)

    return found_skills