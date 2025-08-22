import subprocess
import json
from urllib.parse import urlparse
import time

def run_katana_crawl(target_url):
    print(f"[KATANA_CRAWL] Starting crawl for: {target_url}")
    
    try:
        parsed = urlparse(target_url)

        if not parsed.scheme or not parsed.netloc:
            return {"status": "error", "message": "Invalid URL format. Please include http:// or https://"}

    except Exception as e:
        return {"status": "error", "message": f"URL parsing failed: {str(e)}"}
    
    try:

        print("[KATANA_CRAWL] Checking Docker container...")
        check_cmd = ["docker", "ps", "--filter", "name=katana_crawler", "--format", "{{.Names}}"]
        result = subprocess.run(check_cmd, capture_output=True, text=True, timeout=5)
        
        if "katana_crawler" not in result.stdout:
            print("[KATANA_CRAWL] Katana container not found, trying to start it...")
            
            start_cmd = ["docker", "run", "-d", "--name", "katana_crawler", "projectdiscovery/katana"]
            start_result = subprocess.run(start_cmd, capture_output=True, text=True, timeout=30)
            
            if start_result.returncode != 0:

                return {

                    "status": "error", 
                    "message": f"Failed to start Katana container: {start_result.stderr}"

                }
            
            time.sleep(3)
        
        print("[KATANA_CRAWL] Running Katana crawl...")


        cmd = ["docker", "exec", "katana_crawler", "katana", "-u", target_url, "-d", "2", "-jc", "-silent"]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        if result.returncode != 0:

            error_msg = result.stderr.strip() if result.stderr else "Katana execution failed"

            return {

                "status": "error", 
                "message": f"Katana failed: {error_msg}",
                "target": target_url

            }
        
        if not result.stdout.strip():
            return {

                "status": "error", 
                "message": "Katana completed but found no URLs",
                "target": target_url

            }
        
        print(f"[KATANA_CRAWL] Raw output length: {len(result.stdout)}")
        print(f"[KATANA_CRAWL] First 200 chars of output: {result.stdout[:200]}")
        
        urls = []
        lines = result.stdout.strip().split("\n")
        
        for line_num, line in enumerate(lines, 1):

            if not line.strip():
                continue
                
            try:
                data = json.loads(line)

                if data.get("url"):
                    urls.append(data.get("url"))
                    continue

            except json.JSONDecodeError:
                pass
            
            line = line.strip()
            if line.startswith("http"):

                urls.append(line)

                continue
                
            if line_num <= 5:
                print(f"[KATANA_CRAWL] Unrecognized line {line_num}: {line[:100]}")
        
        if not urls:
            return {

                "status": "error", 
                "message": f"Katana completed but no valid URLs found. Output had {len(lines)} lines. Check logs for details.",
                "target": target_url,
                "raw_output_preview": result.stdout[:500] if result.stdout else "No output"

            }
        
        print(f"[KATANA_CRAWL] Success: Found {len(urls)} URLs")

        return {

            "status": "success",
            "target": target_url,
            "url_count": len(urls),
            "urls": urls[:50],
            "method": "katana"

        }
        
    except subprocess.TimeoutExpired:

        return {

            "status": "error", 
            "message": "Katana crawl timeout (60s limit exceeded)",
            "target": target_url

        }

    except FileNotFoundError:

        return {

            "status": "error", 
            "message": "Docker not found. Please ensure Docker is installed and running.",
            "target": target_url

        }

    except Exception as e:

        return {

            "status": "error", 
            "message": f"Unexpected error during Katana crawl: {str(e)}",
            "target": target_url

        }

def test_crawl():
    test_urls = ["https://example.com", "https://httpbin.org"]
    for url in test_urls:
        print(f"\nTesting crawl: {url}")
        result = run_katana_crawl(url)
        print(f"Result: {result}")

if __name__ == "__main__":
    test_crawl()
