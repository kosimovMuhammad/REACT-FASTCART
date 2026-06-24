The user is ending this work session. Do the following:

1. Review the conversation history from this session and identify:
   - What tasks or files were completed (be specific: file names, features built)
   - Any decisions made or problems solved
   - What is the very next step to continue in the next session

2. Write a session log entry to `.claude/session-log.md`. If the file already exists, prepend the new entry at the top (keep previous entries below). Use this format:

```
## Session: [today's date in YYYY-MM-DD format]

### Completed this session
- [bullet list of specific files created / features implemented]

### Decisions & notes
- [any non-obvious choices made, blockers encountered, or things to remember]

### Next task
[One sentence: the exact next step to pick up from — include phase name and file name]

---
```

3. Also update `ROADMAP.md`: for each task that was completed this session, change `- [ ]` to `- [x]` on the matching line.

4. After writing, confirm to the user: "Session saved. Next time, run /start to resume from: [next task description]."
