# The investigation state

> DRAFT — a worksheet. Once the shape settles this becomes the spec for what the state IS, and the
> reasons move into a decision record.

One plain data object that describes what the user is looking at. A click and a typed sentence both
produce the same kind of small **change** to it. It is the only thing the LLM may touch.

**It is the question, not the answer.** A music player's state is *which track, what position, what
volume, what's queued* — never the audio. This state says *earthquakes near Etna, M ≥ 2, last 30
days* — never the earthquakes.

Two tests any version of it must pass:

1. **Save it, reload the page, load it back.** Same view? Then nothing important lives outside it.
2. **Could a button produce this change as easily as a sentence could?** Then natural language is a
   shortcut and not the only way in.

---

## Part 1 — describe three views as plain data

Write each as JSON-ish. Invent whatever field names feel right; there is no correct answer yet. The
point is to find out where it gets awkward.

### View A

> Etna. Earthquakes above magnitude 2, from the last 30 days.

```jsonc
{

}
```

### View B

> The same — plus today's wind, and I have clicked on one particular earthquake.

```jsonc
{

}
```

Things to notice as you write it: there are now two kinds of thing on the map. Do they share a time
window? ("Last 30 days of wind" is not what was asked for.) And the clicked earthquake — how do you
point at it without copying it in?

### View C

> Kīlauea. Earthquakes from the 2018 eruption, alongside a plume simulation run with an 8 km column.

```jsonc
{

}
```

Things to notice: the time window is now fixed dates in the past, not "last N days". One thing on
the map was OBSERVED and the other was SIMULATED. And the 8 km — does that number live in this
object, or somewhere this object points to?

---

## Part 2 — four decisions hiding in those views

A sentence or two each. "Not sure, leaning X because Y" is a fine answer.

**1. Is the camera in the state?** Where the map is centred, zoom, tilt. For: "fly me to Etna" is
something a sentence should be able to do, and a shared link should open on the same view. Against:
the camera changes sixty times a second while you drag.

>

**2. "Last 30 days" — store the words, or the two dates?** You save this investigation today and
open it next month. Should it show the same earthquakes it showed today, or the latest ones? Which
of those does CLAUDE.md's "preserve reproducibility" want — and is that always what a person wants?

>

**3. The 8 km plume.** A simulation takes minutes and has inputs (column height, wind field, model
version). Where do those live — inside the state, or in a record of the run that the state points to
by id? What does the state look like *while the run is still going*?

>

**4. One filter shape, or one per kind of thing?** Earthquakes filter by magnitude and depth. Wind
has no magnitude. Option one: a general `filter: { [anything]: anything }` that works for
everything. Option two: each kind of thing declares exactly the filters it has. Which one lets the
compiler catch "minimum magnitude of wind"? Which one is tempting anyway, and why?

>

---

## Part 3 — the changes (after Parts 1 and 2)

List the changes that got you from an empty map to View B, one per line, as if each were a message:

```
1.
2.
3.
4.
```

That list is the vocabulary the LLM gets, and the same vocabulary the buttons use.
