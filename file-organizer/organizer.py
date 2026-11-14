#!/usr/bin/env python3
"""File Organizer — sort files in a folder into subfolders by type.

Usage:
    python organizer.py <folder>            # organise <folder>
    python organizer.py <folder> --dry-run  # preview only, move nothing

Categories (by file extension):
    Images    .jpg .jpeg .png .gif .bmp .webp .svg .heic
    Documents .pdf .doc .docx .txt .md .xls .xlsx .ppt .pptx .csv
    Videos    .mp4 .mkv .avi .mov .wmv .webm
    Audio     .mp3 .wav .flac .ogg .m4a
    Archives  .zip .rar .7z .tar .gz
    Others    everything else

Safety rules:
- Files are only MOVED, never deleted.
- The script itself is never moved.
- Files already inside a category folder are left alone.
- If a file with the same name already exists in the destination,
  the new file is renamed (e.g. photo_1.jpg) instead of overwriting.
"""
import argparse
import shutil
import sys
from pathlib import Path

CATEGORIES = {
    "Images": {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg", ".heic"},
    "Documents": {".pdf", ".doc", ".docx", ".txt", ".md", ".xls", ".xlsx", ".ppt", ".pptx", ".csv"},
    "Videos": {".mp4", ".mkv", ".avi", ".mov", ".wmv", ".webm"},
    "Audio": {".mp3", ".wav", ".flac", ".ogg", ".m4a"},
    "Archives": {".zip", ".rar", ".7z", ".tar", ".gz"},
}


def category_for(path: Path) -> str:
    ext = path.suffix.lower()
    for category, extensions in CATEGORIES.items():
        if ext in extensions:
            return category
    return "Others"


def unique_destination(dest_dir: Path, filename: str) -> Path:
    """Return a destination path that does not overwrite an existing file."""
    dest = dest_dir / filename
    if not dest.exists():
        return dest
    stem = Path(filename).stem
    suffix = Path(filename).suffix
    counter = 1
    while True:
        candidate = dest_dir / f"{stem}_{counter}{suffix}"
        if not candidate.exists():
            return candidate
        counter += 1


def organise(folder: Path, dry_run: bool = False) -> dict:
    """Move files in `folder` into category subfolders. Returns counts per category."""
    if not folder.is_dir():
        print(f"Error: '{folder}' is not a folder.")
        sys.exit(1)

    counts = {}
    script_name = Path(__file__).resolve().name
    for item in sorted(folder.iterdir()):
        if not item.is_file():
            continue  # skip folders (including category folders already made)
        if item.resolve().name == script_name and item.parent.resolve() == Path(__file__).resolve().parent:
            continue  # never move this script itself
        category = category_for(item)
        dest_dir = folder / category
        dest = unique_destination(dest_dir, item.name)
        counts[category] = counts.get(category, 0) + 1
        if dry_run:
            print(f"[dry-run] {item.name} -> {category}/{dest.name}")
        else:
            dest_dir.mkdir(exist_ok=True)
            shutil.move(str(item), str(dest))
            print(f"Moved {item.name} -> {category}/{dest.name}")
    return counts


def main() -> None:
    parser = argparse.ArgumentParser(description="Organise files in a folder by type.")
    parser.add_argument("folder", help="Folder to organise")
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview what would happen without moving anything")
    args = parser.parse_args()
    counts = organise(Path(args.folder), dry_run=args.dry_run)
    total = sum(counts.values())
    if total == 0:
        print("Nothing to organise — no files found.")
    else:
        print(f"\n{'(Preview) ' if args.dry_run else ''}Done: {total} file(s) organised.")
        for category in sorted(counts):
            print(f"  {category}: {counts[category]}")


if __name__ == "__main__":
    main()
