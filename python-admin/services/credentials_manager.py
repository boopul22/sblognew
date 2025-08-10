"""
Credentials manager for securely storing and retrieving login credentials.
"""

import os
import json
import base64
from pathlib import Path
from typing import Optional, Dict, Any
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


class CredentialsManager:
    """Manages secure storage and retrieval of login credentials."""
    
    def __init__(self):
        self.credentials_dir = Path.home() / '.blog_admin'
        self.credentials_file = self.credentials_dir / 'credentials.enc'
        self.key_file = self.credentials_dir / '.key'
        
        # Create directory if it doesn't exist
        self.credentials_dir.mkdir(exist_ok=True)
        
        # Set proper permissions (readable only by owner)
        try:
            os.chmod(self.credentials_dir, 0o700)
        except:
            pass  # Ignore permission errors on Windows
    
    def _get_or_create_key(self) -> bytes:
        """Get or create encryption key."""
        if self.key_file.exists():
            try:
                with open(self.key_file, 'rb') as f:
                    return f.read()
            except:
                pass
        
        # Generate new key
        key = Fernet.generate_key()
        
        try:
            with open(self.key_file, 'wb') as f:
                f.write(key)
            os.chmod(self.key_file, 0o600)  # Readable only by owner
        except:
            pass  # Ignore permission errors on Windows
        
        return key
    
    def _encrypt_data(self, data: str) -> bytes:
        """Encrypt data using Fernet encryption."""
        key = self._get_or_create_key()
        fernet = Fernet(key)
        return fernet.encrypt(data.encode())
    
    def _decrypt_data(self, encrypted_data: bytes) -> str:
        """Decrypt data using Fernet encryption."""
        key = self._get_or_create_key()
        fernet = Fernet(key)
        return fernet.decrypt(encrypted_data).decode()
    
    def save_credentials(self, email: str, password: str, remember: bool = True) -> bool:
        """Save login credentials securely."""
        if not remember:
            # If remember is False, delete existing credentials
            self.clear_credentials()
            return True
        
        try:
            credentials = {
                'email': email,
                'password': password,
                'saved_at': str(Path(__file__).stat().st_mtime)  # Simple timestamp
            }
            
            # Convert to JSON and encrypt
            json_data = json.dumps(credentials)
            encrypted_data = self._encrypt_data(json_data)
            
            # Save to file
            with open(self.credentials_file, 'wb') as f:
                f.write(encrypted_data)
            
            # Set proper permissions
            try:
                os.chmod(self.credentials_file, 0o600)
            except:
                pass
            
            return True
            
        except Exception as e:
            print(f"Error saving credentials: {e}")
            return False
    
    def load_credentials(self) -> Optional[Dict[str, str]]:
        """Load saved credentials."""
        if not self.credentials_file.exists():
            return None
        
        try:
            # Read and decrypt file
            with open(self.credentials_file, 'rb') as f:
                encrypted_data = f.read()
            
            json_data = self._decrypt_data(encrypted_data)
            credentials = json.loads(json_data)
            
            # Return only email and password
            return {
                'email': credentials.get('email', ''),
                'password': credentials.get('password', '')
            }
            
        except Exception as e:
            print(f"Error loading credentials: {e}")
            # If there's an error, clear the corrupted file
            self.clear_credentials()
            return None
    
    def has_saved_credentials(self) -> bool:
        """Check if there are saved credentials."""
        return self.credentials_file.exists()
    
    def clear_credentials(self) -> bool:
        """Clear saved credentials."""
        try:
            if self.credentials_file.exists():
                self.credentials_file.unlink()
            return True
        except Exception as e:
            print(f"Error clearing credentials: {e}")
            return False
    
    def get_credentials_info(self) -> Dict[str, Any]:
        """Get information about saved credentials without revealing them."""
        if not self.has_saved_credentials():
            return {
                'has_credentials': False,
                'email': None,
                'saved_at': None
            }
        
        try:
            credentials = self.load_credentials()
            if credentials:
                return {
                    'has_credentials': True,
                    'email': credentials['email'],
                    'saved_at': 'Available'
                }
        except:
            pass
        
        return {
            'has_credentials': False,
            'email': None,
            'saved_at': None
        }


# Global credentials manager instance
credentials_manager = CredentialsManager()
