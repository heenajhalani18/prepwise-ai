def calculate_match_score(skills, target_role):
    role_requirements = {
        "Amazon SDE": ["Java", "DSA", "AWS", "System Design"],
        "Google SWE": ["Python", "Algorithms", "System Design"],
        "Goldman Sachs Analyst": ["SQL", "Excel", "Python"],
        "JPMC Software Engineer": ["Java", "Spring Boot", "SQL"]
    }

    required_skills = role_requirements.get(target_role, [])

    matched = [
        skill for skill in skills
        if skill in required_skills
    ]

    score = (
        len(matched) / len(required_skills) * 100
        if required_skills else 0
    )

    missing = [
        skill for skill in required_skills
        if skill not in skills
    ]

    return {
        "score": round(score),
        "matched": matched,
        "missing": missing
    }