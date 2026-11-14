# File Organizer (Python)

Sorts the files in a folder into subfolders by type. Standard library only — nothing to install.

## Categories
| Folder | Extensions |
|---|---|
| Images | .jpg .jpeg .png .gif .bmp .webp .svg .heic |
| Documents | .pdf .doc .docx .txt .md .xls .xlsx .ppt .pptx .csv |
| Videos | .mp4 .mkv .avi .mov .wmv .webm |
| Audio | .mp3 .wav .flac .ogg .m4a |
| Archives | .zip .rar .7z .tar .gz |
| Others | everything else |

## How to run
```bash
# Preview first (moves nothing):
python organizer.py ~/Downloads --dry-run

# Actually organise the folder:
python organizer.py ~/Downloads
```

## Safety
- Files are only **moved**, never deleted.
- The script itself is never moved.
- If a file with the same name already exists in the destination folder, the new file is renamed (e.g. `photo_1.jpg`) instead of overwriting.

## Self-test
```bash
python test_organizer.py
```
It creates temporary folders with sample files, runs the organizer (dry-run and real run), and checks every file lands in the right folder.

## Files
- `organizer.py` — the organizer
- `test_organizer.py` — self-test
