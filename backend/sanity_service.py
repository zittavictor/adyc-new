import os
import logging
import requests
import json
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class SanityService:
    def __init__(self):
        self.project_id = os.getenv('SANITY_PROJECT_ID')
        self.dataset = os.getenv('SANITY_DATASET')
        self.token = os.getenv('SANITY_API_TOKEN')
        
        if not all([self.project_id, self.dataset, self.token]):
            raise ValueError("Missing Sanity configuration. Please check environment variables.")
        
        self.base_url = f"https://{self.project_id}.api.sanity.io/v2021-06-07/data/mutate/{self.dataset}"
        self.query_url = f"https://{self.project_id}.api.sanity.io/v2021-06-07/data/query/{self.dataset}"
        
        self.headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
    
    async def create_blog_post(self, post_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new blog post in Sanity
        
        Args:
            post_data: Blog post data including title, content, youtube_url, etc.
            
        Returns:
            Dict containing the created blog post
        """
        try:
            # Generate unique document ID
            doc_id = str(uuid.uuid4())
            
            # Prepare Sanity document
            sanity_doc = {
                '_type': 'blogPost',
                '_id': doc_id,
                'title': post_data.get('title'),
                'content': post_data.get('content'),
                'summary': post_data.get('summary'),
                'author': post_data.get('author'),
                'authorEmail': post_data.get('author_email'),
                'youtubeUrl': post_data.get('youtube_url'),
                'published': post_data.get('published', False),
                'publishedAt': datetime.utcnow().isoformat() if post_data.get('published') else None,
                'createdAt': datetime.utcnow().isoformat(),
                'updatedAt': datetime.utcnow().isoformat(),
                'slug': {
                    '_type': 'slug',
                    'current': self._generate_slug(post_data.get('title', ''))
                }
            }
            
            # Create mutation
            mutation = {
                'mutations': [
                    {
                        'create': sanity_doc
                    }
                ]
            }
            
            # Send request to Sanity
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=mutation
            )
            
            response.raise_for_status()
            result = response.json()
            
            if result.get('results') and len(result['results']) > 0:
                created_doc = result['results'][0]['document']
                logger.info(f"Successfully created blog post in Sanity: {doc_id}")
                return self._format_blog_post(created_doc)
            else:
                raise ValueError("No document returned from Sanity")
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Sanity API error creating blog post: {e}")
            raise ValueError(f"Failed to create blog post in Sanity: {str(e)}")
        except Exception as e:
            logger.error(f"Error creating blog post in Sanity: {e}")
            raise ValueError(f"Failed to create blog post: {str(e)}")
    
    async def get_blog_posts(self, published_only: bool = True) -> List[Dict[str, Any]]:
        """
        Get blog posts from Sanity
        
        Args:
            published_only: Whether to return only published posts
            
        Returns:
            List of blog post dictionaries
        """
        try:
            # Build GROQ query
            filter_clause = "published == true" if published_only else "true"
            query = f"""
                *[_type == "blogPost" && {filter_clause}] | order(publishedAt desc, createdAt desc) {{
                    _id,
                    title,
                    content,
                    summary,
                    author,
                    authorEmail,
                    youtubeUrl,
                    published,
                    publishedAt,
                    createdAt,
                    updatedAt,
                    slug
                }}
            """
            
            # Send query to Sanity
            response = requests.get(
                self.query_url,
                headers=self.headers,
                params={'query': query}
            )
            
            response.raise_for_status()
            result = response.json()
            
            posts = result.get('result', [])
            formatted_posts = [self._format_blog_post(post) for post in posts]
            
            logger.info(f"Retrieved {len(formatted_posts)} blog posts from Sanity")
            return formatted_posts
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Sanity API error fetching blog posts: {e}")
            raise ValueError(f"Failed to fetch blog posts from Sanity: {str(e)}")
        except Exception as e:
            logger.error(f"Error fetching blog posts from Sanity: {e}")
            raise ValueError(f"Failed to fetch blog posts: {str(e)}")
    
    async def get_blog_post_by_id(self, post_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific blog post by ID
        
        Args:
            post_id: Sanity document ID
            
        Returns:
            Blog post dict or None if not found
        """
        try:
            query = f'*[_type == "blogPost" && _id == "{post_id}"][0]'
            
            response = requests.get(
                self.query_url,
                headers=self.headers,
                params={'query': query}
            )
            
            response.raise_for_status()
            result = response.json()
            
            post = result.get('result')
            if post:
                return self._format_blog_post(post)
            
            return None
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Sanity API error fetching blog post {post_id}: {e}")
            raise ValueError(f"Failed to fetch blog post from Sanity: {str(e)}")
        except Exception as e:
            logger.error(f"Error fetching blog post {post_id} from Sanity: {e}")
            raise ValueError(f"Failed to fetch blog post: {str(e)}")
    
    async def update_blog_post(self, post_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update a blog post in Sanity
        
        Args:
            post_id: Sanity document ID
            update_data: Fields to update
            
        Returns:
            Updated blog post dict or None if not found
        """
        try:
            # Prepare update data with timestamp
            patch_data = {**update_data}
            patch_data['updatedAt'] = datetime.utcnow().isoformat()
            
            # If publishing, set publishedAt
            if update_data.get('published') is True:
                patch_data['publishedAt'] = datetime.utcnow().isoformat()
            
            # Create mutation
            mutation = {
                'mutations': [
                    {
                        'patch': {
                            'id': post_id,
                            'set': patch_data
                        }
                    }
                ]
            }
            
            # Send request to Sanity
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=mutation
            )
            
            response.raise_for_status()
            result = response.json()
            
            if result.get('results') and len(result['results']) > 0:
                updated_doc = result['results'][0]['document']
                logger.info(f"Successfully updated blog post in Sanity: {post_id}")
                return self._format_blog_post(updated_doc)
            
            return None
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Sanity API error updating blog post {post_id}: {e}")
            raise ValueError(f"Failed to update blog post in Sanity: {str(e)}")
        except Exception as e:
            logger.error(f"Error updating blog post {post_id} in Sanity: {e}")
            raise ValueError(f"Failed to update blog post: {str(e)}")
    
    async def delete_blog_post(self, post_id: str) -> bool:
        """
        Delete a blog post from Sanity
        
        Args:
            post_id: Sanity document ID
            
        Returns:
            bool: True if deletion was successful
        """
        try:
            # Create mutation
            mutation = {
                'mutations': [
                    {
                        'delete': {
                            'id': post_id
                        }
                    }
                ]
            }
            
            # Send request to Sanity
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=mutation
            )
            
            response.raise_for_status()
            result = response.json()
            
            success = result.get('results') and len(result['results']) > 0
            
            if success:
                logger.info(f"Successfully deleted blog post from Sanity: {post_id}")
            
            return success
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Sanity API error deleting blog post {post_id}: {e}")
            return False
        except Exception as e:
            logger.error(f"Error deleting blog post {post_id} from Sanity: {e}")
            return False
    
    def _format_blog_post(self, sanity_doc: Dict[str, Any]) -> Dict[str, Any]:
        """Format Sanity document to match our API response format"""
        return {
            'id': sanity_doc.get('_id'),
            'title': sanity_doc.get('title'),
            'content': sanity_doc.get('content'),
            'summary': sanity_doc.get('summary'),
            'author': sanity_doc.get('author'),
            'author_email': sanity_doc.get('authorEmail'),
            'youtube_url': sanity_doc.get('youtubeUrl'),
            'published': sanity_doc.get('published', False),
            'published_at': sanity_doc.get('publishedAt'),
            'created_at': sanity_doc.get('createdAt'),
            'updated_at': sanity_doc.get('updatedAt'),
            'slug': sanity_doc.get('slug', {}).get('current')
        }
    
    def _generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug from title"""
        import re
        
        # Convert to lowercase and replace spaces/special chars with hyphens
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        slug = slug.strip('-')
        
        # Add timestamp to ensure uniqueness
        timestamp = str(int(datetime.utcnow().timestamp()))[-6:]
        return f"{slug}-{timestamp}" if slug else f"post-{timestamp}"

# Global instance
_sanity_service = None

def get_sanity_service() -> SanityService:
    """Get the global Sanity service instance"""
    global _sanity_service
    if _sanity_service is None:
        _sanity_service = SanityService()
    return _sanity_service