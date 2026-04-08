"""
Analytics Engine for Classroom Insights
Generates statistics, visualizations data, and LLM-powered insights
"""

import os
from typing import List, Dict, Any
from collections import Counter
from classroom_models import Submission, Classroom, store
from llm import AssignmentEvaluator


class ClassroomAnalytics:
    """Generate analytics for a classroom's submissions"""
    
    def __init__(self, classroom_id: str):
        self.classroom_id = classroom_id
        self.submissions = store.get_submissions(classroom_id)
        self.classroom = store.get_classroom(classroom_id)
    
    def generate_full_analytics(self) -> Dict[str, Any]:
        """Generate complete analytics package"""
        if not self.submissions:
            return self._empty_analytics()
        
        # Basic stats
        scores = [s.score for s in self.submissions if s.score is not None]
        
        analytics = {
            'overview': self._generate_overview(scores),
            'score_distribution': self._generate_score_distribution(scores),
            'pass_fail_ratio': self._generate_pass_fail_ratio(scores),
            'common_mistakes': self._generate_common_mistakes(),
            'weakest_concepts': self._generate_weakest_concepts(),
            'student_ranking': self._generate_student_ranking(),
            'detailed_results': self._generate_detailed_results(),
            'class_insight': self._generate_class_insight(scores),
            'timestamp': self._get_timestamp()
        }
        
        # Save to store
        store.save_analytics(self.classroom_id, analytics)
        
        return analytics
    
    def _generate_overview(self, scores: List[float]) -> Dict[str, Any]:
        """Generate high-level overview stats"""
        if not scores:
            return {}
        
        sorted_scores = sorted(scores)
        total = len(scores)
        
        return {
            'total_students': total,
            'average_score': round(sum(scores) / total, 1),
            'highest_score': max(scores),
            'lowest_score': min(scores),
            'median_score': sorted_scores[len(sorted_scores) // 2] if total > 0 else 0,
            'passing_rate': round(len([s for s in scores if s >= 60]) / total * 100, 1),
            'at_risk_count': len([s for s in scores if s < 50]),
            'excellent_count': len([s for s in scores if s >= 90])
        }
    
    def _generate_score_distribution(self, scores: List[float]) -> List[Dict[str, Any]]:
        """Generate data for score distribution bar chart"""
        ranges = [
            {'range': '90-100', 'min': 90, 'max': 100, 'label': 'Excellent'},
            {'range': '80-89', 'min': 80, 'max': 89, 'label': 'Good'},
            {'range': '70-79', 'min': 70, 'max': 79, 'label': 'Average'},
            {'range': '60-69', 'min': 60, 'max': 69, 'label': 'Below Average'},
            {'range': '0-59', 'min': 0, 'max': 59, 'label': 'At Risk'}
        ]
        
        distribution = []
        for r in ranges:
            count = len([s for s in scores if r['min'] <= s <= r['max']])
            distribution.append({
                'range': r['range'],
                'label': r['label'],
                'count': count,
                'percentage': round(count / len(scores) * 100, 1) if scores else 0
            })
        
        return distribution
    
    def _generate_pass_fail_ratio(self, scores: List[float]) -> Dict[str, Any]:
        """Generate pass vs fail ratio for pie chart"""
        passing = len([s for s in scores if s >= 60])
        failing = len([s for s in scores if s < 60])
        
        return {
            'passing': passing,
            'failing': failing,
            'passing_percentage': round(passing / len(scores) * 100, 1) if scores else 0,
            'failing_percentage': round(failing / len(scores) * 100, 1) if scores else 0
        }
    
    def _generate_common_mistakes(self) -> List[Dict[str, Any]]:
        """Generate most common mistakes across all submissions"""
        all_mistakes = []
        for sub in self.submissions:
            all_mistakes.extend(sub.mistakes)
        
        # Count frequencies
        mistake_counts = Counter(all_mistakes)
        
        # Get top mistakes
        top_mistakes = []
        for mistake, count in mistake_counts.most_common(10):
            # Calculate frequency percentage
            total_submissions = len(self.submissions)
            frequency = round(count / total_submissions * 100, 1)
            
            top_mistakes.append({
                'mistake': mistake,
                'count': count,
                'frequency': frequency,
                'impact': 'high' if frequency > 50 else 'medium' if frequency > 25 else 'low'
            })
        
        return top_mistakes
    
    def _generate_weakest_concepts(self) -> List[Dict[str, Any]]:
        """Identify weakest concepts based on mistake patterns"""
        # This is a simplified version - in production, use NLP to extract concepts
        common_mistakes = self._generate_common_mistakes()
        
        # Group related mistakes (simplified)
        concepts = []
        for mistake in common_mistakes[:5]:
            concepts.append({
                'concept': mistake['mistake'][:50] + '...' if len(mistake['mistake']) > 50 else mistake['mistake'],
                'affected_students': mistake['count'],
                'mastery_rate': round(100 - mistake['frequency'], 1)
            })
        
        return concepts
    
    def _generate_student_ranking(self) -> List[Dict[str, Any]]:
        """Generate ranked list of students"""
        ranked = []
        for sub in self.submissions:
            ranked.append({
                'student_name': sub.student_name,
                'score': sub.score,
                'performance_level': sub.get_performance_level(),
                'performance_color': sub.get_performance_color(),
                'submission_id': sub.id
            })
        
        # Sort by score descending
        ranked.sort(key=lambda x: x['score'], reverse=True)
        
        # Add rank
        for i, student in enumerate(ranked):
            student['rank'] = i + 1
        
        return ranked
    
    def _generate_detailed_results(self) -> List[Dict[str, Any]]:
        """Generate detailed results for each submission"""
        results = []
        for sub in self.submissions:
            results.append({
                'submission_id': sub.id,
                'student_name': sub.student_name,
                'file_name': sub.file_name,
                'score': sub.score,
                'feedback': sub.feedback,
                'mistakes': sub.mistakes,
                'suggestions': sub.suggestions,
                'performance_level': sub.get_performance_level(),
                'date_submitted': sub.date_submitted
            })
        
        return results
    
    def _generate_class_insight(self, scores: List[float]) -> str:
        """Generate LLM-powered class insight summary"""
        try:
            # Prepare context
            overview = self._generate_overview(scores)
            common_mistakes = self._generate_common_mistakes()
            
            # Build prompt for LLM
            prompt = f"""Analyze this classroom's performance and provide a brief, actionable summary for the teacher.

Class: {self.classroom.name if self.classroom else 'Unknown'}
Subject: {self.classroom.subject if self.classroom else 'General'}
Assignment: {self.classroom.assignment_title if self.classroom else 'Unknown'}

Performance Stats:
- Total Students: {overview.get('total_students', 0)}
- Average Score: {overview.get('average_score', 0)}/100
- Passing Rate: {overview.get('passing_rate', 0)}%
- At Risk Students: {overview.get('at_risk_count', 0)}
- Excellent Students: {overview.get('excellent_count', 0)}

Top Issues:
{chr(10).join([f"- {m['mistake'][:80]}... ({m['frequency']}% of students)" for m in common_mistakes[:3]]) if common_mistakes else 'No major issues identified'}

Write a 2-3 paragraph summary that:
1. Describes overall class performance
2. Identifies the most critical area needing attention
3. Provides one actionable recommendation for the teacher

Be encouraging but honest. Focus on constructive next steps."""
            
            # Use LLM to generate insight
            evaluator = AssignmentEvaluator()
            response = evaluator.client.chat.completions.create(
                model=evaluator.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert teaching assistant providing class performance summaries."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.4,
                max_tokens=400
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating class insight: {e}")
            # Fallback insight
            avg = round(sum(scores) / len(scores), 1) if scores else 0
            if avg >= 80:
                return f"The class is performing well with an average score of {avg}%. Most students demonstrate strong understanding of the material. Continue with current teaching approach while providing additional support to struggling students."
            elif avg >= 60:
                return f"The class shows an average score of {avg}%, indicating moderate comprehension. Consider reviewing challenging concepts and providing additional practice opportunities for students scoring below 70%."
            else:
                return f"The class average of {avg}% suggests significant challenges with the material. A comprehensive review session is recommended, focusing on foundational concepts before moving forward."
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def _empty_analytics(self) -> Dict[str, Any]:
        """Return empty analytics structure"""
        return {
            'overview': {
                'total_students': 0,
                'average_score': 0,
                'highest_score': 0,
                'lowest_score': 0,
                'passing_rate': 0
            },
            'score_distribution': [],
            'pass_fail_ratio': {'passing': 0, 'failing': 0},
            'common_mistakes': [],
            'weakest_concepts': [],
            'student_ranking': [],
            'detailed_results': [],
            'class_insight': 'No submissions yet. Upload student assignments to generate analytics.',
            'timestamp': self._get_timestamp()
        }


def generate_classroom_analytics(classroom_id: str) -> Dict[str, Any]:
    """Convenience function to generate analytics for a classroom"""
    analytics = ClassroomAnalytics(classroom_id)
    return analytics.generate_full_analytics()
