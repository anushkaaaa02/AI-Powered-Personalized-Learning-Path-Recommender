"""
PathWise Backend — Content data
Direct Python port of frontend/js/data.js so the backend is the single
source of truth for career paths, roadmaps, projects and achievements.
Keep this file in sync with frontend/js/data.js if either changes.
"""

CAREER_PATHS = {
    "frontend": {
        "id": "frontend", "name": "Frontend Developer", "icon": "◧",
        "short": "Build websites and modern digital experiences.",
        "interests": ["web"],
        "relatedSkills": ["html", "css", "javascript", "git"],
        "skills": ["HTML", "CSS", "JavaScript", "React", "Git & GitHub"],
        "goals": ["job", "projects", "skills"],
    },
    "backend": {
        "id": "backend", "name": "Backend Developer", "icon": "◫",
        "short": "Build APIs, databases, servers, and application systems.",
        "interests": ["web"],
        "relatedSkills": ["javascript", "java", "python", "sql", "git", "linux"],
        "skills": ["Node.js", "Databases", "REST APIs", "SQL", "Git & GitHub"],
        "goals": ["job", "projects", "skills"],
    },
    "ai": {
        "id": "ai", "name": "AI / ML Engineer", "icon": "◈",
        "short": "Build intelligent systems using AI and machine learning.",
        "interests": ["ai"],
        "relatedSkills": ["python", "sql"],
        "skills": ["Python", "Statistics", "Machine Learning", "Deep Learning", "Data Handling"],
        "goals": ["job", "skills", "explore"],
    },
    "data": {
        "id": "data", "name": "Data Analyst", "icon": "◩",
        "short": "Transform data into useful insights.",
        "interests": ["data"],
        "relatedSkills": ["sql", "python", "javascript"],
        "skills": ["SQL", "Excel", "Python", "Data Visualization", "Statistics"],
        "goals": ["job", "skills", "explore"],
    },
    "cyber": {
        "id": "cyber", "name": "Cybersecurity Analyst", "icon": "◭",
        "short": "Protect systems, networks, and digital information.",
        "interests": ["cyber"],
        "relatedSkills": ["linux", "sql", "c"],
        "skills": ["Networking", "Linux", "Security Fundamentals", "Ethical Hacking", "Risk Analysis"],
        "goals": ["job", "skills", "explore"],
    },
    "mobile": {
        "id": "mobile", "name": "Mobile App Developer", "icon": "◪",
        "short": "Build applications for Android and mobile platforms.",
        "interests": ["mobile"],
        "relatedSkills": ["java", "javascript", "git"],
        "skills": ["Kotlin/Java", "Mobile UI", "APIs", "Git & GitHub", "App Deployment"],
        "goals": ["job", "projects", "skills"],
    },
}

ROADMAPS = {
    "frontend": [
        {"phase": "Phase 01", "title": "Foundations", "topics": [
            {"id": "f1", "name": "Internet & Web Basics"},
            {"id": "f2", "name": "HTML Fundamentals"},
            {"id": "f3", "name": "CSS Fundamentals"},
            {"id": "f4", "name": "Responsive Web Design"},
        ]},
        {"phase": "Phase 02", "title": "Core Skills", "topics": [
            {"id": "f5", "name": "JavaScript Basics"},
            {"id": "f6", "name": "Functions"},
            {"id": "f7", "name": "Arrays & Objects"},
            {"id": "f8", "name": "DOM Manipulation"},
            {"id": "f9", "name": "Events"},
            {"id": "f10", "name": "Git & GitHub"},
        ]},
        {"phase": "Phase 03", "title": "Advanced Skills", "topics": [
            {"id": "f11", "name": "React Fundamentals"},
            {"id": "f12", "name": "Working with APIs"},
            {"id": "f13", "name": "State Management"},
            {"id": "f14", "name": "Deployment"},
        ]},
        {"phase": "Phase 04", "title": "Build & Showcase", "topics": [
            {"id": "f15", "name": "Personal Portfolio"},
            {"id": "f16", "name": "Weather Application"},
            {"id": "f17", "name": "Task Manager"},
            {"id": "f18", "name": "E-Commerce Website"},
        ]},
    ],
    "backend": [
        {"phase": "Phase 01", "title": "Foundations", "topics": [
            {"id": "b1", "name": "How the Web Works"},
            {"id": "b2", "name": "Programming Fundamentals"},
            {"id": "b3", "name": "Command Line & Git"},
        ]},
        {"phase": "Phase 02", "title": "Core Skills", "topics": [
            {"id": "b4", "name": "Node.js Basics"},
            {"id": "b5", "name": "Building REST APIs"},
            {"id": "b6", "name": "Databases & SQL"},
            {"id": "b7", "name": "Authentication"},
        ]},
        {"phase": "Phase 03", "title": "Advanced Skills", "topics": [
            {"id": "b8", "name": "Caching & Performance"},
            {"id": "b9", "name": "Testing APIs"},
            {"id": "b10", "name": "Deployment & Hosting"},
        ]},
        {"phase": "Phase 04", "title": "Build & Showcase", "topics": [
            {"id": "b11", "name": "Task API Service"},
            {"id": "b12", "name": "E-Commerce Backend"},
            {"id": "b13", "name": "Full Stack Integration"},
        ]},
    ],
    "ai": [
        {"phase": "Phase 01", "title": "Foundations", "topics": [
            {"id": "a1", "name": "Python Basics"},
            {"id": "a2", "name": "Math for AI"},
            {"id": "a3", "name": "Data Handling with Pandas"},
        ]},
        {"phase": "Phase 02", "title": "Core Skills", "topics": [
            {"id": "a4", "name": "Statistics & Probability"},
            {"id": "a5", "name": "Machine Learning Basics"},
            {"id": "a6", "name": "Model Evaluation"},
        ]},
        {"phase": "Phase 03", "title": "Advanced Skills", "topics": [
            {"id": "a7", "name": "Neural Networks"},
            {"id": "a8", "name": "Deep Learning Frameworks"},
            {"id": "a9", "name": "Model Deployment"},
        ]},
        {"phase": "Phase 04", "title": "Build & Showcase", "topics": [
            {"id": "a10", "name": "Prediction Model Project"},
            {"id": "a11", "name": "AI Learning Assistant"},
        ]},
    ],
    "data": [
        {"phase": "Phase 01", "title": "Foundations", "topics": [
            {"id": "d1", "name": "Excel & Spreadsheets"},
            {"id": "d2", "name": "SQL Basics"},
            {"id": "d3", "name": "Data Cleaning"},
        ]},
        {"phase": "Phase 02", "title": "Core Skills", "topics": [
            {"id": "d4", "name": "Python for Data"},
            {"id": "d5", "name": "Data Visualization"},
            {"id": "d6", "name": "Statistics Fundamentals"},
        ]},
        {"phase": "Phase 03", "title": "Advanced Skills", "topics": [
            {"id": "d7", "name": "Dashboards"},
            {"id": "d8", "name": "Storytelling with Data"},
        ]},
        {"phase": "Phase 04", "title": "Build & Showcase", "topics": [
            {"id": "d9", "name": "Sales Insights Dashboard"},
            {"id": "d10", "name": "Expense Tracker Analysis"},
        ]},
    ],
    "cyber": [
        {"phase": "Phase 01", "title": "Foundations", "topics": [
            {"id": "c1", "name": "Networking Basics"},
            {"id": "c2", "name": "Linux Essentials"},
        ]},
        {"phase": "Phase 02", "title": "Core Skills", "topics": [
            {"id": "c3", "name": "Security Fundamentals"},
            {"id": "c4", "name": "Threats & Vulnerabilities"},
            {"id": "c5", "name": "Cryptography Basics"},
        ]},
        {"phase": "Phase 03", "title": "Advanced Skills", "topics": [
            {"id": "c6", "name": "Ethical Hacking Basics"},
            {"id": "c7", "name": "Risk Assessment"},
        ]},
        {"phase": "Phase 04", "title": "Build & Showcase", "topics": [
            {"id": "c8", "name": "Home Lab Security Audit"},
            {"id": "c9", "name": "Incident Response Plan"},
        ]},
    ],
    "mobile": [
        {"phase": "Phase 01", "title": "Foundations", "topics": [
            {"id": "m1", "name": "Mobile Dev Basics"},
            {"id": "m2", "name": "Kotlin/Java Fundamentals"},
        ]},
        {"phase": "Phase 02", "title": "Core Skills", "topics": [
            {"id": "m3", "name": "UI Layouts"},
            {"id": "m4", "name": "Navigation & State"},
            {"id": "m5", "name": "Working with APIs"},
        ]},
        {"phase": "Phase 03", "title": "Advanced Skills", "topics": [
            {"id": "m6", "name": "Local Storage & Databases"},
            {"id": "m7", "name": "App Deployment"},
        ]},
        {"phase": "Phase 04", "title": "Build & Showcase", "topics": [
            {"id": "m8", "name": "To-Do Mobile App"},
            {"id": "m9", "name": "Weather Mobile App"},
        ]},
    ],
}

PROJECTS = {
    "beginner": [
        {"name": "Personal Portfolio", "desc": "Showcase your work with a clean, responsive personal site.", "skills": ["HTML", "CSS"], "time": "1 week"},
        {"name": "Calculator", "desc": "A functional calculator that handles core arithmetic operations.", "skills": ["JavaScript"], "time": "3 days"},
        {"name": "To-Do List", "desc": "A task manager with add, complete, and delete functionality.", "skills": ["HTML", "CSS", "JavaScript"], "time": "4 days"},
    ],
    "intermediate": [
        {"name": "Weather Application", "desc": "Fetch and display live weather data for any city.", "skills": ["JavaScript", "APIs"], "time": "1-2 weeks"},
        {"name": "Expense Tracker", "desc": "Track income and expenses with charts and summaries.", "skills": ["JavaScript", "Charts"], "time": "2 weeks"},
        {"name": "Movie Search Application", "desc": "Search and browse movies using a public API.", "skills": ["JavaScript", "APIs"], "time": "1-2 weeks"},
    ],
    "advanced": [
        {"name": "E-Commerce Website", "desc": "A full storefront with cart, checkout, and product pages.", "skills": ["React", "State Management"], "time": "3-4 weeks"},
        {"name": "Full Stack Application", "desc": "An end-to-end app with a database-backed API.", "skills": ["Backend", "Database", "Frontend"], "time": "4+ weeks"},
        {"name": "AI Learning Assistant", "desc": "A chat-style assistant that helps learners with study topics.", "skills": ["APIs", "AI Integration"], "time": "3-4 weeks"},
    ],
}

ACHIEVEMENTS = {
    "firstStep": {"name": "First Step", "desc": "Complete your first topic.", "icon": "🚩"},
    "consistentLearner": {"name": "Consistent Learner", "desc": "Maintain a learning streak.", "icon": "🔥"},
    "projectBuilder": {"name": "Project Builder", "desc": "Complete your first project.", "icon": "🛠"},
    "pathExplorer": {"name": "Path Explorer", "desc": "Complete an entire learning phase.", "icon": "🧭"},
}


def flat_topics(path_id: str):
    """Flatten a path's roadmap into a single ordered list of topics."""
    roadmap = ROADMAPS.get(path_id, [])
    topics = []
    for phase in roadmap:
        for t in phase["topics"]:
            topics.append({**t, "phase": phase["title"]})
    return topics


def total_topics(path_id: str) -> int:
    return len(flat_topics(path_id))


def default_progress() -> dict:
    return {
        "completedTopics": [],
        "currentTopic": None,
        "progressPercentage": 0,
        "lastActive": None,
        "streak": 0,
        "completedProjects": [],
    }


def default_achievements() -> dict:
    return {
        "firstStep": False,
        "consistentLearner": False,
        "projectBuilder": False,
        "pathExplorer": False,
    }
