Files an issue and curates it until it carries `ready`, in three stages of the `sdlc` protocol, reading labels, board, and roles from the mapping.

## Compose

Pick the type, parent, and repository, fill the form's required fields, and meet the type's elegance bar: 4A for an Epic, 5A otherwise. A Spike's deliverable is a decision. Epics are the lead's. The draft goes to the user before filing.

## File

`gh issue create --type --parent`, with no label, onto the board when the mapping names one.

## Curate

Anyone curating an unlabeled issue reruns Compose's checks on it: a pass gets `ready`; otherwise a comment says what is missing. The owner or the lead applies the label; anyone else proposes it.
