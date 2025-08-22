import subprocess
import os
import sys

if os.name == 'nt':
    whitelist = {

        "list": ["dir"],
        "current_dir": ["cd"],
        "whoami": ["whoami"]

    }

else:  # Unix/Linux
    whitelist = {

        "list": ["ls", "-la"],
        "current_dir": ["pwd"],
        "whoami": ["whoami"]

    }

def run_os_command(data):
    print(f"[OS_COMMAND] Starting with data: {data}")
    
    command_key = data.get("command_key")
    print(f"[OS_COMMAND] Command key: {command_key}")
    
    if not command_key:
        return {"status": "error", "message": "command_key is required"}
    
    if command_key not in whitelist:
        available = ", ".join(whitelist.keys())

        return {"status": "error", "message": f"Invalid command_key '{command_key}'. Available: {available}"}
    
    command = whitelist[command_key]

    print(f"[OS_COMMAND] Executing: {' '.join(command)}")
    
    try:
        # Try with shell=False first (more secure)
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=10,
            shell=False
        )
        
        if result.returncode == 0:
            output = result.stdout.strip()
            print(f"[OS_COMMAND] Success: {output[:100]}...")

            return {"status": "success", "output": output, "command": " ".join(command)}

        else:
            error_msg = result.stderr.strip() or f"Command failed with return code {result.returncode}"
            print(f"[OS_COMMAND] Error: {error_msg}")

            return {"status": "error", "message": error_msg, "stdout": result.stdout, "stderr": result.stderr}
    
    except subprocess.TimeoutExpired:
        print("[OS_COMMAND] Timeout expired")

        return {"status": "error", "message": "Command timeout (10s limit exceeded)"}
    
    except FileNotFoundError as e:
        print(f"[OS_COMMAND] Command not found: {e}")

        try:
            print(f"[OS_COMMAND] Retrying with shell=True...")
            result = subprocess.run(
                " ".join(command),
                capture_output=True,
                text=True,
                timeout=10,
                shell=True
            )
            
            if result.returncode == 0:
                output = result.stdout.strip()

                return {"status": "success", "output": output, "command": " ".join(command), "note": "Used shell mode"}

            else:
                return {"status": "error", "message": result.stderr.strip() or "Command failed"}
        
        except Exception as e2:
            return {"status": "error", "message": f"Command not found and shell retry failed: {str(e2)}"}
    
    except Exception as e:
        print(f"[OS_COMMAND] Unexpected error: {e}")

        return {"status": "error", "message": f"Unexpected error: {str(e)}"}

def test_os_commands():
    print("Testing OS commands...")
    for key in whitelist.keys():
        print(f"\nTesting {key}:")
        result = run_os_command({"command_key": key})
        print(f"Result: {result}")

if __name__ == "__main__":
    test_os_commands()
