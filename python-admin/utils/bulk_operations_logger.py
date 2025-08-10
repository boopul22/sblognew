"""
Specialized logging utility for bulk operations in the blog admin desktop application.
"""

import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path

from .helpers import FileHelper, DebugHelper


class BulkOperationsLogger:
    """Logger specifically for bulk operations with detailed tracking."""
    
    def __init__(self):
        self.log_dir = self._setup_log_directory()
        self.current_session_id = self._generate_session_id()
    
    def _setup_log_directory(self) -> str:
        """Setup logging directory."""
        app_data_dir = FileHelper.get_app_data_dir()
        log_dir = os.path.join(app_data_dir, 'logs', 'bulk_operations')
        FileHelper.ensure_dir_exists(log_dir)
        return log_dir
    
    def _generate_session_id(self) -> str:
        """Generate unique session ID."""
        return datetime.now().strftime("%Y%m%d_%H%M%S")
    
    def _get_log_filename(self, operation_type: str) -> str:
        """Get log filename for operation type."""
        date_str = datetime.now().strftime("%Y-%m-%d")
        return os.path.join(self.log_dir, f"bulk_{operation_type}_{date_str}.log")
    
    def _get_detailed_log_filename(self) -> str:
        """Get detailed log filename for current session."""
        return os.path.join(self.log_dir, f"bulk_operations_detailed_{self.current_session_id}.json")
    
    def log_bulk_operation_start(self, operation_type: str, post_ids: List[str], 
                                target_status: str, user_id: Optional[str] = None) -> str:
        """
        Log the start of a bulk operation.
        
        Args:
            operation_type: Type of operation (status_update, delete, etc.)
            post_ids: List of post IDs being operated on
            target_status: Target status for the operation
            user_id: ID of user performing the operation
            
        Returns:
            Operation ID for tracking
        """
        operation_id = f"{operation_type}_{self.current_session_id}_{datetime.now().strftime('%H%M%S')}"
        
        # Basic log entry
        log_message = (f"BULK OPERATION START - ID: {operation_id} | "
                      f"Type: {operation_type} | "
                      f"Posts: {len(post_ids)} | "
                      f"Target: {target_status} | "
                      f"User: {user_id or 'unknown'}")
        
        DebugHelper.log(log_message, "INFO")
        
        # Write to operation-specific log file
        log_filename = self._get_log_filename(operation_type)
        timestamp = datetime.now().isoformat()
        
        try:
            with open(log_filename, 'a', encoding='utf-8') as f:
                f.write(f"[{timestamp}] START - {log_message}\n")
                f.write(f"[{timestamp}] Post IDs: {', '.join(post_ids)}\n")
        except Exception as e:
            DebugHelper.log_error(f"Failed to write to bulk operations log: {e}")
        
        # Create detailed JSON log entry
        detailed_log = {
            'operation_id': operation_id,
            'operation_type': operation_type,
            'timestamp_start': timestamp,
            'user_id': user_id,
            'target_status': target_status,
            'post_ids': post_ids,
            'post_count': len(post_ids),
            'status': 'started'
        }
        
        self._write_detailed_log(detailed_log)
        
        return operation_id
    
    def log_bulk_operation_complete(self, operation_id: str, success: bool, 
                                  updated_count: int, failed_count: int = 0,
                                  error_message: Optional[str] = None,
                                  failed_post_ids: Optional[List[str]] = None):
        """
        Log the completion of a bulk operation.
        
        Args:
            operation_id: Operation ID from start log
            success: Whether operation was successful
            updated_count: Number of posts successfully updated
            failed_count: Number of posts that failed to update
            error_message: Error message if operation failed
            failed_post_ids: List of post IDs that failed to update
        """
        status = "SUCCESS" if success else "FAILED"
        
        log_message = (f"BULK OPERATION COMPLETE - ID: {operation_id} | "
                      f"Status: {status} | "
                      f"Updated: {updated_count} | "
                      f"Failed: {failed_count}")
        
        if error_message:
            log_message += f" | Error: {error_message}"
        
        log_level = "INFO" if success else "ERROR"
        DebugHelper.log(log_message, log_level)
        
        # Extract operation type from operation_id
        operation_type = operation_id.split('_')[0] if '_' in operation_id else 'unknown'
        log_filename = self._get_log_filename(operation_type)
        timestamp = datetime.now().isoformat()
        
        try:
            with open(log_filename, 'a', encoding='utf-8') as f:
                f.write(f"[{timestamp}] COMPLETE - {log_message}\n")
                if failed_post_ids:
                    f.write(f"[{timestamp}] Failed Post IDs: {', '.join(failed_post_ids)}\n")
                f.write(f"[{timestamp}] ---\n")
        except Exception as e:
            DebugHelper.log_error(f"Failed to write to bulk operations log: {e}")
        
        # Update detailed JSON log
        detailed_log = {
            'operation_id': operation_id,
            'timestamp_complete': timestamp,
            'success': success,
            'updated_count': updated_count,
            'failed_count': failed_count,
            'error_message': error_message,
            'failed_post_ids': failed_post_ids or [],
            'status': 'completed'
        }
        
        self._update_detailed_log(operation_id, detailed_log)
    
    def log_bulk_operation_progress(self, operation_id: str, processed_count: int, 
                                  total_count: int, current_batch: int = 0):
        """
        Log progress of a bulk operation.
        
        Args:
            operation_id: Operation ID from start log
            processed_count: Number of posts processed so far
            total_count: Total number of posts to process
            current_batch: Current batch number being processed
        """
        progress_percent = (processed_count / total_count * 100) if total_count > 0 else 0
        
        log_message = (f"BULK OPERATION PROGRESS - ID: {operation_id} | "
                      f"Progress: {processed_count}/{total_count} ({progress_percent:.1f}%) | "
                      f"Batch: {current_batch}")
        
        DebugHelper.log(log_message, "DEBUG")
        
        # Update detailed JSON log with progress
        detailed_log = {
            'operation_id': operation_id,
            'timestamp_progress': datetime.now().isoformat(),
            'processed_count': processed_count,
            'total_count': total_count,
            'progress_percent': progress_percent,
            'current_batch': current_batch,
            'status': 'in_progress'
        }
        
        self._update_detailed_log(operation_id, detailed_log)
    
    def _write_detailed_log(self, log_entry: Dict[str, Any]):
        """Write detailed log entry to JSON file."""
        detailed_log_file = self._get_detailed_log_filename()
        
        try:
            # Read existing logs
            logs = []
            if os.path.exists(detailed_log_file):
                with open(detailed_log_file, 'r', encoding='utf-8') as f:
                    try:
                        logs = json.load(f)
                    except json.JSONDecodeError:
                        logs = []
            
            # Add new log entry
            logs.append(log_entry)
            
            # Write back to file
            with open(detailed_log_file, 'w', encoding='utf-8') as f:
                json.dump(logs, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            DebugHelper.log_error(f"Failed to write detailed log: {e}")
    
    def _update_detailed_log(self, operation_id: str, update_data: Dict[str, Any]):
        """Update existing detailed log entry."""
        detailed_log_file = self._get_detailed_log_filename()
        
        try:
            logs = []
            if os.path.exists(detailed_log_file):
                with open(detailed_log_file, 'r', encoding='utf-8') as f:
                    try:
                        logs = json.load(f)
                    except json.JSONDecodeError:
                        logs = []
            
            # Find and update the log entry
            for log_entry in logs:
                if log_entry.get('operation_id') == operation_id:
                    log_entry.update(update_data)
                    break
            
            # Write back to file
            with open(detailed_log_file, 'w', encoding='utf-8') as f:
                json.dump(logs, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            DebugHelper.log_error(f"Failed to update detailed log: {e}")
    
    def get_recent_operations(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent bulk operations from logs.
        
        Args:
            limit: Maximum number of operations to return
            
        Returns:
            List of recent operation log entries
        """
        detailed_log_file = self._get_detailed_log_filename()
        
        try:
            if not os.path.exists(detailed_log_file):
                return []
            
            with open(detailed_log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
            
            # Sort by timestamp and return most recent
            logs.sort(key=lambda x: x.get('timestamp_start', ''), reverse=True)
            return logs[:limit]
            
        except Exception as e:
            DebugHelper.log_error(f"Failed to read recent operations: {e}")
            return []
    
    def cleanup_old_logs(self, days_to_keep: int = 30):
        """
        Clean up old log files.
        
        Args:
            days_to_keep: Number of days of logs to keep
        """
        try:
            cutoff_date = datetime.now().timestamp() - (days_to_keep * 24 * 60 * 60)
            
            for filename in os.listdir(self.log_dir):
                file_path = os.path.join(self.log_dir, filename)
                if os.path.isfile(file_path):
                    file_mtime = os.path.getmtime(file_path)
                    if file_mtime < cutoff_date:
                        os.remove(file_path)
                        DebugHelper.log(f"Cleaned up old log file: {filename}", "INFO")
                        
        except Exception as e:
            DebugHelper.log_error(f"Failed to cleanup old logs: {e}")


# Global logger instance
bulk_logger = BulkOperationsLogger()
