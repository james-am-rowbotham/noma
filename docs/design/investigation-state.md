# The investigation state

One plain data object describing what the user is looking at. A click and a typed sentence produce
the same kind of small **change** to it, and it is the only thing the LLM may touch.

**It is the question, not the answer.** A music player's state is *which track, what position, what
volume, what's queued* — never the audio. This state says *earthquakes near Etna, M ≥ 2, last 30
days* — never the earthquakes.

Two tests any version of it must pass:

1. **Save it, reload the page, load it back.** Same view? Then nothing important lives outside it.
2. **Could a button produce this change as easily as a sentence could?** Then natural language is a
   shortcut and not the only way in.

The shape below is the one the design handoff arrived with ([explorer.md](explorer.md)), read back
in Noma's terms. It is a draft until it is built.

## Three kinds of state, and only one of them is the investigation

The handoff keeps all three in one object. They have to be told apart, because they answer to
different rules.

| | What it holds | Saved? | Shareable? | LLM may change? |
|---|---|---|---|---|
| **Investigation** | which system, which filter, which overlays, what time | yes | yes | yes |
| **Conversation** | the thread, and per answer the investigation state that produced it | yes | yes | appends only |
| **Layout** | dock height, viewport size, which panel is folded, whether the spotlight is auto-cycling, the open ask-menu, the theme | no | no | no |

Layout state changes constantly and means nothing to anyone else. Putting it in the same object as
the investigation is how a shared link ends up carrying somebody's window size.

## The investigation

* **Where.** Either the world, optionally with a filter, or one open system.
* **The filter**, in the world: the question asked, a label and count to show, and the set it
  resolved to.
* **Overlays**, in a system: ash forecast, lava paths, places, earthquakes, plume — each on or off.
* **When.** Now, or a position in the past. Everything on screen agrees with this one value: past
  pauses the streams, marks them *historical*, and hides the live plume.

## The conversation

A thread of questions, each with its answer — title, body, evidence class, supporting points,
sources — **and the investigation state that produced it**. That last field is what makes "Show on
map" possible, and it is what makes the thread a record of an investigation rather than a transcript.

Threads are saved and listed ("previous chats"), which quietly requires accounts. That is deferred
(domain model, point 16), so until then a thread lives for as long as the tab does.

## The changes

The whole vocabulary, shared by the buttons and the LLM. The handoff calls them `mapOps`, returned
from `ask(question, context) → {answer, evidence, sources, mapOps}`:

```
filter        the world to a named set          "show volcanoes like Etna"
fit           the camera to the current set     (usually implied by filter)
open / close  a system                          a click on a marker, or "take me to Etna"
overlay       on or off                         "where would lava flow?"
time          jump to a moment or back to now   "what did this look like in December?"
```

The camera is **not** in the state. It is derived: the view fits to whatever the state says is being
looked at. That is deliberate — "fly me to Etna" stays expressible, a shared link reopens the same
view, and dragging the map does not write state sixty times a second.

## Open

**How a saved window means "the same earthquakes" or "the latest ones".** The handoff stores the
resolved *set of items*, so reopening a saved answer shows exactly what was seen. That is
reproducible in the strongest sense and it cannot be refreshed: the set cannot re-run against today's
data, and a set of ids will not survive an agency revising its catalogue. A stored *predicate*
re-runs but shows different earthquakes than the answer described. Noma probably needs both — the
predicate, and the answer's set as a snapshot beside it — and that is a decision, not a detail.

**One filter shape, or one per kind of thing.** Unresolved, and the handoff does not resolve it: its
filter is a materialised result set rather than a predicate, so nothing yet has to say that wind has
no magnitude.

**Where a model run's inputs live.** Deferred with simulations. A run takes minutes and has inputs —
column height, wind field, model version — and the state needs to describe one that is still going.
