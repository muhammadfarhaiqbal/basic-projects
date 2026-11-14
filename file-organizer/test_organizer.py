"""Self-test for organizer.py: builds a temp folder with sample files,
runs the organizer, and checks every file ended up in the right place.
Run: python test_organizer.py
"""
import shutil
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from organizer import organise, category_for  # noqa: E402

SAMPLES = {
    "photo.jpg": "Images",
    "notes.txt": "Documents",
    "report.pdf": "Documents",
    "movie.mp4": "Videos",
    "song.mp3": "Audio",
    "backup.zip": "Archives",
    "mystery.xyz": "Others",
}


def run_once(dry_run: bool) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        folder = Path(tmp)
        for name in SAMPLES:
            (folder / name).write_text("test content")
        if dry_run:
            counts = organise(folder, dry_run=True)
            # dry-run must NOT move anything
            for name in SAMPLES:
                assert (folder / name).exists(), f"dry-run moved {name}!"
            assert sum(counts.values()) == len(SAMPLES), "dry-run count wrong"
        else:
            counts = organise(folder, dry_run=False)
            for name, category in SAMPLES.items():
                assert (folder / category / name).exists(), f"{name} not in {category}/"
                assert not (folder / name).exists(), f"{name} still in place"
            assert sum(counts.values()) == len(SAMPLES), "move count wrong"
    print(f"self-test ({'dry-run' if dry_run else 'real run'}): PASS")


def main() -> None:
    assert category_for(Path("x.JPG")) == "Images"      # case-insensitive
    assert category_for(Path("x.pdf")) == "Documents"
    assert category_for(Path("x.unknown")) == "Others"
    run_once(dry_run=True)
    run_once(dry_run=False)
    # duplicate-name safety: existing file must not be overwritten
    with tempfile.TemporaryDirectory() as tmp:
        folder = Path(tmp)
        (folder / "Images").mkdir()
        (folder / "Images" / "photo.jpg").write_text("original")
        (folder / "photo.jpg").write_text("new file")
        organise(folder, dry_run=False)
        assert (folder / "Images" / "photo.jpg").read_text() == "original"
        assert (folder / "Images" / "photo_1.jpg").read_text() == "new file"
    print("self-test (duplicate-name safety): PASS")
    print("ALL SELF-TESTS PASSED")


if __name__ == "__main__":
    main()
