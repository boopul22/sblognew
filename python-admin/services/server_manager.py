"""
Server manager for automatically starting and managing the Next.js development server.
"""

import subprocess
import time
import requests
import threading
import os
import signal
from pathlib import Path
from typing import Optional, Tuple

from config.env_loader import config


class ServerManager:
    """Manages the Next.js development server for image uploads."""
    
    def __init__(self):
        self.process: Optional[subprocess.Popen] = None
        self.server_url = config.get('api_base_url', 'http://localhost:3001')
        self.project_root = Path(__file__).parent.parent.parent
        self.is_running = False
        self.start_timeout = 60  # seconds
        
    def is_server_running(self) -> bool:
        """Check if the server is already running."""
        try:
            response = requests.get(f"{self.server_url}/api/health", timeout=5)
            return response.status_code == 200
        except:
            try:
                # Try the main page if health endpoint doesn't exist
                response = requests.get(self.server_url, timeout=5)
                return response.status_code in [200, 404]  # 404 is fine, means server is running
            except:
                return False
    
    def start_server(self) -> Tuple[bool, str]:
        """Start the Next.js development server."""
        try:
            # Check if server is already running
            if self.is_server_running():
                print("✅ Next.js server is already running")
                self.is_running = True
                return True, "Server is already running"
            
            print("🚀 Starting Next.js development server...")
            
            # Change to project root directory
            os.chdir(self.project_root)
            
            # Start the server process
            self.process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=self.project_root
            )
            
            # Wait for server to start
            start_time = time.time()
            while time.time() - start_time < self.start_timeout:
                if self.is_server_running():
                    print(f"✅ Next.js server started successfully at {self.server_url}")
                    self.is_running = True
                    return True, f"Server started at {self.server_url}"
                
                # Check if process is still running
                if self.process.poll() is not None:
                    stdout, stderr = self.process.communicate()
                    error_msg = f"Server process exited: {stderr}"
                    print(f"❌ {error_msg}")
                    return False, error_msg
                
                time.sleep(2)
            
            # Timeout reached
            self.stop_server()
            return False, "Server startup timeout"
            
        except FileNotFoundError:
            return False, "npm not found. Please install Node.js and npm."
        except Exception as e:
            return False, f"Failed to start server: {str(e)}"
    
    def stop_server(self) -> None:
        """Stop the Next.js development server."""
        if self.process:
            try:
                print("🛑 Stopping Next.js server...")
                
                # Try graceful shutdown first
                self.process.terminate()
                
                # Wait a bit for graceful shutdown
                try:
                    self.process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    # Force kill if graceful shutdown fails
                    self.process.kill()
                    self.process.wait()
                
                print("✅ Next.js server stopped")
                
            except Exception as e:
                print(f"⚠️  Error stopping server: {e}")
            finally:
                self.process = None
                self.is_running = False
    
    def start_server_async(self) -> None:
        """Start server in a separate thread."""
        def start_worker():
            success, message = self.start_server()
            if not success:
                print(f"❌ Failed to start server: {message}")
        
        thread = threading.Thread(target=start_worker, daemon=True)
        thread.start()
    
    def ensure_server_running(self) -> Tuple[bool, str]:
        """Ensure the server is running, start it if necessary."""
        if self.is_server_running():
            return True, "Server is running"
        
        return self.start_server()
    
    def get_server_status(self) -> dict:
        """Get current server status."""
        return {
            'is_running': self.is_server_running(),
            'server_url': self.server_url,
            'process_running': self.process is not None and self.process.poll() is None,
            'project_root': str(self.project_root)
        }
    
    def __del__(self):
        """Cleanup when object is destroyed."""
        if self.process:
            self.stop_server()


# Global server manager instance
server_manager = ServerManager()
