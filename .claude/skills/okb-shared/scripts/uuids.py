#!/usr/bin/env python3
"""Print N hidden Opus-KB tracking spans, each with a fresh UUIDv4.

Every content block in an Opus Knowledge Base page is followed by a hidden
<span data-uuid="..."> anchor. Generate them in bulk and paste one against each
block. Unused lines are harmless.

Usage:
    python3 uuids.py [count]      # default 30
    python3 uuids.py 50 --bare    # print raw UUIDs only (no span wrapper)
"""
import sys
import uuid

args = [a for a in sys.argv[1:] if not a.startswith("-")]
bare = "--bare" in sys.argv
count = int(args[0]) if args else 30

for _ in range(count):
    u = uuid.uuid4()
    if bare:
        print(u)
    else:
        print(f'<span data-uuid="{u}" style="display:none"></span>')
