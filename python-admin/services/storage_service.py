"""
Storage service for handling image uploads to Cloudflare R2.
Integrates with the existing API endpoints for presigned URL generation.
"""

import os
import mimetypes
import requests
from datetime import datetime
from typing import Optional, Tuple, Dict, Any
from pathlib import Path
from PIL import Image
import io

from config.env_loader import config
from config.settings import IMAGE_CONFIG


class StorageService:
    """Service class for handling file uploads to Cloudflare R2."""
    
    def __init__(self):
        self.api_base_url = config.get('api_base_url', 'http://localhost:3000')
        self.r2_config = config.get_r2_config()
        self.public_url = self.r2_config.get('public_url', '')
    
    def upload_image(self, file_path: str, custom_filename: Optional[str] = None) -> Tuple[bool, str, Optional[str]]:
        """
        Upload an image file to R2 storage.
        
        Args:
            file_path: Path to the local image file
            custom_filename: Optional custom filename (will be sanitized)
        
        Returns:
            Tuple of (success, message, public_url)
        """
        try:
            # Validate file
            if not os.path.exists(file_path):
                return False, "File does not exist", None
            
            # Check file size
            file_size = os.path.getsize(file_path)
            if file_size > IMAGE_CONFIG['max_file_size']:
                return False, f"File size exceeds {IMAGE_CONFIG['max_file_size'] // (1024*1024)}MB limit", None
            
            # Check file extension
            file_ext = Path(file_path).suffix.lower()
            if file_ext not in IMAGE_CONFIG['allowed_extensions']:
                return False, f"File type {file_ext} not allowed", None
            
            # Determine content type
            content_type, _ = mimetypes.guess_type(file_path)
            if not content_type or content_type not in IMAGE_CONFIG['allowed_mime_types']:
                return False, "Invalid image file type", None
            
            # Generate filename
            if custom_filename:
                filename = self._sanitize_filename(custom_filename)
            else:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                original_name = Path(file_path).stem
                filename = f"blog-images/{timestamp}_{self._sanitize_filename(original_name)}{file_ext}"
            
            # Get presigned URL
            success, presigned_url, error_msg = self._get_presigned_url(filename, content_type)
            if not success:
                return False, error_msg, None
            
            # Upload file
            success, upload_msg = self._upload_to_r2(file_path, presigned_url, content_type)
            if not success:
                return False, upload_msg, None
            
            # Generate public URL
            public_url = self._generate_public_url(filename)
            
            return True, "Image uploaded successfully", public_url
            
        except Exception as e:
            return False, f"Upload failed: {str(e)}", None
    
    def _get_presigned_url(self, filename: str, content_type: str) -> Tuple[bool, Optional[str], str]:
        """Get presigned URL from the API."""
        try:
            url = f"{self.api_base_url}/api/r2/presigned-upload"
            payload = {
                "filename": filename,
                "contentType": content_type
            }
            
            response = requests.post(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('url'):
                    return True, data['url'], ""
                else:
                    return False, None, data.get('error', 'Failed to get presigned URL')
            else:
                return False, None, f"API error: {response.status_code}"
                
        except requests.exceptions.RequestException as e:
            return False, None, f"Network error: {str(e)}"
        except Exception as e:
            return False, None, f"Error getting presigned URL: {str(e)}"
    
    def _upload_to_r2(self, file_path: str, presigned_url: str, content_type: str) -> Tuple[bool, str]:
        """Upload file to R2 using presigned URL."""
        try:
            with open(file_path, 'rb') as file:
                headers = {'Content-Type': content_type}
                response = requests.put(presigned_url, data=file, headers=headers, timeout=60)
                
                if response.status_code == 200:
                    return True, "Upload successful"
                else:
                    return False, f"Upload failed with status {response.status_code}"
                    
        except requests.exceptions.RequestException as e:
            return False, f"Network error during upload: {str(e)}"
        except Exception as e:
            return False, f"Upload error: {str(e)}"
    
    def _generate_public_url(self, filename: str) -> str:
        """Generate public URL for uploaded file."""
        if self.public_url:
            # Keep the full filename including any prefixes like 'blog-images/'
            # The public URL should match the exact storage path
            return f"{self.public_url.rstrip('/')}/{filename}"
        else:
            # Fallback to basic URL construction
            return f"https://pub-{self.r2_config.get('account_id', '')}.r2.dev/{filename}"
    
    def _sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for safe storage."""
        # Remove or replace unsafe characters
        safe_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_."
        sanitized = ''.join(c if c in safe_chars else '_' for c in filename)
        
        # Remove multiple consecutive underscores
        while '__' in sanitized:
            sanitized = sanitized.replace('__', '_')
        
        # Remove leading/trailing underscores
        sanitized = sanitized.strip('_')
        
        return sanitized or 'unnamed'
    
    def create_thumbnail(self, image_path: str, output_path: str, size: Tuple[int, int] = None) -> bool:
        """Create a thumbnail from an image."""
        try:
            if size is None:
                size = IMAGE_CONFIG['thumbnail_size']
            
            with Image.open(image_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                # Create thumbnail
                img.thumbnail(size, Image.Resampling.LANCZOS)
                
                # Save thumbnail
                img.save(output_path, 'JPEG', quality=85, optimize=True)
                
            return True
        except Exception as e:
            print(f"Error creating thumbnail: {e}")
            return False
    
    def get_image_info(self, image_path: str) -> Optional[Dict[str, Any]]:
        """Get information about an image file."""
        try:
            with Image.open(image_path) as img:
                return {
                    'width': img.width,
                    'height': img.height,
                    'format': img.format,
                    'mode': img.mode,
                    'size': os.path.getsize(image_path),
                    'filename': os.path.basename(image_path),
                }
        except Exception as e:
            print(f"Error getting image info: {e}")
            return None
    
    def validate_image(self, image_path: str) -> Tuple[bool, str]:
        """Validate an image file."""
        try:
            # Check if file exists
            if not os.path.exists(image_path):
                return False, "File does not exist"
            
            # Check file size
            file_size = os.path.getsize(image_path)
            if file_size > IMAGE_CONFIG['max_file_size']:
                max_mb = IMAGE_CONFIG['max_file_size'] // (1024 * 1024)
                return False, f"File size exceeds {max_mb}MB limit"
            
            # Check file extension
            file_ext = Path(image_path).suffix.lower()
            if file_ext not in IMAGE_CONFIG['allowed_extensions']:
                return False, f"File type {file_ext} not allowed"
            
            # Try to open and validate image
            with Image.open(image_path) as img:
                img.verify()  # Verify it's a valid image
            
            return True, "Image is valid"
            
        except Exception as e:
            return False, f"Invalid image: {str(e)}"
    
    def delete_image(self, filename: str) -> Tuple[bool, str]:
        """Delete an image from R2 storage."""
        try:
            url = f"{self.api_base_url}/api/r2/delete"
            payload = {"filename": filename}
            
            response = requests.delete(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    return True, "Image deleted successfully"
                else:
                    return False, data.get('error', 'Failed to delete image')
            else:
                return False, f"API error: {response.status_code}"
                
        except requests.exceptions.RequestException as e:
            return False, f"Network error: {str(e)}"
        except Exception as e:
            return False, f"Delete error: {str(e)}"


# Global storage service instance
storage_service = StorageService()
