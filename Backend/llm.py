"""
LLM Module - Groq integration for assignment evaluation
Uses structured prompting to generate evaluation JSON
"""

import os
import json
import re
from typing import Dict, List, Any
from groq import Groq


def validate_groq_key():
    """Validate GROQ_API_KEY is set at startup"""
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        raise ValueError(
            "❌ GROQ_API_KEY environment variable is not set!\n"
            "Please set it before running the application:\n"
            "  Windows: set GROQ_API_KEY=your_key_here\n"
            "  Linux/Mac: export GROQ_API_KEY=your_key_here\n"
            "Get your API key from: https://console.groq.com/keys"
        )
    return api_key


class AssignmentEvaluator:
    """Evaluates student assignments using Groq LLM"""
    
    def __init__(self):
        """Initialize Groq client"""
        api_key = validate_groq_key()
        self.client = Groq(api_key=api_key)
        # Using llama3-8b-8192 for good balance of speed and quality
        # Alternative: mixtral-8x7b-32768, gemma-7b-it
        self.model = "llama3-8b-8192"
    
    def evaluate(self, student_text: str, assignment_context: str = "", questions_text: str = None) -> Dict[str, Any]:
        """
        Evaluate student assignment and return structured feedback
        
        Args:
            student_text: Extracted text from student submission
            assignment_context: Optional context about the assignment
            questions_text: Optional extracted text from questions/answer key PDF
            
        Returns:
            Dictionary with score, feedback, mistakes, and suggestions
        """
        try:
            # Build the evaluation prompt
            prompt = self._build_evaluation_prompt(student_text, assignment_context, questions_text)
            
            # Call Groq API
            print("Sending evaluation request to Groq...")
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert teacher assistant. Evaluate student work objectively and provide constructive feedback. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,  # Lower temperature for consistent JSON output
                max_tokens=1500
            )
            
            # Extract and parse response
            content = response.choices[0].message.content
            print(f"Raw LLM response received (length: {len(content)})")
            
            # Parse JSON response
            evaluation = self._parse_json_response(content)
            
            # Validate and ensure all required fields
            return self._validate_evaluation(evaluation)
            
        except Exception as e:
            print(f"LLM evaluation error: {e}")
            # Return fallback evaluation on error
            return self._fallback_evaluation(str(e))
    
    def _build_evaluation_prompt(self, student_text: str, assignment_context: str = "", questions_text: str = None) -> str:
        """Build the structured evaluation prompt"""
        
        context_section = f"\nAssignment Context: {assignment_context}" if assignment_context else ""
        
        # Build questions/answer key section if provided
        questions_section = ""
        if questions_text:
            questions_section = f"""
REFERENCE MATERIAL (Questions, Answer Key, or Rubric):
```
{questions_text[:3000]}
```

IMPORTANT: Use the reference material above to:
- Check if student's answers match expected answers
- Identify which questions were answered correctly/incorrectly
- Compare student's work against provided solutions or rubric
- Score based on accuracy against the reference material
"""
        
        prompt = f"""Evaluate the following student submission:{context_section}

{questions_section}

STUDENT SUBMISSION:
```
{student_text[:4000]}
```

Evaluate based on:
1. CORRECTNESS - Accuracy of facts, calculations, and reasoning{(' (compare against reference material above)' if questions_text else '')}
2. COMPLETENESS - Whether all parts of the question were addressed
3. CLARITY - Quality of explanation and presentation

Respond ONLY with a JSON object in this exact format:
{{
    "score": <number between 0-100>,
    "feedback": "<2-3 sentence summary of overall performance>",
    "mistakes": [
        "<specific mistake 1>",
        "<specific mistake 2>"
    ],
    "suggestions": [
        "<actionable suggestion 1>",
        "<actionable suggestion 2>"
    ]
}}

Guidelines:
- Score: 90-100 = Excellent, 80-89 = Good, 70-79 = Satisfactory, 60-69 = Needs Improvement, <60 = Poor
- Feedback: Be encouraging but honest. Mention specific strengths and areas for improvement.{(' Reference specific questions from the provided material.' if questions_text else '')}
- Mistakes: List 2-4 specific errors or misconceptions found. Be constructive.
- Suggestions: Provide 2-3 actionable steps the student can take to improve.

IMPORTANT: Respond with valid JSON only. No markdown formatting, no explanation text before or after."""
        
        return prompt
    
    def _parse_json_response(self, content: str) -> Dict[str, Any]:
        """Parse JSON from LLM response, handling various formats"""
        try:
            # Try direct JSON parsing first
            return json.loads(content)
        except json.JSONDecodeError:
            print("Direct JSON parse failed, trying to extract JSON...")
            
            # Try to extract JSON from markdown code blocks
            json_match = re.search(r'```(?:json)?\s*({.*?})\s*```', content, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group(1))
                except:
                    pass
            
            # Try to find JSON between first { and last }
            json_match = re.search(r'({.*})', content, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group(1))
                except:
                    pass
            
            # If all parsing fails, raise error
            raise ValueError(f"Could not parse JSON from response: {content[:200]}")
    
    def _validate_evaluation(self, evaluation: Dict[str, Any]) -> Dict[str, Any]:
        """Ensure evaluation has all required fields with proper types"""
        
        # Default structure
        validated = {
            "score": 0,
            "feedback": "",
            "mistakes": [],
            "suggestions": []
        }
        
        # Validate score
        if "score" in evaluation:
            try:
                score = float(evaluation["score"])
                validated["score"] = max(0, min(100, score))  # Clamp between 0-100
            except:
                validated["score"] = 50
        
        # Validate feedback
        if "feedback" in evaluation and isinstance(evaluation["feedback"], str):
            validated["feedback"] = evaluation["feedback"][:500]  # Limit length
        else:
            validated["feedback"] = "Evaluation completed. See detailed feedback below."
        
        # Validate mistakes list
        if "mistakes" in evaluation and isinstance(evaluation["mistakes"], list):
            validated["mistakes"] = [
                str(m) for m in evaluation["mistakes"][:5]  # Max 5 mistakes
                if m
            ]
        
        # Validate suggestions list
        if "suggestions" in evaluation and isinstance(evaluation["suggestions"], list):
            validated["suggestions"] = [
                str(s) for s in evaluation["suggestions"][:5]  # Max 5 suggestions
                if s
            ]
        
        return validated
    
    def _fallback_evaluation(self, error_message: str) -> Dict[str, Any]:
        """Return a fallback evaluation when LLM fails"""
        return {
            "score": 0,
            "feedback": f"An error occurred during evaluation: {error_message}. Please try again or contact support.",
            "mistakes": ["Unable to analyze due to technical error"],
            "suggestions": ["Please resubmit your assignment", "Contact support if the problem persists"]
        }
    
    def batch_evaluate(self, texts: List[str]) -> Dict[str, Any]:
        """
        Evaluate multiple assignments and provide aggregate analysis
        
        Args:
            texts: List of extracted texts from multiple submissions
            
        Returns:
            Dictionary with average score, common mistakes, and summary
        """
        try:
            # Evaluate each text
            individual_results = []
            for i, text in enumerate(texts):
                print(f"Evaluating submission {i+1}/{len(texts)}...")
                result = self.evaluate(text)
                individual_results.append(result)
            
            # Calculate aggregate statistics
            scores = [r["score"] for r in individual_results if r["score"] > 0]
            avg_score = sum(scores) / len(scores) if scores else 0
            
            # Compile all mistakes
            all_mistakes = []
            for result in individual_results:
                all_mistakes.extend(result.get("mistakes", []))
            
            # Find common mistakes (simple frequency analysis)
            mistake_counts = {}
            for mistake in all_mistakes:
                # Normalize mistake text for grouping
                key = mistake.lower().strip()[:50]
                mistake_counts[key] = mistake_counts.get(key, 0) + 1
            
            # Get top common mistakes
            common_mistakes = sorted(
                [(k, v) for k, v in mistake_counts.items()],
                key=lambda x: x[1],
                reverse=True
            )[:5]
            
            # Generate summary using LLM
            summary = self._generate_batch_summary(individual_results, avg_score, common_mistakes)
            
            return {
                "average_score": round(avg_score, 1),
                "total_evaluated": len(texts),
                "common_mistakes": [m[0] for m in common_mistakes],
                "summary": summary,
                "individual_results": individual_results
            }
            
        except Exception as e:
            print(f"Batch evaluation error: {e}")
            return {
                "average_score": 0,
                "total_evaluated": len(texts),
                "common_mistakes": ["Error in batch processing"],
                "summary": f"An error occurred: {str(e)}",
                "individual_results": []
            }
    
    def _generate_batch_summary(self, results: List[Dict], avg_score: float, common_mistakes: List[tuple]) -> str:
        """Generate a summary paragraph for batch evaluation"""
        try:
            # Prepare summary prompt
            prompt = f"""Generate a brief summary (2-3 sentences) for a teacher about class performance:

Class Average Score: {avg_score:.1f}/100
Total Students: {len(results)}
Most Common Mistakes: {', '.join([m[0] for m in common_mistakes[:3]])}

Write in second person, addressing the teacher. Be encouraging and actionable."""
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful teaching assistant. Provide brief, actionable summaries."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.5,
                max_tokens=200
            )
            
            return response.choices[0].message.content.strip()
            
        except:
            # Fallback summary
            score_interpretation = "excellent" if avg_score >= 90 else "good" if avg_score >= 80 else "satisfactory" if avg_score >= 70 else "concerning"
            return f"Your class performed {score_interpretation} with an average score of {avg_score:.1f}%. Focus on addressing the common mistakes identified to improve overall understanding."


# Convenience function
def evaluate_assignment(student_text: str, assignment_context: str = "", questions_text: str = None) -> Dict[str, Any]:
    """Main entry point for assignment evaluation"""
    evaluator = AssignmentEvaluator()
    return evaluator.evaluate(student_text, assignment_context, questions_text)
