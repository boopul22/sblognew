"""
Environment configuration loader for the blog admin desktop application.
Reads configuration from the parent directory's .env.local file to maintain
consistency with the main Next.js application.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from typing import Optional, Dict, Any


class EnvironmentLoader:
    """Loads and manages environment configuration."""
    
    def __init__(self):
        self._config: Dict[str, Any] = {}
        self._loaded = False
        self.load_environment()
    
    def load_environment(self) -> None:
        """Load environment variables from .env.local file."""
        if self._loaded:
            return
            
        # Get the parent directory (main project root)
        current_dir = Path(__file__).parent.parent
        parent_dir = current_dir.parent
        env_file = parent_dir / '.env.local'
        
        # Also check for .env file as fallback
        env_fallback = parent_dir / '.env'
        
        # Load environment variables
        if env_file.exists():
            load_dotenv(env_file)
            print(f"✅ Loaded environment from: {env_file}")
        elif env_fallback.exists():
            load_dotenv(env_fallback)
            print(f"✅ Loaded environment from: {env_fallback}")
        else:
            print(f"⚠️  No .env.local or .env file found in: {parent_dir}")
            print("Please ensure your environment file exists with the required configuration.")
        
        # Cache configuration
        self._config = {
            # Supabase Configuration
            'supabase_url': os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
            'supabase_anon_key': os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
            'supabase_service_key': os.getenv('SUPABASE_SERVICE_KEY'),
            
            # Cloudflare R2 Configuration
            'r2_access_key_id': os.getenv('CLOUDFLARE_R2_ACCESS_KEY_ID'),
            'r2_secret_access_key': os.getenv('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
            'r2_bucket_name': os.getenv('CLOUDFLARE_R2_BUCKET_NAME', 'blog-images'),
            'r2_endpoint': os.getenv('CLOUDFLARE_R2_ENDPOINT'),
            'r2_public_url': os.getenv('CLOUDFLARE_R2_PUBLIC_URL'),
            'r2_account_id': os.getenv('CLOUDFLARE_ACCOUNT_ID'),
            
            # API Configuration
            'api_base_url': os.getenv('NEXT_PUBLIC_API_BASE', 'http://localhost:3000'),
            'storage_provider': os.getenv('NEXT_PUBLIC_STORAGE_PROVIDER', 'cloudflare-r2'),
            
            # Application Configuration
            'node_env': os.getenv('NODE_ENV', 'development'),
            'app_name': 'Blog Admin Desktop',
            'app_version': '1.0.0',
        }
        
        self._loaded = True
        self._validate_configuration()
    
    def _validate_configuration(self) -> None:
        """Validate that required configuration is present."""
        required_fields = [
            ('supabase_url', 'NEXT_PUBLIC_SUPABASE_URL'),
            ('supabase_anon_key', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        ]
        
        missing_fields = []
        for field_key, env_var in required_fields:
            if not self._config.get(field_key):
                missing_fields.append(env_var)
        
        if missing_fields:
            print(f"❌ Missing required environment variables: {', '.join(missing_fields)}")
            print("Please check your .env.local file and ensure all required variables are set.")
        else:
            print("✅ Core configuration validated successfully")
        
        # Validate R2 configuration if using cloudflare-r2 storage
        if self._config.get('storage_provider') == 'cloudflare-r2':
            r2_required = [
                ('r2_access_key_id', 'CLOUDFLARE_R2_ACCESS_KEY_ID'),
                ('r2_secret_access_key', 'CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
                ('r2_endpoint', 'CLOUDFLARE_R2_ENDPOINT'),
            ]
            
            r2_missing = []
            for field_key, env_var in r2_required:
                if not self._config.get(field_key):
                    r2_missing.append(env_var)
            
            if r2_missing:
                print(f"⚠️  Missing R2 configuration: {', '.join(r2_missing)}")
                print("Image upload functionality may not work properly.")
            else:
                print("✅ R2 storage configuration validated")
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get a configuration value."""
        return self._config.get(key, default)
    
    def get_supabase_config(self) -> Dict[str, str]:
        """Get Supabase configuration."""
        return {
            'url': self._config['supabase_url'],
            'anon_key': self._config['supabase_anon_key'],
            'service_key': self._config['supabase_service_key'],
        }
    
    def get_r2_config(self) -> Dict[str, str]:
        """Get Cloudflare R2 configuration."""
        return {
            'access_key_id': self._config['r2_access_key_id'],
            'secret_access_key': self._config['r2_secret_access_key'],
            'bucket_name': self._config['r2_bucket_name'],
            'endpoint': self._config['r2_endpoint'],
            'public_url': self._config['r2_public_url'],
            'account_id': self._config['r2_account_id'],
        }
    
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self._config.get('node_env') == 'development'
    
    def print_config_summary(self) -> None:
        """Print a summary of the loaded configuration."""
        print("\n" + "="*50)
        print("CONFIGURATION SUMMARY")
        print("="*50)
        print(f"App Name: {self._config['app_name']}")
        print(f"Version: {self._config['app_version']}")
        print(f"Environment: {self._config['node_env']}")
        print(f"Storage Provider: {self._config['storage_provider']}")
        print(f"API Base URL: {self._config['api_base_url']}")
        print(f"Supabase URL: {self._config['supabase_url'][:50]}..." if self._config['supabase_url'] else "Supabase URL: Not configured")
        print(f"R2 Bucket: {self._config['r2_bucket_name']}")
        print("="*50 + "\n")


# Global configuration instance
config = EnvironmentLoader()
