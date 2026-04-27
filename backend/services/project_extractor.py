def extract_projects(text):
    
    project_keywords = [
        "MoodFlix",
        "Resume Analyzer",
        "Metal Price Tracking System",
        "StreeSafe"
    ]

    found_projects = []

    for project in project_keywords:
        if project.lower() in text.lower():
            found_projects.append(project)

    return found_projects