import os

target_dir = r"c:\Users\prasanna\.gemini\antigravity\scratch\college-event-management"

replacements = {
    "EventoR": "EventorHub",
    "eventor": "eventorhub",
    "EVENTOR": "EVENTORHUB"
}

extensions = ('.html', '.py', '.js', '.css', '.md')

for root, dirs, files in os.walk(target_dir):
    if '.git' in root or '__pycache__' in root or 'venv' in root:
        continue
    for file in files:
        if file.endswith(extensions) and file != 'replace_script.py':
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for old, new in replacements.items():
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {path}")
            except Exception as e:
                print(f"Error {path}: {e}")
