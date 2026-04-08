"""
Classroom Data Models
In-memory storage for classrooms, submissions, and analytics
"""

import uuid
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict

# In-memory storage (replace with database in production)
class ClassroomStore:
    """Singleton storage for all classroom data"""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.classrooms = {}
            cls._instance.submissions = {}
            cls._instance.analytics = {}
            cls._instance._load_from_disk()
        return cls._instance
    
    def _get_storage_path(self):
        """Get path for persistent storage"""
        return os.path.join(os.path.dirname(__file__), 'classroom_data.json')
    
    def _load_from_disk(self):
        """Load data from JSON file if exists"""
        path = self._get_storage_path()
        if os.path.exists(path):
            try:
                with open(path, 'r') as f:
                    data = json.load(f)
                    self.classrooms = {k: Classroom.from_dict(v) for k, v in data.get('classrooms', {}).items()}
                    self.submissions = {k: [Submission.from_dict(s) for s in v] for k, v in data.get('submissions', {}).items()}
                    self.analytics = data.get('analytics', {})
            except Exception as e:
                print(f"Error loading classroom data: {e}")
    
    def _save_to_disk(self):
        """Persist data to JSON file"""
        path = self._get_storage_path()
        try:
            data = {
                'classrooms': {k: v.to_dict() for k, v in self.classrooms.items()},
                'submissions': {k: [s.to_dict() for s in v] for k, v in self.submissions.items()},
                'analytics': self.analytics
            }
            with open(path, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving classroom data: {e}")
    
    # Classroom operations
    def create_classroom(self, user_id: str, name: str, subject: str, assignment_title: str) -> 'Classroom':
        classroom = Classroom(
            id=str(uuid.uuid4()),
            user_id=user_id,
            name=name,
            subject=subject,
            assignment_title=assignment_title,
            date_created=datetime.now().isoformat()
        )
        self.classrooms[classroom.id] = classroom
        self.submissions[classroom.id] = []
        self._save_to_disk()
        return classroom
    
    def get_classroom(self, classroom_id: str, user_id: str = None) -> Optional['Classroom']:
        classroom = self.classrooms.get(classroom_id)
        if classroom and user_id and classroom.user_id != user_id:
            return None  # User doesn't own this classroom
        return classroom
    
    def get_all_classrooms(self, user_id: str = None) -> List['Classroom']:
        if user_id:
            return [c for c in self.classrooms.values() if c.user_id == user_id]
        return list(self.classrooms.values())
    
    def delete_classroom(self, classroom_id: str) -> bool:
        if classroom_id in self.classrooms:
            del self.classrooms[classroom_id]
            del self.submissions[classroom_id]
            if classroom_id in self.analytics:
                del self.analytics[classroom_id]
            self._save_to_disk()
            return True
        return False
    
    # Submission operations
    def add_submission(self, classroom_id: str, submission: 'Submission') -> bool:
        if classroom_id in self.submissions:
            self.submissions[classroom_id].append(submission)
            self._save_to_disk()
            return True
        return False
    
    def get_submissions(self, classroom_id: str) -> List['Submission']:
        return self.submissions.get(classroom_id, [])
    
    def get_submission(self, classroom_id: str, submission_id: str) -> Optional['Submission']:
        subs = self.submissions.get(classroom_id, [])
        for sub in subs:
            if sub.id == submission_id:
                return sub
        return None
    
    # Analytics operations
    def save_analytics(self, classroom_id: str, analytics: Dict[str, Any]):
        self.analytics[classroom_id] = analytics
        self._save_to_disk()
    
    def get_analytics(self, classroom_id: str) -> Optional[Dict[str, Any]]:
        return self.analytics.get(classroom_id)


@dataclass
class Classroom:
    """Represents a classroom/assignment group"""
    id: str
    user_id: str  # Owner of the classroom for user isolation
    name: str
    subject: str
    assignment_title: str
    date_created: str
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Classroom':
        return cls(**data)
    
    def get_stats(self, store: ClassroomStore) -> Dict[str, Any]:
        """Get quick stats for this classroom"""
        submissions = store.get_submissions(self.id)
        if not submissions:
            return {
                'total_students': 0,
                'average_score': 0,
                'evaluated_count': 0
            }
        
        scores = [s.score for s in submissions if s.score is not None]
        return {
            'total_students': len(submissions),
            'average_score': round(sum(scores) / len(scores), 1) if scores else 0,
            'evaluated_count': len([s for s in submissions if s.score is not None])
        }


@dataclass
class Submission:
    """Represents a single student submission"""
    id: str
    student_name: str
    file_name: str
    # extracted_text removed - not stored to save space, re-OCR if needed
    score: float
    feedback: str
    mistakes: List[str]
    suggestions: List[str]
    date_submitted: str
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Submission':
        return cls(**data)
    
    def get_performance_level(self) -> str:
        """Get performance label based on score (0-10 scale converted to 0-100)"""
        score_normalized = self.score
        if score_normalized >= 90:
            return 'Excellent'
        elif score_normalized >= 70:
            return 'Good'
        elif score_normalized >= 50:
            return 'Needs Improvement'
        else:
            return 'At Risk'
    
    def get_performance_color(self) -> str:
        """Get color for performance level"""
        score_normalized = self.score
        if score_normalized >= 90:
            return 'green'
        elif score_normalized >= 70:
            return 'blue'
        elif score_normalized >= 50:
            return 'yellow'
        else:
            return 'red'


# Global store instance
store = ClassroomStore()
