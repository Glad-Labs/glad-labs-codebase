from crewai_tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import logging

from utils.data_models import BlogPost
from agents.creative_agent import CreativeAgent
from agents.image_agent import ImageAgent
from agents.qa_agent import QAAgent
from agents.editing_agent import EditingAgent

class SharedState:
    """A simple class to hold the shared BlogPost object."""
    def __init__(self, post: BlogPost):
        self.post = post

class BlogPostToolInput(BaseModel):
    """Dummy input model for our tools, as CrewAI requires one."""
    topic: str = Field(description="The main topic of the blog post.")

class ContentCreationTool(BaseTool):
    name: str = "Content Creation Tool"
    description: str = "Generates the initial draft, title, tags, and image metadata for a blog post."
    args_schema: Type[BaseModel] = BlogPostToolInput
    creative_agent: CreativeAgent
    shared_state: SharedState

    def _run(self, topic: str) -> str:
        logging.info("CrewAI Tool: Running Content Creation")
        self.shared_state.post = self.creative_agent.run(self.shared_state.post)
        return "Content draft and metadata have been successfully generated."

class ImageProcessingTool(BaseTool):
    name: str = "Image Processing Tool"
    description: str = "Generates or fetches images, uploads them to cloud storage, and updates the post content with public image URLs."
    args_schema: Type[BaseModel] = BlogPostToolInput
    image_agent: ImageAgent
    shared_state: SharedState

    def _run(self, topic: str) -> str:
        logging.info("CrewAI Tool: Running Image Processing")
        self.shared_state.post = self.image_agent.run(self.shared_state.post)
        return "Images have been processed and uploaded. The post content is updated with public URLs."

class QAReviewTool(BaseTool):
    name: str = "Quality Assurance Review Tool"
    description: str = "Performs a final quality check on the content and images. Returns an approval status."
    args_schema: Type[BaseModel] = BlogPostToolInput
    qa_agent: QAAgent
    shared_state: SharedState

    def _run(self, topic: str) -> str:
        logging.info("CrewAI Tool: Running QA Review")
        is_approved = self.qa_agent.run(self.shared_state.post)
        if is_approved:
            return "QA PASSED. The post is approved for the next step."
        else:
            reason = self.shared_state.post.qa_review.rejection_reason if self.shared_state.post.qa_review else "No reason provided."
            # Raise an exception to stop the CrewAI process
            raise Exception(f"QA FAILED: {reason}")

class EditingTool(BaseTool):
    name: str = "Final Editing Tool"
    description: str = "Performs final edits on the post content, such as fixing grammar and formatting."
    args_schema: Type[BaseModel] = BlogPostToolInput
    editing_agent: EditingAgent
    shared_state: SharedState

    def _run(self, topic: str) -> str:
        logging.info("CrewAI Tool: Running Final Editing")
        self.shared_state.post = self.editing_agent.run(self.shared_state.post)
        return "Final edits have been applied to the post."