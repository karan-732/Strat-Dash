"""
Everything the sprint holds for a phase, assembled in the order the agents
should weigh it.

This is what makes each phase a continuation rather than a fresh start: the
engagement and its destination, who was in the room, what the client could not
supply, the notes typed by hand, the data room, earlier deliverables, the two
previous outputs, and every question already put to the client — with its
answer where one came back.
"""

from __future__ import annotations

import json
from typing import Any

from app.domain import playbook


def _scope_rule(scope: str) -> str:
    if "process" in (scope or "").lower():
        return (
            "Sprint scope: SINGLE PROCESS-LEVEL SPRINT. The unit of analysis is ONE named process "
            "end to end. Diagnose it step by step - every step, handoff, system, wait, exception "
            "and rework loop in the order work actually moves - and quantify at step level. Do not "
            "spread the analysis across departments or rank functions against each other; where a "
            "neighbouring function appears, treat it only as an input or output of this process."
        )
    return (
        "Sprint scope: DEPARTMENT-LEVEL SPRINT. The unit of analysis is a whole function or "
        "department. Diagnose ACROSS the processes it owns - compare them, size the value in each, "
        "and rank them - so the sprint can select which process to take into forensics. Do not "
        "collapse the work into a single process."
    )


def build(
    *,
    engagement: dict[str, Any],
    phase: int,
    state: dict[str, Any],
    packs: dict[int, Any],
    questions: list[dict[str, Any]],
    include_room: bool = True,
) -> str:
    lines: list[str] = [
        f"Client: {engagement['name']}",
        f"Sector: {engagement['sector']}",
        f"Website: {engagement.get('url') or 'not supplied'}",
        _scope_rule(engagement.get("scope", "")),
        f"Engagement notes: {engagement.get('notes') or 'none'}",
    ]

    if engagement.get("brief"):
        lines.append(f"What this sprint is for, in the consultant's words: {engagement['brief']}")

    metrics = engagement.get("success_metrics") or []
    if metrics:
        lines.append(
            "The destination this sprint is measured against, captured before any phase ran:\n"
            + "\n".join(
                f"- {m['metric']}: {m.get('baseline') or '?'} → {m.get('target') or '?'}"
                f"{' ' + m['horizon'] if m.get('horizon') else ''}"
                f"{'  [PRIMARY]' if m.get('is_primary') else ''}"
                for m in metrics
            )
        )

    links = state.get("links") or []
    if links:
        lines.append("Pasted source links: " + "; ".join(x["url"] for x in links))

    # inputs the client could not supply
    na: list[str] = []
    for row in state.get("inputs", []):
        if row["state"] != "na" or row["phase"] > phase:
            continue
        ph = playbook.phase(row["phase"])
        if row["input_index"] < len(ph["inputs"]):
            na.append(f"[P{ph['num']}] {ph['inputs'][row['input_index']]}")
    if na:
        lines.append(
            "Inputs the client could not supply - benchmark these against the sector and mark the "
            "figure as derived:\n" + "\n".join(f"- {x}" for x in na)
        )

    # who was in the room
    attended = {(r["phase"], r["participant_index"]) for r in state.get("attendance", [])}
    rooms: list[str] = []
    for i in range(phase + 1):
        ph = playbook.phase(i)
        expected = [(j, w) for j, w in enumerate(ph["participants"]) if not w.startswith("No broad")]
        if not expected:
            continue
        present = [w for j, w in expected if (i, j) in attended]
        missing = [w for j, w in expected if (i, j) not in attended]
        rooms.append(
            f"[Phase {ph['num']}] present: {'; '.join(present) if present else 'not recorded'}"
            + (f"\n  not in the room: {'; '.join(missing)}" if missing else "")
        )
    if rooms:
        lines.append(
            "Who was in the room for each phase. Where someone the playbook asks for was absent, "
            "say plainly which conclusions rest on an unverified view rather than presenting them "
            "as settled:\n" + "\n".join(rooms)
        )

    # notes typed by the consultant
    notes = [r for r in state.get("notes", []) if r["phase"] <= phase and r["body"]]
    if notes:
        lines.append(
            "Manually entered information:\n"
            + "\n\n".join(
                f"[Phase {playbook.phase(r['phase'])['num']} - entered by the consultant, treat as "
                f"first-hand client evidence]\n{r['body']}"
                for r in sorted(notes, key=lambda r: r["phase"])
            )
        )

    files = [f for f in state.get("files", []) if f["phase"] <= phase] if include_room else []
    if files:
        lines.append(
            "Data room: "
            + "; ".join(
                f"{f['name']}{' [text read]' if f.get('extracted_text') else ' [contents not parsed]'}"
                for f in files
            )
        )
        parsed = [f for f in files if f.get("extracted_text")]
        if parsed:
            lines.append(
                "Verbatim extracts from the uploaded files and meeting transcripts - treat these as "
                "first-hand client evidence, and note any question already put to the client inside "
                "them:\n" + "\n\n".join(f"[{f['name']}]\n{f['extracted_text'][:6000]}" for f in parsed[:4])
            )

    # earlier deliverable drafts
    priors = [
        d for d in state.get("deliverables", []) if d["phase"] < phase and (d.get("draft") or "").strip()
    ]
    if priors:
        lines.append(
            "Earlier phase deliverables (extracts):\n"
            + "\n".join(
                f"- [Phase {playbook.phase(d['phase'])['num']}] "
                f"{playbook.phase(d['phase'])['docs'][d['doc_number'] - 1]['name']}: {d['draft'][:900]}"
                for d in priors[:6]
            )
        )

    """
    Every earlier pack, not just the last two.

    Each phase is built on the ones before it, so a phase that cannot see Phase
    0's value tree while writing a Phase 5 business case will quietly reinvent
    it. The two nearest phases are carried at full width because this phase
    argues directly with them; the earlier ones are carried narrower so the
    whole chain fits without crowding out the live sources.
    """
    carried = []
    for i in range(phase):
        if i not in packs:
            continue
        width = 4000 if i >= phase - 2 else 1600
        carried.append(
            f"[Phase {playbook.phase(i)['num']} - {playbook.phase(i)['title']} output]\n"
            f"{json.dumps(packs[i])[:width]}"
        )
    if carried:
        lines.append(
            "EVERY OUTPUT PACK BUILT BEFORE THIS PHASE, oldest first. This phase is a continuation "
            "of them, not a fresh start: carry their figures forward, name the priorities they "
            "selected, reuse their definitions, and never contradict one without saying which new "
            "evidence moved it:\n" + "\n\n".join(carried)
        )

    # questions, with answers where they came back
    asked = [q for q in questions if q["kind"] == "open" and q["phase"] < phase]
    if asked:
        answered = [q for q in asked if q.get("answered_at")]
        still_open = [q for q in asked if not q.get("answered_at")]
        if answered:
            lines.append(
                "Answers the client has given to earlier questions. These are first-hand evidence - "
                "prefer them over any benchmark:\n"
                + "\n".join(
                    f"- [P{playbook.phase(q['phase'])['num']}] {q['body']}\n  ANSWER: {q['answer']}"
                    for q in answered
                )
            )
        if still_open:
            lines.append(
                "Questions put to the client at the end of the earlier phases and still unanswered. "
                "Do not assume they were answered:\n"
                + "\n".join(f"- [P{playbook.phase(q['phase'])['num']}] {q['body']}" for q in still_open)
            )

    return "\n".join(lines)


def digest(text: str) -> str:
    """A stable fingerprint of the context, so a regenerate can say nothing changed."""
    import hashlib

    return hashlib.sha256(text.encode()).hexdigest()[:32]
