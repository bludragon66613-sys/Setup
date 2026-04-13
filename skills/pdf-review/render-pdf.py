#!/usr/bin/env python3
"""render-pdf.py — render every page of a PDF to PNG for visual review.

Helper script for the pdf-review skill. Outputs page-NNN.png files
suitable for reading with Claude's Read tool.

Usage:
    python render-pdf.py /path/to/input.pdf
    python render-pdf.py /path/to/input.pdf --out ~/my-review/
    python render-pdf.py /path/to/input.pdf --zoom 2.0

Default output: ~/pdf-review-temp/
Default zoom:   1.5x

Dependency: pymupdf (install via `pip install pymupdf`)
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    import fitz
except ImportError:
    sys.stderr.write("missing dependency: pip install pymupdf\n")
    sys.exit(1)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf_path", help="path to the PDF to render")
    parser.add_argument(
        "--out",
        default=str(Path.home() / "pdf-review-temp"),
        help="output directory for PNG files (default: ~/pdf-review-temp/)",
    )
    parser.add_argument(
        "--zoom",
        type=float,
        default=1.5,
        help="render zoom factor (default 1.5; use 2.0 for fine-detail QA)",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="delete any existing PNG files in the output dir before rendering",
    )
    args = parser.parse_args()

    pdf_path = Path(args.pdf_path).expanduser().resolve()
    if not pdf_path.is_file():
        sys.stderr.write(f"file not found: {pdf_path}\n")
        return 1

    out_dir = Path(args.out).expanduser()
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.clean:
        for old in out_dir.glob("page-*.png"):
            old.unlink()

    doc = fitz.open(str(pdf_path))
    mat = fitz.Matrix(args.zoom, args.zoom)
    print(f"rendering {doc.page_count} pages from {pdf_path.name} at {args.zoom}x")
    for i in range(doc.page_count):
        page = doc[i]
        pix = page.get_pixmap(matrix=mat)
        out_path = out_dir / f"page-{i + 1:03d}.png"
        pix.save(str(out_path))

    print(f"\n{doc.page_count} pages rendered to {out_dir}")
    print("\nNext: walk the pages with the Read tool and score them on")
    print("the 6-dimension rubric (alignment, typography, color, layout,")
    print("content, brand fidelity). See SKILL.md for the full workflow.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
