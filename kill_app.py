#!/usr/bin/env python3
"""
Kill script for the 4pages ventilator analysis application.
This script terminates all Node.js processes related to the application,
allowing for a fresh start.
"""

import subprocess
import sys
import platform
import time

def kill_processes():
    """Kill all Node.js related processes for the application."""
    
    system = platform.system()
    
    # Define process names to kill
    process_names = ['node', 'npm', 'react-scripts']
    
    print("🔍 Searching for running application processes...")
    
    if system == "Darwin" or system == "Linux":
        # macOS and Linux
        killed_any = False
        
        for process in process_names:
            try:
                # Find all PIDs for the process
                result = subprocess.run(
                    ['pgrep', '-f', process],
                    capture_output=True,
                    text=True
                )
                
                if result.stdout:
                    pids = result.stdout.strip().split('\n')
                    for pid in pids:
                        if pid:
                            try:
                                # Get process info to verify it's our app
                                info_result = subprocess.run(
                                    ['ps', '-p', pid, '-o', 'command='],
                                    capture_output=True,
                                    text=True
                                )
                                
                                # Check if it's related to our app
                                if ('4pages' in info_result.stdout or 
                                    'server.js' in info_result.stdout or
                                    'react-scripts' in info_result.stdout or
                                    'port 5001' in info_result.stdout or
                                    'port 3000' in info_result.stdout):
                                    
                                    print(f"🎯 Killing {process} (PID: {pid})")
                                    subprocess.run(['kill', '-9', pid])
                                    killed_any = True
                                    
                            except subprocess.CalledProcessError:
                                pass
                                
            except subprocess.CalledProcessError:
                pass
        
        # Also try to kill processes on specific ports
        ports = ['3000', '5001']
        for port in ports:
            try:
                # Find process using the port
                result = subprocess.run(
                    ['lsof', '-ti', f':{port}'],
                    capture_output=True,
                    text=True
                )
                
                if result.stdout:
                    pids = result.stdout.strip().split('\n')
                    for pid in pids:
                        if pid:
                            print(f"🎯 Killing process on port {port} (PID: {pid})")
                            subprocess.run(['kill', '-9', pid])
                            killed_any = True
                            
            except subprocess.CalledProcessError:
                pass
        
        if killed_any:
            print("✅ All application processes have been terminated.")
            print("⏳ Waiting for ports to be released...")
            time.sleep(2)
        else:
            print("ℹ️  No running application processes found.")
            
    elif system == "Windows":
        # Windows
        killed_any = False
        
        for process in process_names:
            try:
                # Kill all node processes
                result = subprocess.run(
                    ['taskkill', '/F', '/IM', f'{process}.exe'],
                    capture_output=True,
                    text=True
                )
                
                if 'SUCCESS' in result.stdout:
                    print(f"🎯 Killed {process}.exe processes")
                    killed_any = True
                    
            except subprocess.CalledProcessError:
                pass
        
        # Also kill processes on specific ports
        ports = ['3000', '5001']
        for port in ports:
            try:
                # Find process using the port
                result = subprocess.run(
                    ['netstat', '-ano', '|', 'findstr', f':{port}'],
                    capture_output=True,
                    text=True,
                    shell=True
                )
                
                if result.stdout:
                    lines = result.stdout.strip().split('\n')
                    for line in lines:
                        parts = line.split()
                        if len(parts) > 4:
                            pid = parts[-1]
                            if pid and pid.isdigit():
                                subprocess.run(['taskkill', '/F', '/PID', pid])
                                print(f"🎯 Killed process on port {port} (PID: {pid})")
                                killed_any = True
                                
            except subprocess.CalledProcessError:
                pass
        
        if killed_any:
            print("✅ All application processes have been terminated.")
            print("⏳ Waiting for ports to be released...")
            time.sleep(2)
        else:
            print("ℹ️  No running application processes found.")
    
    else:
        print(f"⚠️  Unsupported operating system: {system}")
        sys.exit(1)
    
    print("\n🚀 You can now start the application fresh with:")
    print("   npm run dev:full")
    print("   or")
    print("   npm run start:all")

def main():
    """Main function."""
    print("🛑 4pages Application Kill Script")
    print("=" * 40)
    
    # Confirm before killing
    response = input("\n⚠️  This will terminate all Node.js processes. Continue? (y/N): ")
    
    if response.lower() == 'y':
        kill_processes()
    else:
        print("❌ Operation cancelled.")
        sys.exit(0)

if __name__ == "__main__":
    main()