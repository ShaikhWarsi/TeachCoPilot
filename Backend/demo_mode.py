"""
Demo Mode 2.0 - Mock OCR and LLM for demo purposes
Replaces real backend with simulated responses optimized for 4 PDFs
"""

import random
from typing import Dict, List, Any
from datetime import datetime

# Demo mode configuration
DEMO_MODE = True
DEFAULT_SUBJECT = "Python"
OPTIMIZED_FOR_PDFS = 4  # Optimized for 4 PDFs in batch upload

# Mock evaluation responses for Python subject
PYTHON_EVALUATIONS = [
    {
        "score": 95,
        "feedback": "Excellent work! Your Python code demonstrates strong understanding of fundamental concepts. The solution is well-structured and follows best practices.",
        "mistakes": ["Minor syntax inconsistency in docstring format", "Could add more error handling"],
        "suggestions": ["Consider adding type hints for better code clarity", "Add unit tests to validate edge cases"]
    },
    {
        "score": 88,
        "feedback": "Good solution with solid understanding of Python concepts. The code works correctly but has room for improvement in documentation and error handling.",
        "mistakes": ["Missing docstrings for helper functions", "Inconsistent variable naming"],
        "suggestions": ["Add comprehensive docstrings following PEP 257", "Use more descriptive variable names", "Consider using context managers for file operations"]
    },
    {
        "score": 75,
        "feedback": "Satisfactory submission that addresses the main requirements. The code functions but lacks polish in structure and error handling.",
        "mistakes": ["No error handling for edge cases", "Hard-coded values that should be parameters", "Inefficient algorithm choice"],
        "suggestions": ["Add try-except blocks for error handling", "Refactor hard-coded values into function parameters", "Consider more efficient data structures"]
    },
    {
        "score": 65,
        "feedback": "Basic implementation that works but needs significant improvement. The code demonstrates understanding but lacks best practices.",
        "mistakes": ["Poor code organization", "Missing error handling", "Inefficient loops", "Magic numbers without explanation"],
        "suggestions": ["Break down large functions into smaller ones", "Add comprehensive error handling", "Optimize loop structures", "Use constants for magic numbers"]
    }
]

# Different mock texts for 4 PDFs to simulate variety
PDF_MOCK_TEXTS = [
    """
Python Assignment Solution - PDF 1

def calculate_fibonacci(n):
    '''Calculate nth Fibonacci number'''
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

def main():
    n = 10
    result = calculate_fibonacci(n)
    print(f"Fibonacci({n}) = {result}")

if __name__ == "__main__":
    main()
""",
    """
Python Programming Exercise - PDF 2

class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def get_info(self):
        return f"Student: {self.name}, Age: {self.age}"

students = []
students.append(Student("Alice", 20))
students.append(Student("Bob", 21))

for student in students:
    print(student.get_info())
""",
    """
Data Processing Assignment - PDF 3

import pandas as pd
import numpy as np

data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Score': [85, 92, 78]
}

df = pd.DataFrame(data)
mean_score = df['Score'].mean()
print(f"Mean score: {mean_score}")
""",
    """
Python File Operations - PDF 4

def read_file(filename):
    with open(filename, 'r') as f:
        content = f.read()
    return content

def write_file(filename, content):
    with open(filename, 'w') as f:
        f.write(content)

# Example usage
data = "Hello, World!"
write_file('output.txt', data)
result = read_file('output.txt')
print(result)
"""
]

def mock_extract_text(file_path: str) -> str:
    """
    Mock OCR text extraction
    Returns simulated extracted text for demo purposes
    Optimized for 4 PDFs with different content
    """
    # Return different mock texts based on file hash or index
    file_hash = hash(file_path) % len(PDF_MOCK_TEXTS)
    return PDF_MOCK_TEXTS[file_hash]

def mock_evaluate_assignment(student_text: str, assignment_context: str = "", questions_text: str = None) -> Dict[str, Any]:
    """
    Mock LLM evaluation
    Returns simulated evaluation for demo purposes
    """
    # Randomly select from predefined evaluations
    evaluation = random.choice(PYTHON_EVALUATIONS)
    
    # Add some randomness to scores for variety
    base_score = evaluation["score"]
    score_variation = random.randint(-3, 3)
    evaluation["score"] = max(0, min(100, base_score + score_variation))
    
    return evaluation

def mock_batch_evaluate(texts: List[str]) -> Dict[str, Any]:
    """
    Mock batch evaluation
    Returns simulated batch evaluation for demo purposes
    Optimized for 4 PDFs
    """
    individual_results = []
    
    # Process up to 4 PDFs (optimized for this number)
    for i, text in enumerate(texts[:OPTIMIZED_FOR_PDFS]):
        result = mock_evaluate_assignment(text)
        individual_results.append(result)
    
    # Calculate aggregate statistics
    scores = [r["score"] for r in individual_results]
    avg_score = sum(scores) / len(scores) if scores else 0
    
    # Compile all mistakes
    all_mistakes = []
    for result in individual_results:
        all_mistakes.extend(result.get("mistakes", []))
    
    # Find common mistakes
    mistake_counts = {}
    for mistake in all_mistakes:
        key = mistake.lower().strip()[:50]
        mistake_counts[key] = mistake_counts.get(key, 0) + 1
    
    common_mistakes = sorted(
        [(k, v) for k, v in mistake_counts.items()],
        key=lambda x: x[1],
        reverse=True
    )[:5]
    
    # Generate summary
    score_interpretation = "excellent" if avg_score >= 90 else "good" if avg_score >= 80 else "satisfactory" if avg_score >= 70 else "needs improvement"
    summary = f"Your class performed {score_interpretation} with an average score of {avg_score:.1f}%. Focus on addressing the common mistakes identified to improve overall understanding."
    
    return {
        "average_score": round(avg_score, 1),
        "total_evaluated": len(texts[:OPTIMIZED_FOR_PDFS]),
        "common_mistakes": [m[0] for m in common_mistakes],
        "summary": summary,
        "individual_results": individual_results
    }

class MockOCRExtractor:
    """Mock OCR extractor for demo mode"""
    
    @staticmethod
    def extract_text(file_path: str, max_file_size_mb: int = 50) -> str:
        """Mock text extraction"""
        return mock_extract_text(file_path)
    
    @staticmethod
    def cleanup_file(file_path: str) -> None:
        """Mock cleanup - does nothing in demo mode"""
        pass

class MockAssignmentEvaluator:
    """Mock assignment evaluator for demo mode"""
    
    def __init__(self):
        """Initialize mock evaluator"""
        pass
    
    def evaluate(self, student_text: str, assignment_context: str = "", questions_text: str = None) -> Dict[str, Any]:
        """Mock evaluation"""
        return mock_evaluate_assignment(student_text, assignment_context, questions_text)
    
    def batch_evaluate(self, texts: List[str]) -> Dict[str, Any]:
        """Mock batch evaluation optimized for 4 PDFs"""
        return mock_batch_evaluate(texts)

# Convenience functions that replace real implementations
def extract_text(file_path: str) -> str:
    """Mock text extraction entry point"""
    return mock_extract_text(file_path)

def evaluate_assignment(student_text: str, assignment_context: str = "", questions_text: str = None) -> Dict[str, Any]:
    """Mock evaluation entry point"""
    return mock_evaluate_assignment(student_text, assignment_context, questions_text)
