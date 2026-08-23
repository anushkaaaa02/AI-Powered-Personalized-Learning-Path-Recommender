# 🎓 AI-Powered Personalized Learning Path Recommender

An AI-driven platform that delivers truly personalized learning experiences — understanding each learner's goals, interests, skill level, and learning history to generate a structured, adaptive roadmap of courses, projects, and assessments.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Objective](#-objective)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [How the Recommendation Engine Works](#-how-the-recommendation-engine-works)
- [Testing](#-testing)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🧭 Overview

Online learning platforms today offer thousands of courses spanning nearly every domain imaginable. Yet despite powerful recommendation systems that can suggest *individual* courses, learners are often left to figure out the right **sequence** of resources needed to reach a specific goal on their own.

Every learner is different — different skill levels, different interests, different career aspirations, and different paces of learning. A one-size-fits-all catalog simply doesn't work.

This project solves that problem with an **AI-powered Personalized Learning Path Recommender** — an intelligent assistant that understands a learner's profile, analyzes their objectives, identifies skill gaps, and generates a structured, explainable, and adaptive roadmap tailored to the individual.

## 📌 Problem Statement

> Design and build an intelligent learning assistant that recommends personalized learning paths based on a learner's interests, goals, previous learning history, and skill level. The solution should generate a structured learning roadmap, explain recommendations, and adapt suggestions based on user feedback and progress.

## 🎯 Objective

The system is designed to:

- Capture a learner's goals, interests, and current skill level through natural conversation
- Identify skill gaps between where the learner is and where they want to be
- Recommend the most relevant courses, projects, and resources
- Sequence those resources into a coherent, milestone-based roadmap
- Explain *why* each recommendation was made
- Continuously adapt the path as the learner progresses or gives feedback

## ✨ Key Features

### 💬 Conversational Interface
Learners describe their goals in plain, natural language instead of filling out rigid forms. The assistant asks clarifying questions where needed (e.g., available time per week, preferred learning style, target timeline).

### 🧑‍🎓 Learner Profiling Engine
Builds and maintains a structured learner profile capturing:
- Interests and career goals
- Current skill level per domain
- Completed courses and certifications
- Learning pace and time availability
- Preferred content formats (video, text, hands-on projects)

### 🔎 Recommendation Engine
Suggests relevant courses, projects, and learning resources using a hybrid of:
- Content-based filtering (matching skills/topics to resource metadata)
- Collaborative filtering (what similar learners found useful)
- LLM-based semantic matching for goal-to-resource relevance

### 🗺️ Personalized Learning Path Generator
Converts the recommended resources into a structured roadmap with:
- Correct prerequisite ordering
- Milestones and checkpoints
- Estimated time to completion
- Difficulty progression (beginner → advanced)

### 🤖 Explainable AI Assistant
For every recommendation, the assistant can answer:
- "Why was this suggested to me?"
- "What will I gain from this?"
- "Can I skip this if I already know X?"

### 📊 Progress Dashboard
Visualizes:
- Overall progress percentage
- Skill development over time (radar/bar charts)
- Milestones achieved vs. upcoming
- Next recommended action

### 🔄 Adaptive Feedback Loop
The path is not static — as the learner completes resources, skips them, or gives feedback ("too easy", "not relevant"), the roadmap is regenerated/adjusted in real time.

---

## 🏗️ System Architecture